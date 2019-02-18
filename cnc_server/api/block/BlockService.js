const BaseService = require('../../services/BasicService');
const blockModel = require('../../models/BlockModel');
const LogUtil = require('../../utils/LogUtil');
const TimeUtil = require('../../utils/TimeUtil');
const shiftService = require('../shift/ShiftService');
const AppConfigService = require('../appconfig/AppConfigService');
const CutterLifeService = require('../cutterlife/CutterLifeService');
const DepartmentStatusesService = require('../departmentstatuses/DepartmentStatusesService');

const xlsx = require('node-xlsx');


class BlockService extends BaseService {
    constructor() {
        super(blockModel);
    }

    initBlockData(){
        let reload = {};
        let idle = {};
        let block = {};
        
                
        idle.totalCount = 0;             //待料总次数
        idle.totalTime = 0;             //待料的总时间
        idle.max = 0;                   //最高待料时间
        idle.min = 0xffffff;            //最低待料时间
        idle.upCount = 0;               //超过待料上限次数
        idle.lowCount = 0;              //低于待料下限次数
        idle.normalCount = 0;           //合格的的次数
        idle.upTime = 0;                //超标时间
        idle.lowTime = 0;               //未达标时间
        idle.conflict = 0;              //待料冲突次数
        idle.conflictTime = 0;          //待料冲突总时间
        idle.normalTime  = 0;           //正常待料时间总和
        idle.upTotalTime = 0;           //高于标准时间总和
        idle.lowTotalTime = 0;          //低于标准时间总和
        
        reload.totalCount = 0;             //换料总次数
        reload.totalTime = 0;             //换料的总时间
        reload.max = 0;                   //最高换料时间
        reload.min = 0xffffff;            //最低换料时间
        reload.upCount = 0;               //超过换料上限次数
        reload.lowCount = 0;              //低于换料下限次数
        reload.normalCount = 0;           //合格的的次数
        reload.upTime = 0;                //超标时间
        reload.lowTime = 0;               //未达标时间
        reload.normalTime  = 0;             //正常换料时间总和
        reload.upTotalTime = 0;           //高于标准时间总和
        reload.lowTotalTime = 0;          //低于标准时间总和

        block.reload = reload;
        block.idle = idle;
        block.dID = null;

        return block;
    }

    async getBlockWorkSummary(dID, iStart, iEnd, pageIndex, pageSize, depMap){

        let list = [];
        let result = [];
        let ts;
        let te;

                
        let lReload = 0;
        let hReload = 0;
        let lIdle = 0;
        let hIdle = 0;

        try{
            let config = await AppConfigService.getEfficientConfig();
            
            if(config == null){
                return result;
            }
                
            config.forEach(val=>{
                if(val.name == 'OPWait'){//OP待料时间
                    lIdle = val.stdTime + val.LowBias;
                    hIdle = val.stdTime + val.UpBias;
                }
                else if(val.name == 'OPReload'){//OP上料时间
                    lReload = val.stdTime + val.LowBias;
                    hReload = val.stdTime + val.UpBias;
                }
            });

            console.log("s = " + iStart + ", e = ", iEnd);
            console.log("id = " + dID);

            
            ts = TimeUtil.timestamp();
            
            list = await super.findByCondition({'department': { $regex: dID }, 'frunendtime':{$gte:iStart, $lt:iEnd}});

            te = TimeUtil.timestamp();
            console.log("getBlockWorkSummary query cost = " + (te - ts));
            LogUtil.debug("getBlockWorkSummary query cost = " + (te - ts));

            ts = TimeUtil.timestamp();
            list.sort((a, b) => {      //根据更新时间排序
                return a.frunendtime - b.frunendtime;
            });

            if(list.length > 0){


                let bMap = new Map();
    
    
                try {
                    let lastID = null;
                    let block = null;
                    list.forEach(val=>{
                        if(lastID != val.department){       //需要更新block
                            if(lastID != null){             //不是第一次，需要把block更新到map
                                bMap.set(lastID, block);
                            }

                            if(bMap.has(val.department)){   //如果前面已经有这个统计过的
                                block = bMap.get(val.department);
                            }
                            else{
                                block = this.initBlockData();
                                block.dID = val.department;
                            }
                            lastID = val.department;
                        }

                        //reload
                        if(val.uploadduration > hReload){
                            block.reload.upCount ++;
                            block.reload.upTime += (val.uploadduration - hReload);
                            block.reload.upTotalTime += val.uploadduration;
                        }
                        else if (val.uploadduration < lReload){
                            block.reload.lowCount ++;
                            block.reload.lowTime += (lReload - val.uploadduration);
                            block.reload.lowTotalTime += val.uploadduration;
                        }
                        else{
                            block.reload.normalCount ++;
                            block.reload.normalTime += val.uploadduration;
                        }
                        block.reload.max = block.reload.max > val.uploadduration? block.reload.max: val.uploadduration;
                        block.reload.min = block.reload.min < val.uploadduration? block.reload.min: val.uploadduration;
                        block.reload.totalTime += val.uploadduration;
                        block.reload.totalCount ++;
        
                        //idle
                        if(val.isconflict){
                            block.idle.conflict++;
                            block.idle.conflictTime += (val.realwaitduration - val.opwaitduration);
                        }
                        
                        if(val.opwaitduration > hIdle){
                            block.idle.upCount ++;
                            block.idle.upTime += (val.opwaitduration - hIdle);
                            block.idle.upTotalTime += val.opwaitduration;
                        }
                        else if (val.opwaitduration < lIdle){
                            block.idle.lowCount ++;
                            block.idle.lowTime += (lIdle - val.opwaitduration);
                            block.idle.lowTotalTime += val.opwaitduration;
                        }
                        else{
                            block.idle.normalCount ++;
                            block.idle.normalTime += val.opwaitduration;
                        }
                        block.idle.max = block.idle.max > val.opwaitduration? block.idle.max: val.opwaitduration;
                        block.idle.min = block.idle.min < val.opwaitduration? block.idle.min: val.opwaitduration;
                        block.idle.totalTime += val.opwaitduration;   
                        block.idle.totalCount ++;
                        
                        // console.log('idle[' + val.opwaitduration + ']:' + block.idle.min + ' - ' + block.idle.max);
                        // console.log('reload[' + val.uploadduration + ']:' + block.reload.min + ' - ' + block.reload.max);
                        // console.log('idle[' + block.idle.low + ', ' + block.idle.up + ']');
                        // console.log('reload[' + block.reload.low + ', ' + block.reload.up + ']');
                    });

                    //最后一次的结果也要更新map
                    bMap.set(lastID, block);
                } catch (error) {
                    console.log(error);
                    LogUtil.logErrorWithoutCxt(error);
                }

                let blockList = [];   
                bMap.forEach((v, k, m)=>{
                    try {                        
                        let statics = depMap.get(k);
                        v.shiftName = statics.name;
                        v.validCount = statics.valid_count;
                        v.invalidCount = statics.invalid_count;
                    } catch (error) {
                        console.log(error);
                    }
                    blockList.push(v);
                });

                if(pageIndex > 0){
                    let ps = (pageIndex - 1) * pageSize;
                    let pe = ps + pageSize;
                    result  = {total:blockList.length, rs:blockList.slice(ps, pe)};
                }
                else{
                    result = blockList;
                }
                
                te = TimeUtil.timestamp();
                console.log("getBlockWorkSummary formate cost = " + (te - ts));
            }
        }
        catch (error) {
            console.log(error);
            LogUtil.logErrorWithoutCxt(error);
        }

        return result;
    }

    
    async getBlockWorkStatic(dID, iStart, iEnd){

        let list = [];
        let ts;
        let te;

        try{
            console.log("s = " + iStart + ", e = ", iEnd);
            console.log("id = " + dID);

            
            ts = TimeUtil.timestamp();
            
            list = await super.findByCondition({'department': { $regex: dID }, 'frunendtime':{$gte:iStart, $lt:iEnd}});
            list.sort((a, b) => {      //根据更新时间排序
                return a.frunendtime - b.frunendtime;
            });
            te = TimeUtil.timestamp();
            console.log("getBlockWorkStatic query cost = " + (te - ts));
            LogUtil.debug("getBlockWorkStatic query cost = " + (te - ts));
        }
        catch (error) {
            console.log(error);
            LogUtil.logErrorWithoutCxt(error);
        }

        return list;
    }

    async getBlockWorkStaticByShift(dID, date, shiftID, detail, pageIndex, pageSize){
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
            console.log("getBlockWorkStaticByShift prepare cost = " + (te - ts));
            
            result = await this.getBlockWorkStatic(dID, iStart, iEnd, detail, pageIndex, pageSize);
        }
        catch (error) {
            console.log(error);
            LogUtil.logErrorWithoutCxt(error);
        }

        return result;
    }   
    
    async getBlockWorkStaticByTime(dID, start, end){
        let result = [];
        let ts;
        let te;

        try{
            ts = TimeUtil.timestamp();

            let iStart = parseInt(TimeUtil.toLong(start));   
            let iEnd = parseInt(TimeUtil.toLong(end)); ;

            te = TimeUtil.timestamp();
            console.log("getBlockWorkStaticByTime prepare cost = " + (te - ts));

            console.log("s = " + iStart + ", e = ", iEnd);
            console.log("id = " + dID);
            result = await this.getBlockWorkStatic(dID, iStart, iEnd);
            
        }
        catch (error) {
            LogUtil.logErrorWithoutCxt(error);
        }

        return result;
    }   
    async getBlockWorkSummaryByShift(dID, date, shiftID, pageIndex, pageSize){
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
            console.log("getBlockWorkSummaryByShift prepare cost = " + (te - ts));

            ts = TimeUtil.timestamp();
            let depMap = new Map();
            let dList = await DepartmentStatusesService.getStaticsByShift(dID, date, shiftID);
            dList.forEach(val=>{
                depMap.set(val.department, val);
            });
            
            te = TimeUtil.timestamp();
            console.log("get department static cost = " + (te - ts));
            LogUtil.debug("get department static cost = " + (te - ts));
            result = await this.getBlockWorkSummary(dID, iStart, iEnd, pageIndex, pageSize, depMap);
        }
        catch (error) {
            console.log(error);
            LogUtil.logErrorWithoutCxt(error);
        }

        return result;
    }   
    
    // async getBlockWorkSummaryByTime(dID, start, end, pageIndex, pageSize){
    //     let result = [];
    //     let ts;
    //     let te;

    //     try{
    //         ts = TimeUtil.timestamp();

    //         let iStart = parseInt(TimeUtil.toLong(start));   
    //         let iEnd = parseInt(TimeUtil.toLong(end)); ;

    //         te = TimeUtil.timestamp();
    //         console.log("getBlockWorkSummaryByTime prepare cost = " + (te - ts));

    //         console.log("s = " + iStart + ", e = ", iEnd);
    //         console.log("id = " + dID);
    //         result = await this.getBlockWorkSummary(dID, iStart, iEnd, pageIndex, pageSize);
            
    //     }
    //     catch (error) {
    //         LogUtil.logErrorWithoutCxt(error);
    //     }

    //     return result;
    // }  


    async exportBlockWorkSummaryByShift(dID, date, shiftID){
        let result = [];
        let ts;
        let te;

        try{
            ts = TimeUtil.timestamp();

            if(shiftID == undefined){
                shiftID = '20180824001';
            }
            let shift = await shiftService.resetStartAndEnd(date, shiftID);
            let iStart = shift.start;
            let iEnd = shift.end;
            
            if(shift == null){
                return result;
            }

            te = TimeUtil.timestamp();
            console.log("getBlockWorkSummaryByShift prepare cost = " + (te - ts));
            
            ts = TimeUtil.timestamp();
            let depMap = new Map();
            let dList = await DepartmentStatusesService.getStaticsByShift(dID, date, shiftID);
            dList.forEach(val=>{
                depMap.set(val.department, val);
            });
            
            te = TimeUtil.timestamp();
            console.log("get department static cost = " + (te - ts));

            result = await this.getBlockWorkSummary(dID, iStart, iEnd, 0, 10, depMap);

            let name = 'OP汇总'
            return this.genExcelData(result, name, date);

        }
        catch (error) {
            console.log(error);
            LogUtil.logErrorWithoutCxt(error);
        }

        return result;
    }

    genExcelData(datas, name, date){      
        let title = ['厂区', '楼层', '机种', '夹位', 'CELL', 'Block', 
            '日期','班别','有效产出数','无效产出',
            '换料总次数', '正常换料占比(%)', '正常换料时长', '正常换料时长占比(%)', '高于换料上限次数', '低于换料下限次数', '高于换料标准时长(秒)', '低于换料标准时长(秒)', '最高换料时长(秒)', '最低换料时长(秒)', 
            '待料总次数', '正常待料占比(%)', '正常待料时间', '正常待料时间占比(%)', '高于待料上限次数', '低于待料下限次数', '高于待料标准时长(秒)', '低于待料标准时长(秒)', '最高待料时长(秒)', '最低待料时长(秒)'
            // '换料总次数', '高于换料上限次数', '低于换料下限次数', '正常换料占比(%)', '正常换料时长', '正常换料时长占比(%)', '高于换料标准时长(秒)', '低于换料标准时长(秒)', '最高换料时长(秒)', '最低换料时长(秒)', 
            // '待料总次数', '正常待料占比(%)', '正常待料时间', '正常待料时间占比(%)', '高于待料上限次数', '低于待料下限次数', '高于待料标准时长(秒)', '低于待料标准时长(秒)', '最高待料时长(秒)', '最低待料时长(秒)'
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
                oneRow.push(info.block);

                //
                oneRow.push(date);
                oneRow.push(val.shiftName);
                oneRow.push(val.validCount);
                oneRow.push(val.invalidCount);
                //换料
                oneRow.push(val.reload.totalCount);
                let rnc = (val.reload.normalCount/val.reload.totalCount*100).toFixed(2) + '%';
                oneRow.push(rnc);
                oneRow.push(val.reload.normalTime);
                let rnt = (val.reload.normalTime/val.reload.totalTime*100).toFixed(2) + '%';
                oneRow.push(rnt);
                oneRow.push(val.reload.upCount);
                oneRow.push(val.reload.lowCount);
                oneRow.push(val.reload.upTime);
                oneRow.push(val.reload.lowTime);
                oneRow.push(val.reload.max);
                oneRow.push(val.reload.min);
                
                //待料
                oneRow.push(val.idle.totalCount);
                let inc = (val.idle.normalCount/val.idle.totalCount*100).toFixed(2) + '%';
                oneRow.push(inc);
                oneRow.push(val.idle.normalTime);
                let int = (val.idle.normalTime/val.idle.totalTime*100).toFixed(2) + '%';
                oneRow.push(int);
                oneRow.push(val.idle.upCount);
                oneRow.push(val.idle.lowCount);
                oneRow.push(val.idle.upTime);
                oneRow.push(val.idle.lowTime);
                oneRow.push(val.idle.max);
                oneRow.push(val.idle.min);

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
     
}


module.exports = new BlockService();