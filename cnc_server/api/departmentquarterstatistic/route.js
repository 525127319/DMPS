var router = require("koa-router")();
var departmentQuarterStatisticController = require("./DepartmentQuarterStatisticController");

router.post("/getDepartmentQuarterStatistic/dqsData", departmentQuarterStatisticController.getDepartmentQuarterStatistic);

module.exports = router;
