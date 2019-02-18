const router=require('koa-router')();
const alarmInfoController=require('./AlarmInfoController.js');

// router.get('/alarminfo/list/:pageIndex',alarmInfoController.list);
// router.get('/alarminfo/deallist/:pageIndex',alarmInfoController.deallist);
router.get("/alarminfo/getHistoryAlarms/:devid/:pageIndex",alarmInfoController.getHistoryAlarms);//未知
router.post('/alarminfo/group',alarmInfoController.groupByCode)
router.get('/alarminfo/alarmcode',alarmInfoController.allAlarmCode)//获取所有报警码
router.post('/alarminfo/update',alarmInfoController.updateOrCreate);//处理报警
router.post('/alarminfo/search',alarmInfoController.searchNotDeal)//未处理的报警
router.post('/alarminfo/searchdeal',alarmInfoController.searchDeal)//处理过的报警
router.post('/alarminfo/findAlarmInfo',alarmInfoController.findAlarmInfo) // 根据开始时间和结束时间查找报警信息
router.post('/upLoadFile', alarmInfoController.upLoadFile);

module.exports = router;
