let router = require('koa-router')();
let realtimedataController = require('./RealtimedataController');
router.get('/realtiemdata/getCurStatusByDevId/:devid', realtimedataController.getCurDayStatusByDevId);
router.get('/realtiemdata/getStatusByDevIdArrayAndDay/:devids/:day', realtimedataController.getStatusByDevIdArrayAndDay);
router.get('/realtiemdata/getDayStatusByDevIdAndDay/:devid/:day', realtimedataController.getDayStatusByDevIdAndDay);
// 实时状态
router.get('/realtiemdata/getStatusByDevId/:devid',realtimedataController.getDayStatusByDevId); 
router.get('/realtiemdata/getStatusByData/:devid/:pageIndex', realtimedataController.getStatusByData);

// 历史状态合成一次请求
router.post('/realtiemdata/getDayStatusByDevIdsAndDay',realtimedataController.getDayStatusByDevIdsAndDay);
module.exports = router;
