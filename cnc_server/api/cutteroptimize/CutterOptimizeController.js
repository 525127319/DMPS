const CutterOptimizeService = require('./CutterOptimizeService');
const RSUtil = require('../../utils/RSUtil');
const LogUtil = require('../../utils/LogUtil');
const _ = require('lodash');

class CutterOptimizeController {
    
    async getCutterRTK(ctx) {
        let params = ctx.params;
        //let query = ctx.query;
        try {            
            if (_.isEmpty(params)){
                LogUtil.logError(ctx, 'the params can not be empty!');
                ctx.body = RSUtil.fail('the params can not be empty!');
                return;
            }

            let dID = params.departmentid;
            let pageIndex = params.pageIndex;
            let pageSize = params.pageSize;

            if(dID == undefined || dID == null
                ||pageIndex == undefined || pageIndex == null
                ||pageSize == undefined || pageSize == null
                ){
                LogUtil.logError(ctx, 'the params is incomplete!');
                ctx.body = RSUtil.fail('the params is incomplete!');
                return;
            }

            pageSize = parseInt(pageSize) <= 0? 10: parseInt(pageSize);
            pageIndex = parseInt(pageIndex) <= 0? 0: parseInt(pageIndex);
            
            let resInfo = await CutterOptimizeService.getCutterRTK(dID, null, pageIndex, pageSize);
            ctx.body = RSUtil.ok(resInfo);
        } catch (error) {
            LogUtil.logError(ctx, error);
            ctx.body = RSUtil.fail(error);
        }
    }
    
    async getCutterOptHistroy(ctx) {
        let params = ctx.params;
        //let query = ctx.query;
        try {            
            if (_.isEmpty(params)){
                LogUtil.logError(ctx, 'the params can not be empty!');
                ctx.body = RSUtil.fail('the params can not be empty!');
                return;
            }

            let dID = params.departmentid;
            let devID = params.devID;
            let date = params.date;
            let start = params.start;
            let end = params.end;
            let pageIndex = params.pageIndex;
            let pageSize = params.pageSize;

            if(dID == undefined || dID == null
                ||pageIndex == undefined || pageIndex == null
                ||pageSize == undefined || pageSize == null
                ||devID == undefined || devID == null
                ||start == undefined || start == null
                ||end == undefined || end == null
                ||date == undefined || date == null
                ){
                LogUtil.logError(ctx, 'the params is incomplete!');
                ctx.body = RSUtil.fail('the params is incomplete!');
                return;
            }

            pageSize = parseInt(pageSize) <= 0? 10: parseInt(pageSize);
            pageIndex = parseInt(pageIndex) <= 0? 0: parseInt(pageIndex);
            if(dID == '0'){
                dID = null;
            }
            if( devID == '0'){
                devID = null;
            }

            if(dID == null && devID == null){
                LogUtil.logError(ctx, 'the params is invalid!');
                ctx.body = RSUtil.fail('the params is invalid!');
                return;
            }
            if(devID != null){  //单设备不需要翻页
                pageIndex = 0;
            }
            
            let resInfo = await CutterOptimizeService.getCutterOptHistroy(dID, devID, date, start, end, pageIndex, pageSize);
            ctx.body = RSUtil.ok(resInfo);
        } catch (error) {
            LogUtil.logError(ctx, error);
            ctx.body = RSUtil.fail(error);
        }
    }

    async exportCutterOptHistroy(ctx){
        try {
            let dID = ctx.request.fields.departmentid;  
            let devID = ctx.request.fields.devID;      
            let date = ctx.request.fields.date;        
            let start = ctx.request.fields.start;
            let end = ctx.request.fields.end;

            if(dID == undefined || dID == null
                ||devID == undefined || devID == null
                ||start == undefined || start == null
                ||end == undefined || end == null
                ||date == undefined || date == null
                ){
                LogUtil.logError(ctx, 'the params is incomplete!');
                ctx.body = RSUtil.fail('the params is incomplete!');
                return;
            }

            if(dID == '0'){
                dID = null;
            }
            if( devID == '0'){
                devID = null;
            }

            if(dID == null && devID == null){
                LogUtil.logError(ctx, 'the params is invalid!');
                ctx.body = RSUtil.fail('the params is invalid!');
                return;
            }
            if(devID != null){  //单设备不需要翻页
                pageIndex = 0;
            }
            
            let resInfo = await CutterOptimizeService.exportCutterOptHistroy(dID, devID, date, start, end);
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


module.exports = new CutterOptimizeController();
