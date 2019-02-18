let departmentQuarterStatisticService = require("./DepartmentQuarterStatisticService");
let RSUtil = require("../../utils/RSUtil");
let TimeUtil = require('../../utils/TimeUtil');
let LogUtil = require('../../utils/LogUtil');
const DeviceStatisticUtil = require('../../utils/DeviceStatisticUtil');

class DepartmentQuarterStatisticController {

  //获取季度统计报警信息
  async getDepartmentQuarterStatistic(ctx) {
    let departmentid = ctx.request.fields.value;
    let shift = ctx.request.fields.shift;
    let ctype = ctx.request.fields.ctype;
    let date =ctx.request.fields.stime;
    let index =date.indexOf('-')
    let year =date.slice(0,index);
    let quarter =date.slice(index+1,date.length);
    try {
        let rs = await departmentQuarterStatisticService.findByCondition({value: departmentid,quarter_no:quarter,year_no:year,type:'shift_efficiency'});
        let dpQuarterList= rs.map(items =>{
          let _t = items.data;
          return DeviceStatisticUtil.matchByShiftId(_t,shift);
        }) 
        ctx.body = RSUtil.ok(dpQuarterList); 
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }

  

}



module.exports = new DepartmentQuarterStatisticController();
