var router = require('koa-router')();
var DeviceWeekStatisticController = require('./DeviceWeekStatisticController');

// router.post('/weekStatistic/findAll', DeviceWeekStatisticController.findAll);

router.post("/weekStatistic/weeklist", DeviceWeekStatisticController.weeklist);

// router.post("/weekStatistic/Devicedepartment", DeviceWeekStatisticController.Devicedepartment);

module.exports = router;
