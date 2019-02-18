let cncFlagSn = {
  flagSn: {type: Number},
  title: {type: String},
  updateDate: {type: Date, default: Date.now}
};
cncFlagSn.getTableName = ()=>{
  return 'flag_Sn';
};
module.exports = cncFlagSn;
