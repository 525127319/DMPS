let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let deviceweekstatistic = {
  dev_id: {type: String},
  type: {type: String},
  week_no: {type: Number},
  year_no: {type: Number},
  begin_time: {type: Number},
  create_time: {type: Number},
  end_time: {type: Number},
  update_time: {type: Number},

  data: { type: Schema.Types.Mixed },
}
deviceweekstatistic.getTableName = () => {
  return 'device_week_statistic';
}
module.exports = deviceweekstatistic;
