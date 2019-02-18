var router = require('koa-router')();
var DepartmentYearStatisticController = require('./DepartmentYearStatisticController.js');

router.post('/departmentyearstatistic/yeardepartment', DepartmentYearStatisticController.yeardepartment);

module.exports = router;
