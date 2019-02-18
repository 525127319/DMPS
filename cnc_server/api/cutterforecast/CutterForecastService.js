const BaseService = require('../../services/BasicService');
const cutterForecast = require('../../models/CutterForecast');
const LogUtil = require('../../utils/LogUtil');
//const CommonUtil = require('../../utils/CommonUtil');
const TimeUtil = require('../../utils/TimeUtil');
const CutterLifeService = require('../cutterlife/CutterLifeService');
const AppConfigService = require('../appconfig/AppConfigService');
var xlsx = require('node-xlsx');
//'理论CT(s)', '换刀数(把)',

//let title = ['厂区', '楼层', '机种', '夹位', 'CELL', '品牌', '设备名称', '刀库号', '刀具料号', '刀具品名', '刀具规格', '预计换刀时间', '剩余寿命(小时)', '剩余寿命(次)', '标准寿命(次)', '当前寿命(次)', '机台CT(秒)', '数据生成时间', '状态(备/未备)'];

class CutterForecastService extends BaseService {
    constructor() {
        super(cutterForecast);

        this.configMap = new Map();
    }

    async getTriggerTime(start, end, type){
        if(this.configMap.size == 0){   //需要取配置

            try {
                let center = await AppConfigService.getCutterAutoReportConfig('0');
                let branch = await AppConfigService.getCutterAutoReportConfig('1');
                let real = await AppConfigService.getCutterAutoReportConfig('2');

                center.forEach( e=>{
                    let key = '0-' + e.start + e.end;
                    let val = e.trigger;

                    this.configMap.set(key, val);
                });
                branch.forEach( e=>{
                    let key = '1-' + e.start + e.end;
                    let val = e.trigger;

                    this.configMap.set(key, val);
                });
                real.forEach( e=>{
                    let key = '2-' + e.start + e.end;
                    let val = e.trigger;

                    this.configMap.set(key, val);
                });
            } catch (error) {
                LogUtil.debug(error);
            }
        }
        
        let key = type.toString() + '-' + start + end;
        return this.configMap.get(key);
            
    }

    //插入测算的刀具基础数据
    async saveData(data, now, type, start, end, sDuration){
        let sTime = TimeUtil.format(now, TimeUtil.format4);
        data.forEach(e=>{
            e.type = type;
            e.genTime = now;
            e.genTimeStr = sTime;
            e.duration = sDuration;
            e.start = start,
            e.end = end;
        })
        try {
            await super.createMany(data);
        }
        catch (error) {
            LogUtil.logErrorWithoutCxt(error);
        }
    }

    /*
    注意参数类型
    dID - string, type - Number, date - YYYY-MM-DD, start/end - hh:mm, pageIndex - Number, pageSize - Number
    */
    async getCutterForecast(dID, type, date, start, end, dev_id, pageIndex, pageSize){

        let list = [];
        try{

            let sDateTime = date + ' ' +  start + ':00';      //转换成YYYY-MM-DD hh:mm:ss
            let eDateTime = date + ' ' +  end + ':00';      //转换成YYYY-MM-DD hh:mm:ss
            
            let sTime = parseInt(TimeUtil.toLong(sDateTime));
            let eTime = parseInt(TimeUtil.toLong(eDateTime));
            
            if(eTime < sTime){
                eTime += 24 * 60 * 60;
            }
            
            //--以下是因为测试中发现有无端生成的定时数据，还没找到原因，先用触发时间来筛选出去    下个版本再去掉        
            // let sTrigger = await this.getTriggerTime(start, end, type);
            // let tDateTime = date + ' ' + sTrigger + ':00';
            // let trigger = parseInt(TimeUtil.toLong(tDateTime));
            // if(trigger >= sTime && trigger >= eTime){    //不能比开始时间和结束时间都大
            //     trigger -= 24 * 60 * 60;
            // }
            // console.log('From:' + lTime + ' = ' + TimeUtil.format(lTime, "YYYY-MM-DD H:mm:ss"));
            // console.log('To:' + gTime + ' = ' + TimeUtil.format(gTime, "YYYY-MM-DD H:mm:ss"));

            
            if(pageIndex == 0){    //所有
                if(dev_id != null){
                    list = await super.findByCondition({'department': { $regex: dID }, 'start':sTime, 'end':eTime, 'type':type, 'dev_id':dev_id});
                }
                else{
                    list = await super.findByCondition({'department': { $regex: dID }, 'start':sTime, 'end':eTime, 'type':type});
                }
            }
            else{
                if(dev_id != null){
                    list = await super.pageByCondition({'department': { $regex: dID }, 'start':sTime, 'end':eTime, 'type':type, 'dev_id':dev_id}, pageIndex, pageSize);
                }
                else{
                    list = await super.pageByCondition({'department': { $regex: dID }, 'start':sTime, 'end':eTime, 'type':type}, pageIndex, pageSize);
                }
            }
        }
        catch (error) {
            LogUtil.logErrorWithoutCxt(error);
        }

        return list;
    }
    
    
    /*
    注意参数类型
    dID - string, type - Number, date - YYYY-MM-DD, time - hh:mm
    */
   async export(dID, type, date, start, end){
        try {
            let list = await this.getCutterForecast(dID, type, date, start, end, null, 0, 0);
            let sheet = {};
            let sName = start.split(':')[0] + start.split(':')[1] + '-' + end.split(':')[0] + end.split(':')[1];
                        
            switch(type){
                case 0:
                    sheet = { name: '总仓装刀报表' + sName };
                    break;
                case 1:
                    sheet = { name: '分仓备刀报表' + sName };
                    break;
                case 2:
                    sheet = { name: '技术员换刀报表' + sName };
                    break;
                default:
                    sheet = { name: '时间段' + sName };
                    break;
            }

            // sheet.data = [title];
            // sheet.data = this.genData0(list, sheet.data);
            sheet.data = CutterLifeService.genData0(list);

            let book = [];
            book.push(sheet);
            return xlsx.build(book);
        } catch (error) {
            LogUtil.logErrorWithoutCxt(error);
            return null;
        }
    }

    /*
    以下两个接口是为了新增数据库的start, end, status 三个字段的
    */
    async updateOneRecord(val){
        try {
            let start = null;
            let end = null;
            
            if(val.start == undefined ||  val.end == undefined || val.status == undefined){
                if(val.type == 0){
                    val.start = val.genTime + 12*60*60;
                    val.end = val.genTime + 24*60*60;
                }
                else{
                    val.start = val.genTime + 6*60*60;
                    val.end = val.genTime + 12*60*60;
                }
    
                val.status = 2;
                await super.updateOrCreate({'_id':val._id}, val, { multi: true });
            }            
        } catch (error) {
            console.log("update record failed dev_id = " + val.dev_id);
        }
    }
    async updateDataBase(){
        try {
            let list = [];

            list = await super.findAll();
            if(list.length > 0){
                list.forEach(async val => {
                    if(val.start == undefined || val.end == undefined){
                        await this.updateOneRecord(val);
                    }
                });
            }
            else{
                console.log("Get database failed");
            }
        
        } catch (error) {
            console.log('更新错误');
        }
    }
    
}


module.exports = new CutterForecastService();
