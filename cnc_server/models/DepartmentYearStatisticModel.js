let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let departmentyearstatistic = {
  type: {type: String},
  value: {type: String},
  year_no: {type: Number},
  begin_time: {type: Number},
  create_time: {type: Number},
  end_time: {type: Number},
  update_time: {type: Number},
  label: {type: String},
  parent_id: {type: String},

  data: { type: Schema.Types.Mixed },
}
departmentyearstatistic.getTableName = () => {
  return 'department_year_statistic';
}
module.exports = departmentyearstatistic;