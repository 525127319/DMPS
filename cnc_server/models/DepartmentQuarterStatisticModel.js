let departmentQuarterStatistic = {
  year_no:{type:Number},
  type:{type:String},
  quarter_no:{type:Number},
  begin_time:{type:Number},
  end_time:{type:Number},
  create_time:{type:Number},
  update_time:{type:Number},
  data:{type: Object},
  label:{type:String},
  parent_id:{type:String},
  value:{type:String},
};
departmentQuarterStatistic.getTableName = () => {
  return 'department_quarter_statistic';
};
module.exports = departmentQuarterStatistic;
