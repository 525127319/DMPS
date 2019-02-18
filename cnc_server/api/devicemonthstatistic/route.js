const router=require('koa-router')();
const deviceMonthStatisticController=require('./DeviceMonthStatisticController');

router.post("/getMonthStatisticData/list", deviceMonthStatisticController.getMonthStatisticData);
// router.post("/getMonthMess/list", deviceMonthStatisticController.getMonthMess);

module.exports = router;
