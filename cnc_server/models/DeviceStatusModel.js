let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let realtimedata = {
    dev_id: { type: String },
    type: { type: String },
    data: { type: Schema.Types.Mixed },
  };
  realtimedata.getTableName = () => {
    return "device_status_data";
  };
  module.exports = realtimedata;
  