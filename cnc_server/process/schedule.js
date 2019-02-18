const schedule = require("node-schedule");
const AppConfigService = require('../api/appconfig/AppConfigService');
const CutterLifeService = require('../api/cutterlife/CutterLifeService');
const CutterForecastService = require('../api/cutterforecast/CutterForecastService');
const CutterOptimizeService = require('../api/cutteroptimize/CutterOptimizeService');
const LogUtil = require('../utils/LogUtil');
const TimeUtil = require('../utils/TimeUtil');
const servers = require("../ipc/Server");
const IPCHelper = require("../ipc/IPCHelper");

class CSchedule{
    constructor(time, func){
        this.time = time;
        this.func = func;

        this.start();
    }

    start(){        
        let rule = new schedule.RecurrenceRule();

        rule.dayOfWeek = [0, new schedule.Range(1, 6)];

        let s = this.time.split(':');
        rule.hour = s[0];
        rule.minute = s[1];

        this.job = schedule.scheduleJob(rule, this.func);
    }

    stop(){
        this.job.cancel();
    }
}


class CMain{
    async init(){
        this.taskMap = new Map();

        let center = await AppConfigService.getCutterAutoReportConfig('0');
        let branch = await AppConfigService.getCutterAutoReportConfig('1');
        let real = await AppConfigService.getCutterAutoReportConfig('2');

        let task = null;
        let key = null;

        LogUtil.debug("branch config:");
        LogUtil.debug(branch);
        LogUtil.debug("center config:");
        LogUtil.debug(center);

        let pThis = this;
       center.forEach(e => {
            task = new CSchedule(e.trigger,  async ()=>{
                console.log("Center schedule trigger[" + e.start + "]");
                LogUtil.debug("Center schedule trigger[" + e.start + "]");

                await pThis.getAndSetCutterForecast(e.start, e.end, 0);
                LogUtil.debug("Center schedule end[" + e.start + "]");
                console.log("Center schedule end[" + e.start + "]");
            });
            
            key = 'C' + e.trigger;
            pThis.taskMap.set(key, task);
        }); 
        
        branch.forEach(e => {
            task = new CSchedule(e.trigger,  async ()=>{
                console.log("Branch schedule trigger[" + e.start + "]");
                LogUtil.debug("Branch schedule trigger[" + e.start + "]");

                await pThis.getAndSetCutterForecast(e.start, e.end, 1);
                LogUtil.debug("Branch schedule end[" + e.start + "]");
                console.log("Branch schedule end[" + e.start + "]");
            });

            key = 'B' + e.trigger;
            pThis.taskMap.set(key, task);
        });
        
        real.forEach(e => {
            task = new CSchedule(e.trigger,  async ()=>{
                console.log("Real schedule trigger[" + e.start + "]");
                LogUtil.debug("Real schedule trigger[" + e.start + "]");

                await pThis.getAndSetCutterForecast(e.start, e.end, 2);

                LogUtil.debug("Will optimize the tools");
                await pThis.doOptimizeCutter(e.trigger, e.start, e.end);

                LogUtil.debug("Real schedule end[" + e.start + "]");
                console.log("Real schedule end[" + e.start + "]");

            });
        
            key = 'R' + e.trigger;
            pThis.taskMap.set(key, task);
        }); 
    }

    /*
    sTime 为开始统计的时间的秒
    lTime 为剩余寿命下限
    hTime 为剩余寿命上限
    当department 为null时会统计所有的数据
    */
    async loadCutterDetailByCondition(department, sTime, lTime, hTime){
        let res = null;
        
        try{
            res = await CutterLifeService.getCutterDetail(department, (residual, update)=>{
                //要考虑更新cutter_life记录的时间差
                return ((residual >= lTime && residual < hTime && (update + residual*60*60) >= sTime)? true: false);
            })
        } catch (error) {
            LogUtil.logErrorWithoutCxt("<loadCutterDetailByCondition>getCutterDetail error:" + error);
        }

        return res;
    }

    /*
    获取并且设置刀具的预期寿命
        delay - 起始时间之后多少小时， 数字类型
        duration - 统计多少小时内的刀具寿命， 数字类型
        type - 类型， 0 - 总仓（一天两次）， 1 - 分仓（一天4次）
    */
    async getAndSetCutterForecast(start, end, type){
        let res = null;

        //当前的时间
        let now = TimeUtil.times();
        //开始的YYYY-MM-DD HH:mm:ss
        let sDateTime = TimeUtil.geCurString(TimeUtil.format3) + ' ' + start + ':00';
        let eDateTime = TimeUtil.geCurString(TimeUtil.format3) + ' ' + end + ':00';

        let sIntTime = parseInt(TimeUtil.toLong(sDateTime));      //开始时间 秒
        let eIntTime = parseInt(TimeUtil.toLong(eDateTime));      //结束时间 秒

        if(eIntTime <= sIntTime){    //这个表示结束时间跨天了
            eIntTime += 24 * 60 * 60;
            LogUtil.debug("End time is tomorrow");
        }
        else if(eIntTime <= now){    //这个表示开始结束都跨天了
            sIntTime += 24 * 60 * 60;
            eIntTime += 24 * 60 * 60;
            LogUtil.debug("Start And End time are tomorrow");
        }

        let sDuration = start + '-' + end    //时间段
        let lTime =  sIntTime > now? (sIntTime - now)/60/60: 0;     //统计剩余寿命的下限, 要考虑重新生成的时候在开始时间之后的情况
        let hTime = (eIntTime - now)/60/60;                         //统计剩余寿命的上限

        LogUtil.debug("Generate duration " + sDuration + ' [TYPE:' + type +']');
        res = await this.loadCutterDetailByCondition(null, sIntTime, lTime, hTime);
        console.log('get '+res.length + ' records');
        LogUtil.debug("loadCutterDetailByCondition get " + res.length + " records");
        if(res != null && res.length > 0){
            await CutterForecastService.saveData(res, now, type, sIntTime, eIntTime, sDuration);

            if(type == 2){  //实时统计数据，还需要存一份到优化表里边去
                await CutterOptimizeService.saveData(res, now, sIntTime, eIntTime);
            }
        }  

        console.log("End from getAndSetCutterForecast");
    }

    async doOptimizeCutter(trigger, start, end){
        
        await CutterOptimizeService.startDoOptimize(trigger, start, end);
    }

    
    async testGenerateOptmize(start, end){
        let res = null;

        //当前的时间
        let now = TimeUtil.times();
        //开始的YYYY-MM-DD HH:mm:ss
        let sDateTime = TimeUtil.geCurString(TimeUtil.format3) + ' ' + start + ':00';
        let eDateTime = TimeUtil.geCurString(TimeUtil.format3) + ' ' + end + ':00';

        let sIntTime = parseInt(TimeUtil.toLong(sDateTime));      //开始时间 秒
        let eIntTime = parseInt(TimeUtil.toLong(eDateTime));      //结束时间 秒

        if(eIntTime <= sIntTime){    //这个表示结束时间跨天了
            eIntTime += 24 * 60 * 60;
            LogUtil.debug("End time is tomorrow");
        }
        else if(eIntTime <= now){    //这个表示开始结束都跨天了
            sIntTime += 24 * 60 * 60;
            eIntTime += 24 * 60 * 60;
            LogUtil.debug("Start And End time are tomorrow");
        }

        let sDuration = start + '-' + end    //时间段
        let lTime =  sIntTime > now? (sIntTime - now)/60/60: 0;     //统计剩余寿命的下限, 要考虑重新生成的时候在开始时间之后的情况
        let hTime = (eIntTime - now)/60/60;                         //统计剩余寿命的上限

        LogUtil.debug("Generate duration " + sDuration + ' [TYPE:' + 2 +']');
        res = await this.loadCutterDetailByCondition(null, sIntTime, lTime, hTime);
        console.log('get '+res.length + ' records');
        LogUtil.debug("loadCutterDetailByCondition get " + res.length + " records");
        if(res != null && res.length > 0){
            await CutterForecastService.saveData(res, now, 2, sIntTime, eIntTime, sDuration);
            console.log('save data');
            await CutterOptimizeService.saveData(res, now, sIntTime, eIntTime);
            console.log('end save');
        }  

        console.log("End from getAndSetCutterForecast");
    }
}


LogUtil.debug("Schedule process start");
IPCHelper.init();
setTimeout(()=>{
    new CMain().init();
    }, 2000);
LogUtil.debug("Schedule process init ok");


// async function test(){
//     const instance = new CMain();

//     console.log('start to generate data');
//     await instance.testGenerateOptmize('14:30', '20:00');
//     console.log('do optimize');
//     await instance.doOptimizeCutter(null, '14:30', '20:00');
//     console.log('end optimize');
// }
// IPCHelper.init();
// setTimeout(()=>{
//     test();
// }, 2000);
