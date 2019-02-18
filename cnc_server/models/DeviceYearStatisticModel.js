let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let deviceyearstatistic = {
  dev_id: {type: String},
  type: {type: String},
  year_no: {type: Number},
  begin_time: {type: Number},
  create_time: {type: Number},
  end_time: {type: Number},
  update_time: {type: Number},

  data: { type: Schema.Types.Mixed },
}
deviceyearstatistic.getTableName = () => {
  return 'device_year_statistic';
}
module.exports = deviceyearstatistic;
