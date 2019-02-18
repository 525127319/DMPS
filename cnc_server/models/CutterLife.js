let cutterLife = {
    _id: { type: String },
    dev_id: {type: String},
    ct: {type: Number},
    dtime: {type: String},
    time: {type: Number},
    prog_name: {type: String},
    cutters: [],
    program_ct:{type: Number},
    status:{type: Number}
  }
  cutterLife.getTableName = ()=>{
    return 'cutters_life';
  }
  module.exports = cutterLife;
  