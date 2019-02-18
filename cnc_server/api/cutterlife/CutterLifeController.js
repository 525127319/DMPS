const CutterLifeService = require('./CutterLifeService');
const RSUtil = require('../../utils/RSUtil');
const LogUtil = require('../../utils/LogUtil');
let TimeUtil = require('../../utils/TimeUtil');

class CutterLifeController {

    //根据部门查询设备的生产周期
    async getCutterlifeByDepartmentId(ctx) {
        let params = ctx.params;
        try {
            let resInfo = await CutterLifeService.getCutterlifeByDepartmentId(params.departmentid, params.pageIndex, params.hours);
            ctx.body = RSUtil.ok(resInfo);
        } catch (error) {
            LogUtil.logError(ctx, error);
            ctx.body = RSUtil.fail(error);
        }
    }

    async export(ctx){
        let departmentid = ctx.request.fields.departmentid;
        try {
            let resInfo = await CutterLifeService.export(departmentid);
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

module.exports = new CutterLifeController();
