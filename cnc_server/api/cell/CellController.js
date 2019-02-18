const CellService = require('./CellService');
const RSUtil = require('../../utils/RSUtil');
const LogUtil = require('../../utils/LogUtil');
const TimeUtil = require('../../utils/TimeUtil');
const _ = require('lodash');

class CellController {
    async getWorkStaticByShift(ctx){
        let params = ctx.params;
        //let query = ctx.query;
        try {            
            if (_.isEmpty(params)){
                LogUtil.logError(ctx, 'the params can not be empty!');
                ctx.body = RSUtil.fail('the params can not be empty!');
                return;
            }

            let dID = params.departmentid;
            let date = params.date;
            let shiftID = params.shiftID;
            let type = params.type;
            // let detail = params.detail;
            // let pageIndex = params.pageIndex;
            // let pageSize = params.pageSize;

            if( dID == undefined || dID == null
                || date == undefined || date == null 
                || shiftID == undefined || shiftID == null
                || type == undefined || type == null
                // || detail == undefined || detail == null
                // || pageIndex == undefined || pageIndex == null
                // || pageSize == undefined || pageSize == null
            ){
                LogUtil.logError(ctx, 'the params is incomplete!');
                ctx.body = RSUtil.fail('the params is incomplete!');
                return;
            }


            // pageSize = parseInt(pageSize) <= 0? 10: parseInt(pageSize);
            // pageIndex =  parseInt(pageIndex) < 0? 0: parseInt(pageIndex);

            let resInfo = await CellService.getStaticByShift(type, dID, date, shiftID);
            ctx.body = RSUtil.ok(resInfo);
        } catch (error) {
            LogUtil.logError(ctx, error);
            ctx.body = RSUtil.fail(error);
        }        
    }    
    
    async getWorkStaticByTime(ctx){
        let params = ctx.params;
        //let query = ctx.query;
        try {            
            if (_.isEmpty(params)){
                LogUtil.logError(ctx, 'the params can not be empty!');
                ctx.body = RSUtil.fail('the params can not be empty!');
                return;
            }

            let dID = params.departmentid;
            let start = params.start;
            let end = params.end;
            let type = params.type;
            // let detail = params.detail;
            // let pageIndex = params.pageIndex;
            // let pageSize = params.pageSize;

            if( dID == undefined || dID == null
                || start == undefined || start == null 
                || end == undefined || end == null
                || type == undefined || type == null
                // || detail == undefined || detail == null
                // || pageIndex == undefined || pageIndex == null
                // || pageSize == undefined || pageSize == null
            ){
                LogUtil.logError(ctx, 'the params is incomplete!');
                ctx.body = RSUtil.fail('the params is incomplete!');
                return;
            }


            // pageSize = parseInt(pageSize) <= 0? 10: parseInt(pageSize);
            // pageIndex =  parseInt(pageIndex) < 0? 0: parseInt(pageIndex);

            let resInfo = await CellService.getWorkStaticByTime(type, dID, start, end);
            ctx.body = RSUtil.ok(resInfo);
        } catch (error) {
            LogUtil.logError(ctx, error);
            ctx.body = RSUtil.fail(error);
        }        
    }    
    
    async getWorkSummaryByShift(ctx){
        let params = ctx.params;
        //let query = ctx.query;
        try {            
            if (_.isEmpty(params)){
                LogUtil.logError(ctx, 'the params can not be empty!');
                ctx.body = RSUtil.fail('the params can not be empty!');
                return;
            }

            let dID = params.departmentid;
            let date = params.date;
            let shiftID = params.shiftID;
            let type = params.type;
            // let detail = params.detail;
            let pageIndex = params.pageIndex;
            let pageSize = params.pageSize;

            if( dID == undefined || dID == null
                || date == undefined || date == null 
                || shiftID == undefined || shiftID == null
                || type == undefined || type == null
                // || detail == undefined || detail == null
                || pageIndex == undefined || pageIndex == null
                || pageSize == undefined || pageSize == null
            ){
                LogUtil.logError(ctx, 'the params is incomplete!');
                ctx.body = RSUtil.fail('the params is incomplete!');
                return;
            }


            pageSize = parseInt(pageSize) <= 0? 10: parseInt(pageSize);
            pageIndex =  parseInt(pageIndex) < 0? 0: parseInt(pageIndex);

            let resInfo = await CellService.getWorkSummaryByShift(type, dID, date, shiftID, pageIndex, pageSize);
            ctx.body = RSUtil.ok(resInfo);
        } catch (error) {
            LogUtil.logError(ctx, error);
            ctx.body = RSUtil.fail(error);
        }        
    }    
    
    async getWorkSummaryByTime(ctx){
        let params = ctx.params;
        //let query = ctx.query;
        try {            
            if (_.isEmpty(params)){
                LogUtil.logError(ctx, 'the params can not be empty!');
                ctx.body = RSUtil.fail('the params can not be empty!');
                return;
            }

            let dID = params.departmentid;
            let type = params.type;
            let start = params.start;
            let end = params.end;
            // let detail = params.detail;
            let pageIndex = params.pageIndex;
            let pageSize = params.pageSize;

            if( dID == undefined || dID == null
                || start == undefined || start == null 
                || end == undefined || end == null
                || type == undefined || type == null
                // || detail == undefined || detail == null
                || pageIndex == undefined || pageIndex == null
                || pageSize == undefined || pageSize == null
            ){
                LogUtil.logError(ctx, 'the params is incomplete!');
                ctx.body = RSUtil.fail('the params is incomplete!');
                return;
            }


            pageSize = parseInt(pageSize) <= 0? 10: parseInt(pageSize);
            pageIndex =  parseInt(pageIndex) < 0? 0: parseInt(pageIndex);

            let resInfo = await CellService.getWorkSummaryByTime(type, dID, start, end, pageIndex, pageSize);
            ctx.body = RSUtil.ok(resInfo);
        } catch (error) {
            LogUtil.logError(ctx, error);
            ctx.body = RSUtil.fail(error);
        }        
    }    

    async exportWorkSummaryByShift(ctx){
        try {
            let dID = ctx.request.fields.departmentid;        
            let date = ctx.request.fields.date;        
            let shiftID = ctx.request.fields.shiftID;
            let type = ctx.request.fields.type;

            if(dID == undefined || dID == null || dID == ''){
                dID = 'root';
            }
            if(date == undefined || date == null || date == ''){
                date = TimeUtil.geCurString(TimeUtil.format3);
            }
            let resInfo = await CellService.exportWorkSummaryByShift(type, dID, date, shiftID);
            if (resInfo){
                ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                ctx.set("Content-Disposition", "attachment; filename=" + "o2olog.xlsx");
                ctx.body = resInfo;
            }
            else{
                ctx.response.status = 600;
                ctx.body = RSUtil.ok('0');
            }
        } catch (error) {
            LogUtil.logError(ctx, error);
            ctx.body = RSUtil.fail(error);
        }
    }
}

module.exports = new CellController();
