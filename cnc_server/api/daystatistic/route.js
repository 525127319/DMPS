var router = require('koa-router')();
var dayStatisticController = require('./DayStatisticController');
router.get('/dayStatistic/getDayEfficiency/:devid', dayStatisticController.getDayEfficiency);
router.get('/dayStatistic/getDayProduct/:devid/:pageIndex', dayStatisticController.getDayProduct);
router.get('/dayStatistic/getDayProductDetail/:deid/', dayStatisticController.getDayProductDetail);
router.post('/dayStatistic/curtime', dayStatisticController.curtime);
router.get('/dayStatistic/getSingletDayProductDetail/:devid/:time',dayStatisticController.getSingletDayProductDetail); //单设备班别日产量详情列表
router.get('/dayStatistic/getShiftEfficiency/:devid/:time',dayStatisticController.getShiftEfficiency); //班别稼动率

module.exports = router;
