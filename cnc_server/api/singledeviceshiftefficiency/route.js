var router = require('koa-router')();
var shiftefficencyController = require('./ShiftEfficencyController');

router.get('/shiftefficency/getEfficiency/:devid', shiftefficencyController.getEfficiency);


module.exports = router;