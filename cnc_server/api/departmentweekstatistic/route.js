var router = require('koa-router')();
var DepartmentWeekStatisticController = require('./DepartmentWeekStatisticController');

router.post('/departmentweekstatistic/weekdepartment', DepartmentWeekStatisticController.weekdepartment);

module.exports = router;
