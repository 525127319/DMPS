const BaseService = require('../../services/BasicService');
const deviceService = require('../device/DeviceService');
const cutterOptimize = require('../../models/CutterOptimizeModel');
const CutterLifeService = require('../cutterlife/CutterLifeService');
const AppConfigService = require('../appconfig/AppConfigService');
const IListener = require("../../ipc/IListener");
const LogUtil = require('../../utils/LogUtil');
const TimeUtil = require('../../utils/TimeUtil');
const xlsx = require('node-xlsx');

class CutterOptimizeService extends BaseService {
    constructor() {
        super(cutterOptimize);
        this.register([
            'optimizeExchangeTool',
            'delayExchangeTime',
        ]);
    

        this.optStep = 0;  // 0 - 空闲， 1 - 优化， 2 - 滞后
        this.batchCount = 100;
        this.batchIndex = 0;
        this.factor = 10;       //刀具寿命10%的余量
        
        this.debugCell = 'root_2018081411941458_2018081412340056_2018081412636566_20181017154620491';     //测试期间只对这个cell有效 CNC4/CELL7
    }
        
    //保存统计数据
    async saveData(data, now, start, end){
        let sTime = TimeUtil.format(now, TimeUtil.format4);
        let sData = [];
        data.forEach(e=>{
            let item = {};
            item.dev_id = e.dev_id;
            item.orgTime = e.time;                       //原始数据取的数据时间
            item.optTime = e.time;                       //优化取的数据时间
            item.delayTime = e.time;                     //滞后取得数据时间
            item.department = e.department;
            item.genTime = now;
            item.update = now;
            item.genTimeStr = sTime;
            item.start = start;
            item.end = end;
            item.delay = 0;
            item.optResult = false;
            item.delayResult = false;
            item.optMsg = '';
            item.delayMsg = '';
            item.isOptReq = false;      //发送过优化请求
            item.isDelayReq = false;    //发送过滞后请求
            
            //处理刀具
            let sCutter = [];
            e.cutters.forEach(c=>{
                let cutter = {};
                cutter.no = c.no;
                cutter.opti_flag = c.opti_flag;                          //这个是device_monitor里边定义的 0 - 没有任何操作， 1 - 优化过， 2 - 滞后过， 3 - 优化并且滞后过
                cutter.total_life = c.total_life;
                cutter.total_count = c.total_count;
                cutter.origin_life = c.residual_life;               //原来的
                cutter.origin_count = c.residual_count;
                cutter.origin_change = c.estimate_time;

                cutter.optimize_life = c.residual_life;             //优化后
                cutter.optimize_count = c.residual_count;
                cutter.optimize_change = c.estimate_time;
                
                cutter.actual_life = c.residual_life;             //最终的，可能是滞后，也有可能没有滞后， 给报表就用这个数据
                cutter.actual_count = c.residual_count;
                cutter.actual_change = c.estimate_time;

                sCutter.push(cutter);
            })

            sCutter.sort((a, b) => {      //根据换刀时间排序
                return a.no - b.no;
            });

            item.cutters = sCutter;
            item.update = TimeUtil.times();
            sData.push(item);
        })

        // sData.sort((a, b) => {          //根据dev_id排序
        //     return a.dev_id - b.dev_id;
        // });
        
        try {
            await super.createMany(sData);
        }
        catch (error) {
            LogUtil.debug(error);
        }
    }

    /*
    航班动态刀具表
    */
    async getCutterRTK(dID, dev_id, pageIndex, pageSize){
        let list = [];
        let ts;
        let te;

        try{

            ts = TimeUtil.timestamp();
            //获取实时报表设置信息
            let sConfig = await AppConfigService.getCutterAutoReportConfig('2');

            if(sConfig == null || sConfig == undefined || sConfig.length == 0){
                LogUtil.debug("Get config failed");
                return list;
            }

            let iStart = 0;
            let iEnd = 0;
           // let iTrigger = 0;
            let lTime = 0;
            let hTime = 0;
            //当前时间
            let now = TimeUtil.times();
            
            for(let i=0; i<sConfig.length; i++){
                
                let start = sConfig[i].start;
                let end = sConfig[i].end;
                //let trigger = sConfig[i].trigger;

                //开始的YYYY-MM-DD HH:mm:ss
                let sDateTime = TimeUtil.geCurString(TimeUtil.format3) + ' ' + start + ':00';
                let eDateTime = TimeUtil.geCurString(TimeUtil.format3) + ' ' + end + ':00';
                //let tDateTime = TimeUtil.geCurString(TimeUtil.format3) + ' ' + trigger + ':00';
    
                iStart = parseInt(TimeUtil.toLong(sDateTime));      //开始时间 秒
                iEnd = parseInt(TimeUtil.toLong(eDateTime));      //结束时间 秒
               // iTrigger = Number(TimeUtil.toLong(tDateTime));      //触发时间 秒
               
                if( iEnd < iStart && iStart < now){         //这个表示是结束时间跨天，当前时间还没跨天
                    iEnd += 24 * 60 * 60;
                }
                else if(iEnd < iStart && iStart > now){     //这个表示结束时间跨天，当前时间也跨天了
                    iStart -= 24 * 60 * 60;
                }

                if(iStart < now && iEnd > now){ //表示当前时间

                    break;
                }

            }

            // if(iTrigger > iStart){
            //     iTrigger -= 24 * 60 * 60;
            // }
            lTime = (iStart - now)/60/60;       //注意，这里没有考虑触发事件在开始时间之后的情况
            hTime = (iEnd - now)/60/60;

            lTime = lTime < 0? 0: lTime;
            hTime = hTime < 0? 0: hTime;
    
            // console.log('From:' + iStart + ' = ' + TimeUtil.format(iStart, "YYYY-MM-DD HH:mm:ss"));
            // console.log('To:' + iEnd + ' = ' + TimeUtil.format(iEnd, "YYYY-MM-DD HH:mm:ss"));
            // console.log('lTime = ' + lTime);
            // console.log('hTime = ' +  hTime);

            
            te = TimeUtil.timestamp();
           // LogUtil.debug("getCutterRTK prepare cost = " + (te - ts));
            console.log("getCutterRTK prepare cost = " + (te - ts));

            let devs = new Map();
            if(dev_id != null){     //如果查询单设备，就直接返回时间即可
                list = await this.findByCondition({'dev_id':dev_id}, {}, {'dev_id':1});
                if(list.length > 0){
                    list = await CutterLifeService.getCutomizeToolDataByIDlist(dID, devs, (flag, residual, update)=>{
                                return ((residual >= lTime && residual < hTime && (update + residual*60*60) >= now)? true: false);
                            })
                }
            }
            else{          
                /*      
                ts = TimeUtil.timestamp();

                //否者查询所有列表数据来筛选 1.当班预测数据 2.已过期设备
                list = await this.findByCondition({'department':{$regex:dID}, 'start':{$gte:iStart}, 'end':{$lte:iEnd}}, {}, {'_id':0, 'dev_id':1});  //先把本班预测过的设备编号读出来
                if(list.length == 0)  {
                    LogUtil.debug("Can't find the optimized & delayed device list");
                }
                list.forEach(e=>{
                    devs.set(e.dev_id, 0);
                })

                te = TimeUtil.timestamp();
                LogUtil.debug("getCutterRTK query devMap cost = " + (te - ts));
                console.log("getCutterRTK query devMap cost = " + (te - ts));
                */
                ts = TimeUtil.timestamp();
                list = await CutterLifeService.getExpandToolData(dID, now, (residual, update, devID)=>{
                    
                            if(/*devs.has(devID) && */residual >= lTime && residual < hTime/* && (update + residual*60*60) >= now*/){  //满足时间条件的，而且是已经优化选出来的
                                return true;
                            }
                            if((update + residual*60*60) <= now){  //超出寿命了的就不管是不是统计过的
                                return true;
                            }
                            return false;
                        });
                
                list.sort((a, b) => {//根据换刀时间排序
                    //return a.time.estimate_time - b.tool.estimate_time;
                    return ((a.time + a.tool.residual_life*60*60) - (b.time + b.tool.residual_life*60*60))
                });

                te = TimeUtil.timestamp();
                LogUtil.debug("getCutterRTK query real data cost = " + (te - ts));
                console.log("getCutterRTK query real data cost = " + (te - ts));

                if(pageIndex == 0){ //不翻页
                    return list;
                }
                else{
                    let len = list.length;
                    let si = (pageIndex - 1)*pageSize;
                    let ei = pageIndex * pageSize;
                    return {rs:list.slice(si, ei), total:len}
                }                
            }
        }
        catch (error) {
            LogUtil.debug(error);
        }

        return list;
    }

    /*
    获取刀具优化、滞后日志记录
    */
    async getCutterOptHistroy(dID, dev_id, date, start, end, pageIndex, pageSize){
        let list = [];
        let result = {};
        let ts = 0, te = 0;
        try {
            let sDateTime = date + ' ' +  start + ':00';      //转换成YYYY-MM-DD hh:mm:ss
            let eDateTime = date + ' ' +  end + ':00';        //转换成YYYY-MM-DD hh:mm:ss
            
            let sTime = parseInt(TimeUtil.toLong(sDateTime));
            let eTime = parseInt(TimeUtil.toLong(eDateTime));
            
            if(eTime < sTime){
                eTime += 24 * 60 * 60;
            }

            ts = TimeUtil.timestamp();
            if(dID == null){//单设备
                list = await this.findByCondition({'dev_id':dev_id, start:{$gte:sTime}, end:{$lte:eTime}});
            }
            else{
                // if(pageIndex > 0){  //需要翻页
                //     result = await this.pageByCondition({'department':{$regex:dID}, start:{$gte:sTime}, end:{$lte:eTime}}, pageIndex, pageSize);
                //     list = result.rs;
                // }
                // else{
                    list = await this.findByCondition({'department':{$regex:dID}, start:{$gte:sTime}, end:{$lte:eTime}});
                //}

            }
            te = TimeUtil.timestamp();

            LogUtil.debug("getCutterOptHistroy query cost " + (te-ts));

        } catch (error) {
            LogUtil.debug(error);
        }

        if(list.length > 0){    //筛选有过优化、滞后的操作的设备
            let newList = [];
            list.forEach(val=>{
                if(val.isDelayReq || val.isOptReq){ //表示有过优化、或者滞后
                    newList.push(val);
                }
            });

            if(pageIndex > 0){
                let ps = (pageIndex-1)*pageSize;
                let pe = ps + pageSize;
                list = newList.slice(ps, pe);
            }else{
                list = newList;
            }
        }

        list = this.formatOptimizeList(list);
        
        result = {total:list.length, rs:list};
            
        return result;
    }

    formatOptimizeList(list){
        let uplist = [];
        let sOflag = ['无操作', '只优化', '只滞后', '优化滞后'];
        let sRflag = ['无操作', '优化成功', '优化失败', '滞后成功', '滞后失败', '优化滞后成功', '只优化成功', '只滞后成功', '优化滞后失败'];
        let tlflag = ['无变化', '优化过', '滞后过', '优化滞后过'];
        let oFlag = 0;
        let rFlag = 0;

        try {
            list.forEach(val=>{
                let tools = [];
                let upVal = val;
    
                oFlag = 0;
                if(val.isOptReq)
                    oFlag |= 1;
                if(val.isDelayReq)
                    oFlag |= 2;
                upVal.sendFlag = sOflag[oFlag];
                    
                switch(oFlag){
                    case 0:
                        rFlag = 0;
                        break;
                    case 1:
                        rFlag = (val.optResult? 1: 2);
                        break;
                    case 2:
                        rFlag = (val.delayResult? 3: 4);
                        break;
                    case 3:
                        if(val.optResult && val.delayResult){
                            rFlag = 5;
                        } else if(val.optResult){
                            rFlag = 6;
                        } else if(val.delayResult){
                            rFlag = 7;
                        } else {
                            rFlag = 8;
                        }
                        break;
                }
    
                upVal.recvFlag = sRflag[rFlag];            
                if(!val.isOptReq)
                    val.optMsg = 'NA';
                if(!val.isDelayReq)
                    val.delayMsg = 'NA'; 
                val.cutters.forEach(tool => {                
                    let tVal = tool;
                    tVal.opFlag = tlflag[tVal.opti_flag];
                    if((tVal.opti_flag & 0x01) != 0x01){
                        tVal.optimize_count = 'NA';
                        tVal.optimize_life = 'NA';
                        upVal.optTime = 0;          //所有优化、滞后的时间都是同一时刻更新的。
                    }
                    
                    if((tVal.opti_flag & 0x02) != 0x02){
                        tVal.actual_count = 'NA';
                        tVal.actual_life = 'NA';
                        upVal.delayTime = 0;        //所有优化、滞后的时间都是同一时刻更新的。
                    }
    
                    tools.push(tVal);
                });
                upVal.cutters = tools;
                uplist.push(upVal);
            });
            
        } catch (error) {
            console.log(error);
        }

        return uplist;
    }

    async exportCutterOptHistroy(dID, devID, date, start, end){
        let list = [];

        try {
            let result = await this.getCutterOptHistroy(dID, devID, date, start, end, 0, 0);

            list = result.rs;

            let name = '优化滞后记录';
            return this.genOptHistory(result.rs, name);
        } catch (error) {
            LogUtil.debug(error);
        }
    }

    
    genOptHistory(datas, name){      
        let title = ["厂区", "楼层", "机种", "夹位", "CELL", "BLOCK", "设备名称", "执行类型", "服务返回", "刀具表现", 
        "刀具号", "原始剩余(次)", "原始剩余(小时)", "优化后剩余(次)", "优化后剩余(小时)", "滞后后剩余(次)", "滞后后剩余(小时)", "标准寿命(次)", "标准寿命(小时)", 
        "优化日志", "滞后日志", "记录产生时间", "记录更新时间", "原始值更新时间", "优化值更新时间", "滞后值更新时间"            
        ];
        let rows = [title];
        let sheet  = {};
        sheet.name = name;
        try {
            datas.forEach(val => {
                let info = CutterLifeService.splitDepartment(val.department);
                let device = deviceService.getDeviceById(val.dev_id);
                val.cutters.forEach(tool => {
                    let oneRow = [];

                    //基础信息
                    oneRow.push(info.factory);
                    oneRow.push(info.floor);
                    oneRow.push(info.product);
                    oneRow.push(info.pinch);
                    oneRow.push(info.cell);
                    oneRow.push(info.block);
                    oneRow.push(device.name);
                    
                    oneRow.push(val.sendFlag);
                    oneRow.push(val.recvFlag);
                    oneRow.push(tool.opFlag);
                    
                    //刀具信息
                    oneRow.push(tool.no);
                    oneRow.push(tool.origin_count);
                    oneRow.push(tool.origin_life);
                    
                    oneRow.push(tool.optimize_count);
                    oneRow.push(tool.optimize_life);
                    oneRow.push(tool.actual_count);
                    oneRow.push(tool.actual_life);
                    oneRow.push(tool.total_count);
                    oneRow.push(tool.total_life);

                    //时间日志相关
                    oneRow.push(val.optMsg);
                    oneRow.push(val.delayMsg);
                    oneRow.push(val.genTimeStr);
                    oneRow.push(TimeUtil.format(val.update));
                    oneRow.push(TimeUtil.format(val.orgTime));
                    if(val.optTime == 0)
                        oneRow.push('NA');
                    else
                        oneRow.push(TimeUtil.format(val.optTime));

                    if(val.delayTime == 0)
                        oneRow.push('NA');
                    else
                        oneRow.push(TimeUtil.format(val.delayTime));
                    rows.push(oneRow);
                });
            });
        } catch (error) {
            LogUtil.debug('Export error: ' + error);
        }
        //sheet = sheet.concat(rows);

        sheet.data = rows;

        let workBook = [];
        workBook.push(sheet);
        return xlsx.build(workBook);
    }
     
    //====================================================================================================================
    
    optimizeExchangeTool(msg) {
        //logUtil.debug(msg);
        console.log(msg);
        if(msg.data){
            //一组更新完滞后，继续优化后边的   
            this.recordMidOptRes(msg.data);
            this.doBatchOptimize();
        }
    }

    optimizeExchangeToolSend(msg){
        let optimizeTool = new IListener(
            "optimizeExchangeTool", msg
        );
        this.toMid(optimizeTool);
    }
    
    delayExchangeTime(msg){
        //logUtil.debug(msg);
        console.log(msg);
        if(msg.data){
            //一组滞后完成，就继续下组滞后
            this.recordMidDelayRes(msg.data);
            this.doBatchDelay();
        }
    }
    delayExchangeTimeSend(msg){
        let delayTool = new IListener(
            "delayExchangeTime", msg
        );
        this.toMid(delayTool);
    }


    /*
    先获取所有的数据
    */
    async getAllNeedOptimizeDevData(){
            this.devList = [];
            try{
                //this.devList = await super.findByCondition({'start':this.iStart, 'end':this.iEnd}, 
                //这里增加genTime是为了避免多测试过程中发现有不在触发时间生成的数据， 原因还未查明，所以先过滤掉
                this.devList = await super.findByCondition({'start':this.iStart, 'end':this.iEnd, 'department':{$regex:this.debugCell}},    //这里是测试期间只优化一个夹位的
                                                            {'dev_id':1});
                                                            //{'_id':1, 'dev_id':1, 'time':1, 'cutters':1});
            }
            catch (error) {
                LogUtil.debug(error);
            }

            let pThis = this;
            this.devIDList = [];
            if(this.devList.length > 0){
                this.devList.forEach(e=>{
                    pThis.devIDList.push(e.dev_id);   //把获取的数据放到ID放到一个数组，后边查询结果的时候用
                })
            }

            this.devMap = new Map();
            this.devList.forEach(e=>{
                let tools = [];
                e.cutters.forEach(tool=>{
                    tools.push(tool.no);
                });
                pThis.devMap.set(e.dev_id, tools);          //把刀具号放到map
            })

            this.dealCount = this.devList.length;
    }
   
    /*
    初始化班次数
    */
   async initRestConfig(){
    //获取班次数据        
    this.restTime = [];
    let pThis = this;
    let rest = await AppConfigService.getRestTimeConfig();
    try {
            
            rest.forEach(e=>{
                let sDateTime = TimeUtil.geCurString(TimeUtil.format3) + ' ' + e.start + ':00';
                let eDateTime = TimeUtil.geCurString(TimeUtil.format3) + ' ' + e.end + ':00';

                let config = {};
                config.iStart = parseInt(TimeUtil.toLong(sDateTime)); 
                config.iEnd = parseInt(TimeUtil.toLong(eDateTime));

                if(config.iEnd < config.iStart){    //这个表示跨天了
                    config.iEnd += 24 * 60 * 60;
                }
                
                let s1 = TimeUtil.format(config.iStart, TimeUtil.format4);
                let s2 = TimeUtil.format(config.iEnd, TimeUtil.format4);
                // let s3 = TimeUtil.format(pThis.iStart, TimeUtil.format4);
                // let s4 = TimeUtil.format(pThis.iEnd, TimeUtil.format4);
                
                // console.log('set ' + s1 + '-' + s2);
                // console.log('app ' + s3 + '-' + s4);
                // console.log('Lset ' + config.iStart + '-' + config.iEnd);
                // console.log('Lapp ' + pThis.iStart + '-' + pThis.iEnd);

                if( (pThis.iStart > config.iStart && pThis.iStart < config.iEnd && pThis.iEnd > config.iEnd)   
                    || (pThis.iStart < config.iStart && pThis.iEnd > config.iStart && pThis.iEnd < config.iEnd)
                    || (pThis.iStart < config.iStart && pThis.iEnd > config.iEnd)
                    ){
                        //console.log('valid ' + s1 + '-' + s2);
                        pThis.restTime.push(config);
                }  
            });        
            
        } catch (error) {
            console.log(error);
            LogUtil.debug(error);
        }

    }

    /*
    记录中间件返回的优化结果
    */
    recordMidOptRes(msg){

        try {
            msg.result.forEach( res=>{
                console.log('found id:' + res.devID);
                for(let i=0; i<this.devList.length; i++){
                    let dev = this.devList[i];
                    if(dev.dev_id == res.devID){
                        dev.optResult = (res.ret == 'ok'? true: false);      //1成功，0失败
                        dev.optMsg = res.ret + ':['+ res.reason + ']';
                        this.devList[i] = dev;
                        break;
                    }
                }
            });
        } catch (error) {
            LogUtil.debug(error);
        }
    }
    /*
    记录中间件返回的滞后结果
    */
    recordMidDelayRes(msg){
        try {
            msg.result.forEach( res=>{
                for(let i=0; i<this.devList.length; i++){
                    let dev = this.devList[i];
                    if(dev.dev_id == res.devID){
                        dev.delayResult = (res.ret == 'ok'? true: false);      //1成功，0失败
                        dev.delayMsg = res.ret + ':['+ res.reason + ']';
                        this.devList[i] = dev;
                        break;
                    }
                }
            });
        } catch (error) {
            LogUtil.debug(error);
        }
    }

    setOptReqFlag(Devs){
        
        try {
            Devs.forEach( res=>{
                for(let i=0; i<this.devList.length; i++){
                    let dev = this.devList[i];
                    if(dev.dev_id == res.devID){
                        dev.isOptReq = true;
                        this.devList[i] = dev;
                        break;
                    }
                }
            });
        } catch (error) {
            LogUtil.debug(error);
        }
    }

    setDelayReqFlag(Devs){

        try {
            Devs.forEach( res=>{
                for(let i=0; i<this.devList.length; i++){
                    let dev = this.devList[i];
                    if(dev.dev_id == res.devID){
                        dev.isDelayReq = true;
                        this.devList[i] = dev;
                        break;
                    }
                }
            });
        } catch (error) {
            LogUtil.debug(error);
        }
    }

    /*
    更新优化后的数据
    */
    async updateOptimizeResult(){
        let optmizedDevList = [];
        let optmizedDevMap = new Map();
        let pThis = this;

        let now = TimeUtil.times();
        let hTime = this.iEnd - now;
        let lTime = this.iStart - now;

        hTime = hTime<0? 0: hTime/60/60;
        lTime = lTime<0? 0: lTime/60/60;

        optmizedDevList = await CutterLifeService.getCutomizeToolDataByIDlist(null, this.devIDList, (flag, dev_id, tID)=>{
                            //return (flag == 1 && (residual >= lTime && residual < hTime && (update + residual*60*60) >= now)? true: false);
                            if(flag == 1 && pThis.devMap.get(dev_id).includes(tID)){    //优化过，且刀具ID是设备map里边有的，devMap参考初始化
                                return true;
                            }
                            else{
                                return false;
                            }
                        });

        if(optmizedDevList.length == 0){
            LogUtil.debug("No device has been optimized");
            return;
        }
        LogUtil.debug("Has " + optmizedDevList.length + ' devices has been optimized');

        try {
                
            //把lifeDevList变成map，提高操作效率
            optmizedDevList.forEach(d=>{
                optmizedDevMap.set(d.dev_id, d);
            });

            //let newList = [];
            let offset = 0;
            this.devList.forEach(d=>{
                // if(d.dev_id == '10462'){
                //     console.log("found");
                // }
                let dev = optmizedDevMap.get(d.dev_id);
                if(dev == null || dev == undefined){//没有被优化
                   // newList.push(d);
                }
                else{
                    d.optTime = dev.time;
                                    
                    let tools = [];
                    //更新刀具flag和寿命，还要算delay多久
                    d.cutters.forEach(e=>{
                        for(let i=0; i<dev.cutters.length; i++){
                            let c = dev.cutters[i];                            
                            if(e.no == c.no)  { //是同一把刀
                                LogUtil.debug('dev<' + d.dev_id + '>optimezed<' + e.no +'>');
                                e.opti_flag = c.opti_flag;
                                e.optimize_life = c.residual_life;             //优化后
                                e.optimize_count = c.residual_count;
                                e.optimize_change = c.estimate_time;
                                
                                //最终的几个剩余寿命应该都一样，优化的目的就是为了同一时间换这个班次的刀
                                e.actual_life = c.residual_life;             //最终的，可能是滞后，也有可能没有滞后， 给报表就用这个数据
                                e.actual_count = c.residual_count;
                                e.actual_change = c.estimate_time; 
                                
                                break;
                            }
                        }  
                        
                        tools.push(e);      //没把刀都要存，即使没有更新    
                    });
                    d.cutters = tools;                
                    //newList.push(d);
                    this.devList[offset] = d;
                }

                offset++;
            });
            
            //this.devList = newList;
        } catch (error) {
            LogUtil.debug("updateOptimizeResult:" + error);
            console.log(error);
        }

    }

    calculatDelayTime(){
        //let newList = [];
        let pThis = this;
        let offset = 0;
        try {
            this.devList.forEach(d=>{
                // if(d.dev_id == '10462'){
                //     console.log("found");
                // }
                let tools = d.cutters;
                d.delay = 0;
                if(tools.length == 1){          //只有一把刀的时候可以算滞后
                    let tool = tools[0];
                    let expTime = d.orgTime + tool.actual_life * 60 * 60;   //只有一把刀的时候不可能优化过
                    let factor = tool.total_life * 36 * pThis.factor        //寿命的10% - 优化时延长的寿命 (注意！！这里没有考虑有可能加工次数增加了一次)
                    
                    for(let i=0; i<pThis.restTime.length; i++){
                        let config = pThis.restTime[i];
                        if(expTime > config.iStart && expTime < config.iEnd){   //在休息的区间, 
                            let delay = config.iEnd - expTime;
                            d.delay = (delay > factor)? 0: delay; 
                            
                            // if(d.delay == 0){    //只是打印日志
                            //     console.log('dev[' + d.dev_id + '] tool ' + tool.no + ' not delay [' + delay + ', ' + factor + ']');
                            // }

                            break;      //一把刀只可能在一个区间换刀
                        }
                    }  
    
                    //tools[0] = tool;
                }
                else if(tools.length > 1){ //如果是多把刀，则需要考虑每把刀的寿命, 同样也是不管有没有优化都可以算滞后
                    for(let i=0; i<tools.length; i++){
                        let tool = tools[i];
                        let expTime = 0;                        
                        let factor = 0;

                        if(tool.opti_flag == 0){    //没有优化过
                            expTime = d.orgTime + tool.actual_life * 60 * 60;
                            factor = tool.total_life * 36 * pThis.factor    //寿命的10%
                        }
                        else{  
                            expTime = d.optTime + tool.actual_life * 60 * 60;
                            factor = (tool.total_life -(tool.actual_life - tool.origin_life)) * 36 * pThis.factor;     //总寿命减去优化后增加的寿命的10%
                        }

                        for(let i=0; i<pThis.restTime.length; i++){
                            let config = pThis.restTime[i];
                            if(expTime > config.iStart && expTime < config.iEnd){   //在休息的区间, 
                                let delay = config.iEnd - expTime;
                                d.delay = (delay > factor)? 0: delay;

                                // if(d.delay == 0){    //只是打印日志
                                //     console.log('dev[' + d.dev_id + '] tool ' + tool.no + ' not delay [' + delay + ', ' + factor + ']');
                                // }

                                break;      //一把刀只可能在一个区间换刀
                            }
                        }  
    
                        //tools[i] = tool;
                        if(d.delay == 0){    //如果其中有一把刀不能滞后，那就都不要滞后了
                            //console.log('dev[' + d.dev_id + '] tool ' + tool.no + '[' + expTime + ', ' + factor + ']');
                            break;
                        }
                    }                    
                }
    
                //d.cutters = tools;
                if(d.delay > 0){
                    console.log('dev[' + d.dev_id + '] will delay ' + d.delay + 's');
                    LogUtil.debug('dev[' + d.dev_id + '] will delay ' + d.delay + 's');

                    this.devList[offset] = d;
                }
                //newList.push(d);
                offset++;
            });
    
            //this.devList = newList;
            
        } catch (error) {
            LogUtil.debug("calculatDelayTime:" + error);
            console.log(error);
        }
    }

    /*
    更新滞后的数据
    */
    async updateDelayResult(){        
        let lifeDevList = [];
        let devMap = new Map();
        let now = TimeUtil.times();
        let hTime = this.iEnd - now;
        let lTime = this.iStart - now;
        let pThis = this;

        hTime = hTime<0? 0: hTime;
        lTime = lTime<0? 0: lTime;

        lifeDevList = await CutterLifeService.getCutomizeToolDataByIDlist(null, this.devIDList, (flag, tID, dev_id)=>{
                                //return ((flag > 1 && residual >= lTime && residual < hTime && (update + residual*60*60) >= now)? true: false);
                                if(flag > 1 && pThis.devMap.get(dev_id).includes(tID)){    //滞后过，且刀具ID是设备map里边有的，devMap参考初始化
                                    return true;
                                }
                                else{
                                    return false;
                                }
                            });

        if(lifeDevList.length == 0){
            LogUtil.debug("No device has been delayed");
            return;
        }

        LogUtil.debug("Has " + lifeDevList.length + ' devices has been delayed');
        try {            
            //把lifeDevList变成map，提高操作效率
            lifeDevList.forEach(dev=>{
                devMap.set(dev.dev_id, dev);
            });

            //let newList = [];
            let offset = 0;
            this.devList.forEach(d=>{
                // if(d.dev_id == '10462'){
                //     console.log("found");
                // }                
                let dev = devMap.get(d.dev_id);
                if(dev == null || dev == undefined){//没有被滞后
                    d.delay = 0;        //时间要清0
                    //newList.push(d);
                    this.devList[offset] = d;
                }
                else{
                    d.delayTime = dev.time;
                                    
                    let tools = [];
                    //更新刀具flag和寿命，还要算delay多久
                    d.cutters.forEach(e=>{                      
                        for(let i=0; i<dev.cutters.length; i++){
                            let c = dev.cutters[i];                            
                            if(e.no == c.no)  { //是同一把刀
                                LogUtil.debug('dev<' + d.dev_id + '>delayed<' + e.no +'>');
                                e.opti_flag = c.opti_flag;
                                e.actual_life = c.residual_life;             //最终的，可能是滞后，也有可能没有滞后， 给报表就用这个数据
                                e.actual_count = c.residual_count;
                                e.actual_change = c.estimate_time; 
                                
                                break;
                            }
                        }  
                        
                        tools.push(e);      //没把刀都要存回去。
                    });
                    d.cutters = tools;
                    //newList.push(d);
                    this.devList[offset] = d;
                }
                offset++;
            });

            //this.devList = newList;
        } catch (error) {
            LogUtil.debug("updateDelayResult:" + error);
            console.log(error);
        }
   }

   /*
   优化和滞后的结果更新到数据库去
   */
   async saveOptimizeAndDelayResult(){
        try {
            this.devList.forEach(async (d)=>{
                    // let v = d.cutters;
                    // await this.updateOrCreate({'_id':d._id}, {$set:{'delay':d.delay, 'cutters':v, 'update':TimeUtil.times()}});  
                    if(d.isOptReq || d.isDelayReq)  //有发起过请求
                    {
                        d.update = TimeUtil.times();
                        await this.update(d);
                    }
            });              
        } catch (error) {
            LogUtil.debug("saveOptimizeAndDelayResult" + error);
            console.log(error);
        }
   }
    
    //发送优化数据
    sendOptimizeRequest(){
        let sCmd = {}
        let sDev = [];

        try {
            this.batchDev.forEach(d=>{
                let item = {};
                let tools = [];
                let v = d.cutters;
                let nSet = new Set();

                if(v.length > 1){   //只有一把刀不需要优化                    
                    v.forEach(e=>{
                        if(e.opti_flag == 0){    //优化过的刀也不能再优化，也没有滞后过
                            tools.push(e.no);
                            nSet.add(e.origin_count);
                        }
                    })
                    
                    if(tools.length > 1 && nSet.size > 1){  //寿命还不一样
                        item.tools = tools;
                        item.devID = d.dev_id;
                        sDev.push(item);
                    }
                }
            });
        } catch (error) {
            LogUtil.debug("sendOptimizeRequest:" + error);
            console.log(error);
        }

        if(sDev.length > 0){
            sCmd.array = sDev;
            //console.log(JSON.stringify(sCmd));
            LogUtil.debug('sendOptimizeRequest data:' + JSON.stringify(sCmd))
            this.optimizeExchangeToolSend(sCmd);

            this.setOptReqFlag(sDev);
            return true;
        }
        else{
            return false;
        }
    }

    //发送滞后数据
    sendDelayRequest(){
        let sCmd = {}
        let sDev = [];

        try {            
            this.batchDev.forEach( d=>{
                let item = {};
                let tools = [];

                if(d.delay != 0){
                    d.cutters.forEach(val=>{
                        tools.push(val.no);
                    })
                    
                    // if(d.dev_id == '10462'){
                    //     console.log('found');
                    // }
                    item.tools = tools;
                    item.devID = d.dev_id;
                    item.delayTime = d.delay;
                    sDev.push(item);
                }
            });
        } catch (error) {
            LogUtil.debug("sendDelayRequest:" + error);  
            console.log(error);
        }

        if(sDev.length > 0){
            sCmd.array = sDev;
            //console.log(JSON.stringify(sCmd));
            LogUtil.debug('sendDelayRequest data:' + JSON.stringify(sCmd))
            this.delayExchangeTimeSend(sCmd);
            this.setDelayReqFlag(sDev);
            return true;
        }
        else{
            return false;
        }
    }

    //执行一批的滞后操作
    async doBatchDelay(){        
        while(true){
            if(this.batchIndex * this.batchCount <= this.dealCount){    //还有数据没滞后完
                let start = this.batchIndex * this.batchCount;
                let end =  start + this.batchCount    
                this.batchDev = this.devList.slice(start, end);

                this.batchIndex++;              //翻一页
                if(this.sendDelayRequest()) { //有数据发出去，就等回调了
                    break;
                }
                else{   //这批数据全部都被锁,或者不需要滞后，就找下一批

                }                
            }
            else{   //已经滞后完成， 需要更新滞后结果
                console.log("delay finish, will update the result");
                await this.updateDelayResult();
                console.log('save the life to database');
                await this.saveOptimizeAndDelayResult();
                this.optStep = 0;
                this.batchIndex = 0;
                console.log('finish');
                break;
            }
        }
    }

    //执行一批的优化操作
    async doBatchOptimize(){
        while(true){
            if(this.batchIndex * this.batchCount <= this.dealCount){    //还有数据没优化完   
                let start = this.batchIndex * this.batchCount;
                let end =  start + this.batchCount    
                this.batchDev = this.devList.slice(start, end);

                this.batchIndex++;   
                if(this.sendOptimizeRequest()) { //有数据发出去，就等回调了
                    break;
                }
                else{//这批数据全部都被锁,或者只有一条换刀数据，就继续找下一批

                }                
            }
            else{   //已经优化完成， 需要更新优化结果
                this.optStep = 2;
                this.batchIndex = 0;
                console.log("update operate finish, will update the optimize result");
                await this.updateOptimizeResult();
                console.log("calculate the delay time")
                await this.calculatDelayTime();
                console.log('do delay');
                this.doBatchDelay();
                break;
            }
        }
    }

    /*
    开启优化流程，需要初始化一些全局变量
    */
    async startDoOptimize(trigger, start, end){
        if(this.optStep != 0){  //只能有一个流程运行，否则就退出
            LogUtil.debug("An optimize flow is progressing...");
            LogUtil.debug("An optimize flow is progressing...");
            return;
        }
       // let sTrigger = TimeUtil.geCurString(TimeUtil.format3) + ' ' + trigger + ':00';
        let sDateTime = TimeUtil.geCurString(TimeUtil.format3) + ' ' + start + ':00';
        let eDateTime = TimeUtil.geCurString(TimeUtil.format3) + ' ' + end + ':00';
        //this.iTrigger = parseInt(TimeUtil.toLong(sTrigger)); 
        this.iStart = parseInt(TimeUtil.toLong(sDateTime)); 
        this.iEnd = parseInt(TimeUtil.toLong(eDateTime));
        if(this.iEnd < this.iStart){    //这个表示跨天了
            this.iEnd += 24 * 60 * 60;
        }

        // this.lTime = (this.iStart - this.iTrigger)/60/60;       //注意，这里没有考虑触发事件在开始时间之后的情况
        // this.hTime = (this.iEnd - this.iTrigger)/60/60;

        //获取所有数据
        await this.getAllNeedOptimizeDevData();
        if(this.dealCount == 0){    //没有数据，不需要更新和滞后
            LogUtil.debug("No device should be optimized");
            console.log("No device should be optimized");
            return;
        }
        LogUtil.debug("Has " + this.dealCount + " device should be optimized");
        console.log("Has " + this.dealCount + " device should be optimized");
        //班次数据
        await this.initRestConfig();
        this.batchIndex = 0;
        await this.doBatchOptimize();
    }
    

    
    /*
    旧数据库迁移
    */
   async updateOneRecord(val){
        try {

            let bUpdate = false;

            if(val.delay == undefined){
                val.delay = 0;
                bUpdate = true;
            }
            if(val.optResult == undefined){
                val.optResult = false;
                bUpdate = true;
            }
            if(val.delayResult == undefined){
                val.delayResult = false;
                bUpdate = true;
            }
            if(val.optMsg == undefined){
                val.optMsg = "";
                bUpdate = true;
            }
            if(val.delayMsg == undefined){
                val.delayMsg = "";
                bUpdate = true;
            }
            if(val.isOptReq == undefined){
                val.isOptReq = false;
                bUpdate = true;
            }
            if(val.isDelayReq == undefined){
                val.isDelayReq = false;
                bUpdate = true;
            }

            if(bUpdate){
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
                        await this.updateOneRecord(val);
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

module.exports = new CutterOptimizeService();

