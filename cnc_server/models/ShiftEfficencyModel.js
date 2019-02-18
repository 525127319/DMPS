let efficency = {
    dev_id:{type:String},
    time: {type: Number},
    type: {type: String},
    data: {
        wt: {type: Number},
        rt: {type: Number},
        efficiency: {type: Number},
        efficiencies: [],
      }
  };
  efficency.getTableName = () => {
    return "single_device_shift_efficiency";
  };
  module.exports = efficency;
  