let router = require('koa-router')();
let deviceStatusController = require('./DeviceStatusController');
router.post("/getDevice/devicedata", deviceStatusController.getDeviceData);
// 实时状态
router.get('/deviceStatusData/getStatusByDevId/:devid/:time',deviceStatusController.getDayStatusByDevId);
// 运行状态类型情况 
router.get('/deviceStatusData/getStatusByData/:devid/:pageIndex/:time', deviceStatusController.getStatusByData);
// 历史状态合成一次请求
router.post('/deviceStatusData/getDayStatusByDevIdsAndDay',deviceStatusController.getDayStatusByDevIdsAndDay);
module.exports = router;
