let alarminfo={
  dev_id:{type:String},
  time:{type:Number},
  type:{type:String},
  status:{type:Number},
  fix_time:{type:Number},
  fix_man:{type:String},
  desc:{type:String},
  data:{
    alarm_code:{type:String},
    alarm_msg:{type:String},
    prog_name:{type:String}
  }
}

alarminfo.getTableName = () =>{
  return 'alarm_info'
}

module.exports = alarminfo;
