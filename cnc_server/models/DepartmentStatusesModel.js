let departmentStatuses = {
  time: {type: Number},
  type: {type: String},
  value: {type: String},
  label: {type: String},
  parent_id: {type: String},
  data: {type: Object},
};
departmentStatuses.getTableName = () => {
  return 'department_statuses';
};
module.exports = departmentStatuses;
