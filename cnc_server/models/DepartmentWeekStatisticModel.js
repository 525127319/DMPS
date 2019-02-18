let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let departmentweekstatistic = {
  type: {type: String},
  value: {type: String},
  week_no: {type: Number},
  year_no: {type: Number},
  begin_time: {type: Number},
  create_time: {type: Number},
  end_time: {type: Number},
  update_time: {type: Number},
  label: {type: String},
  parent_id: {type: String},

  data: { type: Schema.Types.Mixed },
}
departmentweekstatistic.getTableName = () => {
  return 'department_week_statistic';
}
module.exports = departmentweekstatistic;