let realtime = {
  dev_id: {type: String},
  //dev_id: { type: Schema.Types.St, ref: 'Story' },
  time: {type: Number},
  type: {type: String},
  start_time: {type: Number},
  //department: {type: Number},

  data: {
    wt: {type: Number},
    rt: {type: Number},
    status: {
      type: Number,
    },
    
    payload: {type: Number},
    prog_name: {type: String},
    alarm_code: {type: String},
    alarm_msg: {type: String},
    cutters: [],
    count: {type: Number},
    alarm_count: {type: Number}
  }
}
realtime.getTableName = () => {
  return 'device_monitor';
}
module.exports = realtime;
