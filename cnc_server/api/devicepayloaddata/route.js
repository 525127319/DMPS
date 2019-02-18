var router = require('koa-router')();
var devicePayloadDataController = require('./DevicePayloadDataController');
router.get('/devicepayloaddata/getdevicepayloaddata/:devid', devicePayloadDataController.getdevicepayloaddata);
module.exports = router;