const router=require('koa-router')();
const deviceQuarterStatisticController=require('./DeviceQuarterStatisticController');

router.post("/getQuarterStatisticData/list", deviceQuarterStatisticController.getQuarterStatisticData);


module.exports = router;
