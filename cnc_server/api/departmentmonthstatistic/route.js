var router = require("koa-router")();
var departmentMonthStatisticController = require("./DepartmentMonthStatisticController");

router.post("/getDepartmentMonthStatistic/dmsData", departmentMonthStatisticController.getDepartmentMonthStatistic);

module.exports = router;
