let cutterOptimize = {
    dev_id: {type: String},       //设备ID
    orgTime: {type: Number},      //原始数据时间
    optTime: {type: Number},      //优化数据时间
    delayTime: {type: Number},    //滞后数据时间
    department:{type: String},    //组织ID
    genTime:{type: Number},       //记录生成时间
    genTimeStr:{type: String},    //记录生成时间字符串
    duration:{type:String},       //表示刀具预测的时间段
    update: {type: Number},       //数据更新时间
    cutters: [],                  //刀具信息
    start:{type: Number},         //报表的开始时间
    end:{type: Number},           //报表的结束时间
    delay:{type: Number},          //刀具滞后的秒数
    optResult:{type: Boolean},     //设备优化结果
    delayResult:{type: Boolean},   //设备滞后结果
    optMsg:{type:String},         //优化回复消息
    delayMsg:{type:String},        //滞后回复消息
    isOptReq:{type:Boolean},       //设备是否发起优化
    isDelayReq:{type:Boolean}      //设备是否发起滞后
  }
  cutterOptimize.getTableName = ()=>{
    return 'cutters_optimize';
  }
  module.exports = cutterOptimize;
  