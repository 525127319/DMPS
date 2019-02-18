const AppConfigService = require('./AppConfigService');
const RSUtil = require('../../utils/RSUtil');
const LogUtil = require('../../utils/LogUtil');
const _ = require('lodash');
//const TimeUtil = require('../../utils/TimeUtil');

class AppConfigController {

    //获取自动生成刀具把报表的配置
    async getCutterAutoReportConfig(ctx) {
        let param = ctx.params;
        try {
            if (_.isEmpty(param)){
                LogUtil.logError(ctx, 'the params.type can not be empty!');
                ctx.body = RSUtil.fail('the params.type can not be empty!');
                return;
            }
            else if(param.type < '0' || param.type > '2'){
                LogUtil.logError(ctx, 'the params.type is invalid!');
                ctx.body = RSUtil.fail('the params.type is invalid!');
                return;
            }
            let resInfo = await AppConfigService.getCutterAutoReportConfig(param.type);
            ctx.body = RSUtil.ok(resInfo);
        } catch (error) {
            LogUtil.logError(ctx, error);
            ctx.body = RSUtil.fail(error);
        }
    }
    
    async getRestTimeConfig(ctx) {
        try {
            let resInfo = await AppConfigService.getRestTimeConfig();
            ctx.body = RSUtil.ok(resInfo);
        } catch (error) {
            LogUtil.logError(ctx, error);
            ctx.body = RSUtil.fail(error);
        }
    }

    async getEfficientConfig(ctx) {
        try {
            let resInfo = await AppConfigService.getEfficientConfig();
            ctx.body = RSUtil.ok(resInfo);
        } catch (error) {
            LogUtil.logError(ctx, error);
            ctx.body = RSUtil.fail(error);
        }
    }
}

module.exports = new AppConfigController();