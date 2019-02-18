const BaseService = require('../../services/BasicService');
const CellModel = require('../../models/CellModel');
const LogUtil = require('../../utils/LogUtil');
const TimeUtil = require('../../utils/TimeUtil');
const shiftService = require('../shift/ShiftService');
const AppConfigService = require('../appconfig/AppConfigService');
const CutterLifeService = require('../cutterlife/CutterLifeService');
const xlsx = require('node-xlsx');


class CellService extends BaseService {
    constructor() {
        super(CellModel);
    }

    initSummaryData(){
        let wait = {};
        let deal = {};
        let event = {};
        
        //等待时间
        wait.totalCount = 0;             //等待总次数
        wait.totalTime = 0;             //等待的总时间
        wait.max = 0;                   //最高等待时间
        wait.min = 0xffffff;            //最低等待时间
        wait.upCount = 0;               //超过等待上限次数
        wait.lowCount = 0;              //低于等待下限次数
        wait.normalCount = 0;           //合格的的次数
        wait.upTime = 0;                //超标时间
        wait.lowTime = 0;               //未达标时间
        wait.conflict = 0;              //等待冲突次数
        wait.conflictTime = 0;          //等待冲突总时间
        wait.normalTime  = 0;           //正常等待时间总和
        wait.upTotalTime = 0;           //高于标准时间总和
        wait.lowTotalTime = 0;          //低于标准时间总和
        
        //解决时间
        deal.totalCount = 0;             //解决总次数
        deal.totalTime = 0;             //解决的总时间
        deal.max = 0;                   //最高解决时间
        deal.min = 0xffffff;            //最低解决时间
        deal.upCount = 0;               //超过解决上限次数
        deal.lowCount = 0;              //低于解决下限次数
        deal.normalCount = 0;           //合格的的次数
        deal.upTime = 0;                //超标时间
        deal.lowTime = 0;               //未达标时间
        deal.normalTime  = 0;           //正常解决时间总和
        deal.upTotalTime = 0;           //高于标准时间总和
        deal.lowTotalTime = 0;          //低于标准时间总和

        event.wait = wait;
        event.deal = deal;
        event.dID = null;
       // event.type = 0;                      //4：正常报警， 41：换刀报警， 42：首件报警

        return event;
    }

    async getConfigByType(type){
        let config = await AppConfigService.getEfficientConfig();
        let wait = {};
        let deal = {};
        
        config.forEach(val=>{
            if(val.name == 'ENGWait'){
                wait = val;
            }
            else if(type == 4 && val.name == 'OPWait'){
                deal = val;
            }
            else if(type == 41 && val.name == 'ENGChgTool'){
                deal = val;
            }
            else if(type == 42 && val.name == 'ENG1stPiece'){
                deal = val;
            }
        });
        return {wait:wait, deal:deal};
    }
    async getWorkSummary(type, dID, iStart, iEnd, pageIndex, pageSize){

        let list = [];
        let result = [];
        let ts;
        let te;

        try{
            type = parseInt(type);

            let config = await this.getConfigByType(type);
            if(config == null){
                return result;
            }
            console.log("s = " + iStart + ", e = ", iEnd);
            console.log("id = " + dID);
            
            ts = TimeUtil.timestamp();            
            list = await super.findByCondition({'department': { $regex: dID }, 'alarmtype':type, 'frunendtime':{$gte:iStart, $lt:iEnd}});
            te = TimeUtil.timestamp();
            console.log("getWorkSummary query cost = " + (te - ts));
            LogUtil.debug("getWorkSummary query cost = " + (te - ts));

            ts = TimeUtil.timestamp();
            list.sort((a, b) => {      //根据更新时间排序
                return a.frunendtime - b.frunendtime;
            });

            if(list.length > 0){
                let bMap = new Map();
                
                let lDeal = config.deal.stdTime + config.deal.LowBias;
                let hDeal = config.deal.stdTime + config.deal.UpBias;
                let lWait = config.wait.stdTime + config.wait.LowBias;
                let hWait = config.wait.stdTime + config.wait.UpBias;
        
                try {
                    let lastID = null;
                    let event = null;
                    list.forEach(val=>{
                        //把department切分到cell这层,可以考虑其他优化方式
                        let key = val.department.split('_')[4];
                        if(key == undefined || key == null){    //还没有cell
                        }else{                
                            if(lastID != key){       //需要更新block
                                if(lastID != null){             //不是第一次，需要把block更新到map
                                    bMap.set(lastID, event);
                                }
    
                                if(bMap.has(key)){   //如果前面已经有这个统计过的
                                    event = bMap.get(key);
                                }
                                else{
                                    event = this.initSummaryData();
                                    event.dID = val.department;
                                }
                                lastID = key;
                            }
    
                            //处理
                            if(val.uploadduration > hDeal){
                                event.deal.upCount ++;
                                event.deal.upTime += (val.uploadduration - hDeal);
                                event.deal.upTotalTime += val.uploadduration;
                            }
                            else if (val.uploadduration < lDeal){
                                event.deal.lowCount ++;
                                event.deal.lowTime += (lDeal - val.uploadduration);
                                event.deal.lowTotalTime += val.uploadduration;
                            }
                            else{
                                event.deal.normalCount ++;
                                event.deal.normalTime += val.uploadduration;
                            }
                            event.deal.max = event.deal.max > val.uploadduration? event.deal.max: val.uploadduration;
                            event.deal.min = event.deal.min < val.uploadduration? event.deal.min: val.uploadduration;
                            event.deal.totalTime += val.uploadduration;
                            event.deal.totalCount ++;
            
                            //等待
                            if(val.isconflict){
                                event.wait.conflict++;
                                event.wait.conflictTime += (val.realwaitduration - val.opwaitduration);
                            }
                            
                            if(val.opwaitduration > hWait){
                                event.wait.upCount ++;
                                event.wait.upTime += (val.opwaitduration - hWait);
                                event.wait.upTotalTime += val.opwaitduration;
                            }
                            else if (val.opwaitduration < lWait){
                                event.wait.lowCount ++;
                                event.wait.lowTime += (lWait - val.opwaitduration);
                                event.wait.lowTotalTime += val.opwaitduration;
                            }
                            else{
                                event.wait.normalCount ++;
                                event.wait.normalTime += val.opwaitduration;
                            }
                            event.wait.max = event.wait.max > val.opwaitduration? event.wait.max: val.opwaitduration;
                            event.wait.min = event.wait.min < val.opwaitduration? event.wait.min: val.opwaitduration;
                            event.wait.totalTime += val.opwaitduration;   
                            event.wait.totalCount ++;
                            
                            // console.log('wait[' + val.opwaitduration + ']:' + event.wait.min + ' - ' + event.wait.max);
                            // console.log('deal[' + val.uploadduration + ']:' + event.deal.min + ' - ' + event.deal.max);
                            // console.log('wait[' + event.wait.low + ', ' + event.wait.up + ']');
                            // console.log('deal[' + event.deal.low + ', ' + event.deal.up + ']');
                        }
                    });

                    //最后一次的结果也要更新map
                    bMap.set(lastID, event);
                } catch (error) {
                    console.log(error);
                    LogUtil.debug(error);
                }

                let eventList = [];
                bMap.forEach((v, k, m)=>{
                    eventList.push(v);
                });

                if(pageIndex > 0){
                    let ps = (pageIndex - 1) * pageSize;
                    let pe = ps + pageSize;
                    result  = {total:eventList.length, rs:eventList.slice(ps, pe)};
                }
                else{
                    result = eventList;
                }
                
                te = TimeUtil.timestamp();
                console.log("getBlockWorkSummary formate cost = " + (te - ts));
            }
        }
        catch (error) {
            console.log(error);
            LogUtil.debug(error);
        }

        return result;
    }

    
    async getWorkStatic(type, dID, iStart, iEnd){

        let list = [];
        let ts;
        let te;

        try{
            type = parseInt(type);
            console.log("s = " + iStart + ", e = ", iEnd);
            console.log("id = " + dID);

            
            ts = TimeUtil.timestamp();            
            list = await super.findByCondition({'department': { $regex: dID }, 'alarmtype':type, 'frunendtime':{$gte:iStart, $lt:iEnd}});
            list.sort((a, b) => {      //根据更新时间排序
                return a.frunendtime - b.frunendtime;
            });
            te = TimeUtil.timestamp();
            console.log("getWorkStatic query cost = " + (te - ts));
            LogUtil.debug("getWorkStatic query cost = " + (te - ts));
        }
        catch (error) {
            console.log(error);
            LogUtil.debug(error);
        }

        return list;
    }

    async getStaticByShift(type, dID, date, shiftID, detail, pageIndex, pageSize){
        let result = [];
        let ts;
        let te;

        try{
            ts = TimeUtil.timestamp();

            let shift = await shiftService.resetStartAndEnd(date, shiftID);
            let iStart = shift.start;
            let iEnd = shift.end;
            
            if(shift == null){
                return result;
            }

            te = TimeUtil.timestamp();
            console.log("getWorkStaticByShift prepare cost = " + (te - ts));
            
            result = await this.getWorkStatic(type, dID, iStart, iEnd, detail, pageIndex, pageSize);
        }
        catch (error) {
            console.log(error);
            LogUtil.debug(error);
        }

        return result;
    }   
    
    async getWorkStaticByTime(type, dID, start, end){
        let result = [];
        let ts;
        let te;

        try{
            ts = TimeUtil.timestamp();

            let iStart = parseInt(TimeUtil.toLong(start));   
            let iEnd = parseInt(TimeUtil.toLong(end)); ;

            te = TimeUtil.timestamp();
            console.log("getWorkStaticByTime prepare cost = " + (te - ts));

            console.log("s = " + iStart + ", e = ", iEnd);
            console.log("id = " + dID);
            result = await this.getWorkStatic(type, dID, iStart, iEnd);
            
        }
        catch (error) {
            LogUtil.debug(error);
        }

        return result;
    }   
    async getWorkSummaryByShift(type, dID, date, shiftID, pageIndex, pageSize){
        let result = [];
        let ts;
        let te;

        try{
            ts = TimeUtil.timestamp();

            let shift = await shiftService.resetStartAndEnd(date, shiftID);
            let iStart = shift.start;
            let iEnd = shift.end;
            
            if(shift == null){
                return result;
            }

            te = TimeUtil.timestamp();
            console.log("getWorkSummaryByShift prepare cost = " + (te - ts));
            
            result = await this.getWorkSummary(type, dID, iStart, iEnd, pageIndex, pageSize);
        }
        catch (error) {
            console.log(error);
            LogUtil.debug(error);
        }

        return result;
    }   
    
    async getWorkSummaryByTime(type, dID, start, end, pageIndex, pageSize){
        let result = [];
        let ts;
        let te;

        try{
            ts = TimeUtil.timestamp();

            let iStart = parseInt(TimeUtil.toLong(start));   
            let iEnd = parseInt(TimeUtil.toLong(end)); ;

            te = TimeUtil.timestamp();
            console.log("getBlockWorkSummaryByTime prepare cost = " + (te - ts));

            console.log("s = " + iStart + ", e = ", iEnd);
            console.log("id = " + dID);
            result = await this.getWorkSummary(type, dID, iStart, iEnd, pageIndex, pageSize);
            
        }
        catch (error) {
            LogUtil.debug(error);
        }

        return result;
    }  


    async exportWorkSummaryByShift(type, dID, date, shiftID){
        let result = [];
        let ts;
        let te;

        try{
            ts = TimeUtil.timestamp();

            let shift = await shiftService.resetStartAndEnd(date, shiftID);
            let iStart = shift.start;
            let iEnd = shift.end;
            
            if(shift == null){
                return result;
            }

            te = TimeUtil.timestamp();
            console.log("exportWorkSummaryByShift prepare cost = " + (te - ts));
            
            result = await this.getWorkSummary(type, dID, iStart, iEnd, 0, 10);

            let name = this.getSheetName(type);
            return this.genExcelData(type, result, name);

        }
        catch (error) {
            console.log(error);
            LogUtil.debug(error);
        }

        return result;
    }

    getSheetName(type){
        switch(type){
            case 4:
                return '系统报警';
            case 41:
                return '换刀报警';
            case 42:
                return '首件报警';
            default:
                return '异常报警';
        }
    }

    genExcelData(type, result, name){
        switch(type){
            case 4:
                return this.genExcelDataForSystem(result, name);
            case 41:
            case 42:
            default:
                return this.genExcelDataForChangeTool(result, name);
        }

    }

    genExcelDataForSystem(datas, name){
        let title = ['厂区', '楼层', '机种', '夹位', 'CELL', 
        '处理总次数', '处理总时长', '处理平均时长', '最高处理时长(秒)', '最低处理时长(秒)', 
        '等待总次数', '等待总时长', '等待平均时长', '最高等待时长(秒)', '最低等待时长(秒)'
            ];  
        let rows = [title];
        let sheet  = {};
        sheet.name = name;
        try {
            datas.forEach(val => {
                let oneRow = [];
                let info = CutterLifeService.splitDepartment(val.dID);

                //组织信息
                oneRow.push(info.factory);
                oneRow.push(info.floor);
                oneRow.push(info.product);
                oneRow.push(info.pinch);
                oneRow.push(info.cell);
                
                //处理
                oneRow.push(val.deal.totalCount);
                oneRow.push(val.deal.totalTime);
                let dealAve = (val.deal.totalTime/val.deal.totalCount).toFixed(2);
                oneRow.push(dealAve);
                oneRow.push(val.deal.max);
                oneRow.push(val.deal.min);
                
                //等待
                oneRow.push(val.wait.totalCount);
                oneRow.push(val.wait.totalTime);
                let waitAve = (val.wait.totalTime/val.wait.totalCount).toFixed(2);
                oneRow.push(waitAve);
                oneRow.push(val.wait.max);
                oneRow.push(val.wait.min);

                rows.push(oneRow);
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

    genExcelDataForChangeTool(datas, name){  
        let title = ['厂区', '楼层', '机种', '夹位', 'CELL', 
        '处理总次数', '正常处理占比(%)', '正常处理时长', '正常处理时长占比(%)', '高于处理上限次数', '低于处理下限次数', '高于处理标准时长(秒)', '低于处理标准时长(秒)', '最高处理时长(秒)', '最低处理时长(秒)', 
        '等待总次数', '正常等待占比(%)', '正常等待时间', '正常等待时间占比(%)', '高于等待上限次数', '低于等待下限次数', '高于等待标准时长(秒)', '低于等待标准时长(秒)', '最高等待时长(秒)', '最低等待时长(秒)'
            // '处理总次数', '正常处理次数', '高于上限处理次数', '低于下限处理次数', '最高处理时长(秒)', '最低处理时长(秒)', '正常处理次数占比(%)',  '高于标准处理次数占比(%)', '低于标准处理次数占比(%)',  
            // '等待总次数', '正常等待占比(%)', '正常等待时间', '正常等待时间占比(%)', '高于等待上限次数', '低于等待下限次数', '高于等待标准时长(秒)', '低于等待标准时长(秒)', '最高等待时长(秒)', '最低等待时长(秒)'
            ];  
        let rows = [title];
        let sheet  = {};
        sheet.name = name;
        try {
            datas.forEach(val => {
                let oneRow = [];
                let info = CutterLifeService.splitDepartment(val.dID);

                //组织信息
                oneRow.push(info.factory);
                oneRow.push(info.floor);
                oneRow.push(info.product);
                oneRow.push(info.pinch);
                oneRow.push(info.cell);
                
                //处理
                oneRow.push(val.deal.totalCount);
                let rnc = (val.deal.normalCount/val.deal.totalCount*100).toFixed(2) + '%';
                oneRow.push(rnc);
                oneRow.push(val.deal.normalTime);
                let rnt = (val.deal.normalTime/val.deal.totalTime*100).toFixed(2) + '%';
                oneRow.push(rnt);
                oneRow.push(val.deal.upCount);
                oneRow.push(val.deal.lowCount);
                oneRow.push(val.deal.upTime);
                oneRow.push(val.deal.lowTime);
                oneRow.push(val.deal.max);
                oneRow.push(val.deal.min);
                
                //等待
                oneRow.push(val.wait.totalCount);
                let inc = (val.wait.normalCount/val.wait.totalCount*100).toFixed(2) + '%';
                oneRow.push(inc);
                oneRow.push(val.wait.normalTime);
                let int = (val.wait.normalTime/val.wait.totalTime*100).toFixed(2) + '%';
                oneRow.push(int);
                oneRow.push(val.wait.upCount);
                oneRow.push(val.wait.lowCount);
                oneRow.push(val.wait.upTime);
                oneRow.push(val.wait.lowTime);
                oneRow.push(val.wait.max);
                oneRow.push(val.wait.min);

                rows.push(oneRow);
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

    // genExcelData(datas, name){      
    //     let title = ['厂区', '楼层', '机种', '夹位', 'CELL', 
    //     '处理总次数', '正常处理占比(%)', '正常处理时长', '正常处理时长占比(%)', '高于处理上限次数', '低于处理下限次数', '高于处理标准时长(秒)', '低于处理标准时长(秒)', '最高处理时长(秒)', '最低处理时长(秒)', 
    //     '等待总次数', '正常等待占比(%)', '正常等待时间', '正常等待时间占比(%)', '高于等待上限次数', '低于等待下限次数', '高于等待标准时长(秒)', '低于等待标准时长(秒)', '最高等待时长(秒)', '最低等待时长(秒)'
    //         ];  
    //     let rows = [title];
    //     let sheet  = {};
    //     sheet.name = name;
    //     try {
    //         datas.forEach(val => {
    //             let oneRow = [];
    //             let info = CutterLifeService.splitDepartment(val.dID);

    //             //组织信息
    //             oneRow.push(info.factory);
    //             oneRow.push(info.floor);
    //             oneRow.push(info.product);
    //             oneRow.push(info.pinch);
    //             oneRow.push(info.cell);
                
    //             //处理
    //             oneRow.push(val.deal.totalCount);
    //             let rnc = (val.deal.normalCount/val.deal.totalCount*100).toFixed(2) + '%';
    //             oneRow.push(rnc);
    //             oneRow.push(val.deal.normalTime);
    //             let rnt = (val.deal.normalTime/val.deal.totalTime*100).toFixed(2) + '%';
    //             oneRow.push(rnt);
    //             oneRow.push(val.deal.upCount);
    //             oneRow.push(val.deal.lowCount);
    //             oneRow.push(val.deal.upTime);
    //             oneRow.push(val.deal.lowTime);
    //             oneRow.push(val.deal.max);
    //             oneRow.push(val.deal.min);
                
    //             //等待
    //             oneRow.push(val.wait.totalCount);
    //             let inc = (val.wait.normalCount/val.wait.totalCount*100).toFixed(2) + '%';
    //             oneRow.push(inc);
    //             oneRow.push(val.wait.normalTime);
    //             let int = (val.wait.normalTime/val.wait.totalTime*100).toFixed(2) + '%';
    //             oneRow.push(int);
    //             oneRow.push(val.wait.upCount);
    //             oneRow.push(val.wait.lowCount);
    //             oneRow.push(val.wait.upTime);
    //             oneRow.push(val.wait.lowTime);
    //             oneRow.push(val.wait.max);
    //             oneRow.push(val.wait.min);

    //             rows.push(oneRow);
    //         });
    //     } catch (error) {
    //         LogUtil.debug('Export error: ' + error);
    //     }
    //     //sheet = sheet.concat(rows);

    //     sheet.data = rows;

    //     let workBook = [];
    //     workBook.push(sheet);
    //     return xlsx.build(workBook);
    // }
     
}


module.exports = new CellService();