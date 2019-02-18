const CutterForecastService = require('./CutterForecastService');
const RSUtil = require('../../utils/RSUtil');
const LogUtil = require('../../utils/LogUtil');
const TimeUtil = require('../../utils/TimeUtil');
const _ = require('lodash');

class CutterForecastController {
    /*
    获取刀具预期数据
    */
    async getCutterForecast(ctx){
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
            let start = params.start;
            let end = params.end;
            let type = params.type;

            let pageIndex = params.pageIndex;
            let pageSize = params.pageSize;
            let dev_id = params.dev_id;

            if(type == undefined || type == null || date == undefined || date == null
                || start == undefined || start == null || end == undefined || end == null 
                || pageIndex == undefined || pageSize == undefined || dev_id == undefined   //这些都是可选的
                || dID == undefined || dID == null){
                LogUtil.logError(ctx, 'the params is incomplete!');
                ctx.body = RSUtil.fail('the params is incomplete!');
                return;
            }

            if(type < '0' && type > '2'){
                LogUtil.logError(ctx, 'the params.type is invalid!');
                ctx.body = RSUtil.fail('the params.type is invalid!');
                return;
            }
            type = parseInt(type);

            pageSize = (pageSize == null)?  10 : parseInt(pageSize);
            pageIndex = (pageIndex == null)? 0 : parseInt(pageIndex);
            dev_id = (dev_id == null || dev_id == ''|| dev_id == '0')? null: dev_id;
            pageSize = pageSize <= 0? 10: pageSize;
            pageIndex = pageIndex <= 0? 0: pageIndex;

            let resInfo = await CutterForecastService.getCutterForecast(dID, type, date, start, end, dev_id, pageIndex, pageSize);
            ctx.body = RSUtil.ok(resInfo);
        } catch (error) {
            LogUtil.logError(ctx, error);
            ctx.body = RSUtil.fail(error);
        }
        
    }
    
    async export(ctx){
        let params = ctx.params;

        try {            
            if (_.isEmpty(params)){
                LogUtil.logError(ctx, 'the params can not be empty!');
                ctx.body = RSUtil.fail('the params can not be empty!');
                return;
            }

            let dID = params.departmentid;
            let date = params.date;
            let start = params.start;
            let end = params.end;
            let type = params.type;

            if( type == undefined || type == null
                || date == undefined || date == null|| start == undefined || start == null 
                || end == undefined || end == null || dID == undefined || dID == null){
                LogUtil.logError(ctx, 'the params is incomplete!');
                ctx.body = RSUtil.fail('the params is incomplete!');
                return;
            }
            if(type < '0' && type > '2'){
                LogUtil.logError(ctx, 'the params.type is invalid!');
                ctx.body = RSUtil.fail('the params.type is invalid!');
                return;
            }

            type = parseInt(type);
            let resInfo = await CutterForecastService.export(dID, type, date, start, end);
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

module.exports = new CutterForecastController();
