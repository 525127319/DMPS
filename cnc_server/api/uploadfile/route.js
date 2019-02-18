var router = require('koa-router')();
var uploadFileController = require('./UploadFileController');
router.post('/upLoadFile', uploadFileController.upLoadFile);

module.exports = router;
