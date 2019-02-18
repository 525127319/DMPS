var router = require('koa-router')();
var deviceMonitorController = require('./DeviceMonitorController');
router.post('/devicemonitor/load', deviceMonitorController.deviceload);
router.post('/devicemonitor/status', deviceMonitorController.devicestatus);
router.post('/devicemonitor/deviceStatusByDepartment', deviceMonitorController.deviceStatusByDepartment);
router.get('/devicemonitor/getMonitorData/:devid/:pageIndex', deviceMonitorController.getMonitorData);
//router.post('/devicemonitor/getDeviceData', deviceMonitorController.getDeviceData);
module.exports = router;
