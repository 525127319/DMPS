const DepartmentWeekStatisticService = require("./DepartmentWeekStatisticService");
let RSUtil = require('../../utils/RSUtil');
let TimeUtil = require('../../utils/TimeUtil');
let LogUtil = require('../../utils/LogUtil');

class DepartmentWeekStatistController {

  // 获取周的数据
  async weekdepartment(ctx) {
    let params = ctx.request.fields;
    let condition = {
      year_no: params.year_no,
      week_no: !params.week_no ? 0 : params.week_no,
      value: params.value,
      // shift: params.shift,
    };
    let value= {
      value: params.value,    
      year_no: params.year_no,
    }
    let rs
    if (!params.week_no) {
      rs = await DepartmentWeekStatisticService.findByCondition(value);
    } else if(params.week_no){
      rs = await DepartmentWeekStatisticService.findByCondition(condition);
    } 
    ctx.body = RSUtil.ok(rs);
  }
}

module.exports = new DepartmentWeekStatistController();
