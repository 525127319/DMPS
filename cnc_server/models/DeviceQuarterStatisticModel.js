let devicequarterstatistic={
  dev_id:{type:String},
  quarter_no:{type:Number},
  type:{type:String},
  year_no:{type:Number},
  begin_time:{type:Number},
  end_time:{type:Number},
  create_time:{type:Number},
  update_time:{type:Number},
  data:{
    id:{type:String},
    parent_id:{type:String},
    alarm_count:{type:Number},
    alarm_duration:{type:Number},
    count:{type:Number},
    efficiency:{type:Number},
    invalid_count:{type:Number},
    name:{type:String},
    rt:{type:Number},
    wt:{type:Number},
    children:[],
  }
}

devicequarterstatistic.getTableName = () =>{
  return 'device_quarter_statistic'
}

module.exports = devicequarterstatistic;
