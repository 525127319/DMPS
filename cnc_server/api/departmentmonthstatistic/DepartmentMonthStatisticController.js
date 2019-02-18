let departmentMonthStatisticService = require("./DepartmentMonthStatisticService");
let RSUtil = require("../../utils/RSUtil");
let TimeUtil = require('../../utils/TimeUtil');
let LogUtil = require('../../utils/LogUtil');
var shiftService = require('../shift/ShiftService');
const DeviceStatisticUtil = require('../../utils/DeviceStatisticUtil');

class DepartmentMonthStatisticController {

  //获取月统计报警信息
  async getDepartmentMonthStatistic(ctx) {
    let departmentid = ctx.request.fields.value;
    let date =ctx.request.fields.stime;
    let index =date.indexOf('-')
    let year =date.slice(0,index);
    let month =date.slice(index+1,date.length);
    let shift =ctx.request.fields.shift
    try {
        let rs = await departmentMonthStatisticService.findByCondition({value: departmentid,month_no:month,year_no:year,type:'shift_efficiency'});
        let dpMonthList= rs.map(items =>{
          let _t = items.data;
          return DeviceStatisticUtil.matchByShiftId(_t,shift);
        })
        ctx.body = RSUtil.ok({dpMonthList}); 
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }
}


module.exports = new DepartmentMonthStatisticController();
