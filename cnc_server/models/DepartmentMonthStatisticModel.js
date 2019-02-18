let departmentMonthStatistic = {
  month_no:{type:Number},
  type:{type:String},
  year_no:{type:Number},
  begin_time:{type:Number},
  end_time:{type:Number},
  create_time:{type:Number},
  update_time:{type:Number},
  data:{type: Object},
  label:{type:String},
  parent_id:{type:String},
  value:{type:String},
};
departmentMonthStatistic.getTableName = () => {
  return 'department_month_statistic';
};
module.exports = departmentMonthStatistic;
