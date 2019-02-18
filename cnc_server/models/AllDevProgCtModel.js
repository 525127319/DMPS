let alldevprogct = {
  _id: { type: String },
  time: {type: Number},
  type: {type: String},
  prog_name: {type: String},
  data: {
    max_ct: {type: Number},
    min_ct: {type: Number},
    avg_ct: {type: Number},
    count: {type: Number}
  },
}
alldevprogct.getTableName = ()=>{
  return 'all_dev_prog_ct';
}
module.exports = alldevprogct;
