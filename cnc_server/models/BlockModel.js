let block = {
    dev_id: { type: String },
    department: {type: String},

    frunendtime: {type: Number},//第一次运行结束时间
    srunstarttime: {type: Number},//第二次运行开始时间
    isconflict: {type: Boolean},//是否冲突

    opwaitduration: {type: Number},//op待待时间
    realwaitduration: {type: Number},//机器实际待时间

    updatetime: {type: Number},//获取数据时间
    uploadduration: {type: Number},//上料时间

    times:[],
  }
  block.getTableName = ()=>{
    return 'op_statics';
  }
  module.exports = block;
  