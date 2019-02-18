let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let realtimedata = {
    dev_id: { type: String },
    time: { type: Number },
    type: { type: String },
    data: { type: Schema.Types.Mixed },
  };
  realtimedata.getTableName = () => {
    return "real_time_data";
  };
  module.exports = realtimedata;
  