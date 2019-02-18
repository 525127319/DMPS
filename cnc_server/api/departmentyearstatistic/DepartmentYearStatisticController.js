const DepartmentYearStatisticService = require("./DepartmentYearStatisticService.js");
let RSUtil = require('../../utils/RSUtil');
let TimeUtil = require('../../utils/TimeUtil');
let LogUtil = require('../../utils/LogUtil');

class DepartmentYearStatistController {

  // 获取周的数据
  async yeardepartment(ctx) {
    let params = ctx.request.fields;
    let condition = {
      year_no: params.year_no,
      // week_no: !params.week_no ? 0 : params.week_no,
      value: params.department,
      // shift: params.shift,
    };
    // let value= {
    //   value: params.value,    
    //   year_no: params.year_no,
    // }
    let rs  = await DepartmentYearStatisticService.findByCondition(condition);
  //   if (!params.week_no) {
  //     rs = await DepartmentYearStatisticService.findByCondition(value);
  //   } else if(params.week_no){
  //     rs = await DepartmentYearStatisticService.findByCondition(condition);
  //   } 
    ctx.body = RSUtil.ok(rs);
  }
}

module.exports = new DepartmentYearStatistController();
