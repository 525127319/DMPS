var router = require('koa-router')();
var DepartmentStatisticsController = require('./DepartmentStatisticsController');
router.post("/getDepartmentDevice/data", DepartmentStatisticsController.getData);
module.exports = router;
