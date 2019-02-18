var router = require('koa-router')();
var DeviceYearStatisticController = require('./DeviceYearStatisticController');

// router.post('/weekStatistic/findAll', DeviceWeekStatisticController.findAll);

router.post("/yearStatistic/yearlist", DeviceYearStatisticController.yearlist);

// router.post("/weekStatistic/Devicedepartment", DeviceWeekStatisticController.Devicedepartment);

module.exports = router;
