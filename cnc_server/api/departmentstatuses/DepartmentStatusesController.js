let departmentStatusesService = require("./DepartmentStatusesService");
let RSUtil = require("../../utils/RSUtil");
let TimeUtil = require('../../utils/TimeUtil');
let LogUtil = require('../../utils/LogUtil');
var shiftService = require('../shift/ShiftService');
let cacheCurDayStatis = null, isQuery = false;
class DepartmentStatusesController {
  async getDepartmentStatuses(ctx) {
    let departmentid = ctx.request.fields.value;
    let shift = ctx.request.fields.shift;
    let ctype = ctx.request.fields.ctype;

    let time = ctx.request.fields.stime;
    let shiftStime = TimeUtil.toLong(time);
    let shiftEtime = TimeUtil.addDay(time, 1);

   
    let shifttime = null;
    // let curstartTime = TimeUtil.getDayStartUnixTime();
    try {
      let rs = null;
      if (ctype){
        shifttime = await shiftService.resetStartAndEnd(time);
        if (shifttime){
            shiftStime = shifttime.start;
            shiftEtime = shifttime.end;
        }
        rs = await departmentStatusesService.findByCondition({
            "value": {$regex: departmentid},
            "time": {$gte: parseInt(shiftStime),$lte:parseInt(shiftEtime)},
            "type" : "department_shift"
          });
          if (rs && rs.length > 0){
            let result = await departmentStatusesService.exportExcel(rs, departmentid, shifttime);
            ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            ctx.set("Content-Disposition", "attachment; filename=" + "o2olog.xlsx");
            //console.log("处理数据：",result);
          
            ctx.body = result;  
          } else {

            ctx.set("Content-Disposition", "attachment; filename=" + "o2olog.xlsx");
            ctx.body = departmentStatusesService.exportEmpty();
          }

      } else if (departmentid){
        shifttime = await shiftService.resetStartAndEnd(time);
        if (shifttime){
            shiftStime = shifttime.start;
            shiftEtime = shifttime.end;
        }
        rs = await departmentStatusesService.findByCondition({
            "value": departmentid,
            "time": {$gte: parseInt(shiftStime),$lte:parseInt(shiftEtime)},
            "type" : "department_shift"
          }); 
          ctx.body = RSUtil.ok(rs); 
      } else {
          ctx.body = RSUtil.ok(cacheCurDayStatis); 
      }

    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }

  //定时更新部门的统计数据
  async getDepartmentStatus(){
      if (isQuery){//如果正在查询，则返回。
          return;
      }
    isQuery = true;
    try {
        let shifttime = await shiftService.getShiftDefineTime();
        //if (shifttime){
        let shiftStime = shifttime.sTime;
        let shiftEtime = shifttime.eTime;
        //}
        let cacheCurDayStatis0 = await departmentStatusesService.findByCondition({
            "time": {$gte: parseInt(shiftStime),$lte:parseInt(shiftEtime)},
            "type" : "department_shift"
          }, null, ['value', 'data']); 
          if (cacheCurDayStatis0 && cacheCurDayStatis0.length > 0){
            cacheCurDayStatis = cacheCurDayStatis0;
          } else {
            LogUtil.debug('there is no DayStatis!');
          }
          isQuery = false;
    } catch (error) {
        LogUtil.logErrorWithoutCxt(error);
        isQuery = false;
    }
   
      
  }

}

let instance = new DepartmentStatusesController();

setInterval(instance.getDepartmentStatus, 20000);

module.exports = new DepartmentStatusesController();
