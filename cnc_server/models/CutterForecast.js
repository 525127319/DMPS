let cutterForecast = {
    //_id: { type: String },
    dev_id: {type: String},
    ct: {type: Number},
    dtime: {type: String},
    time: {type: Number},
    prog_name: {type: String},
    cutters: [],
    department:{type: String},
    status:{type: Number},      //设备状态
    type:{type:Number},         //0 总仓， 1 分仓, 2 实时
    genTime:{type: Number},
    genTimeStr:{type: String},
    duration:{type:String},
    program_ct:{type: Number},
    start:{type: Number},       //报表的开始时间
    end:{type: Number}          //报表的结束时间
    
  }
  cutterForecast.getTableName = ()=>{
    return 'cutters_forecast';
  }
  module.exports = cutterForecast;
  