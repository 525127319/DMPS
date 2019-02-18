var router = require("koa-router")();
var departmentStatusesController = require("./DepartmentStatusesController");
router.post("/departmentstatuses/getdepartmentstatuses", departmentStatusesController.getDepartmentStatuses);
module.exports = router;
