let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let daystatistic = {
  dev_id: {type: String},
  time: {type: Number},
  type: {type: String},
  // data: {
  //   wt: {type: Number},
  //   rt: {type: Number},
  //   efficiency: {type: Number},
  //   efficiencies: {type: Object},
  // }
  data: { type: Schema.Types.Mixed },
}
daystatistic.getTableName = () => {
  return 'day_statistic';
}
module.exports = daystatistic;
