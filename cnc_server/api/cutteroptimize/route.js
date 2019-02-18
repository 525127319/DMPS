const router=require('koa-router')();
const CutterOptimizeController=require('./CutterOptimizeController.js');

/* 获取刀具实时动态
URL参数：
departmentid  - 部门树组织ID
pageIndex - 页码
pageSize - 每页多少条记录
http://127.0.0.1:3000/api/cutteroptimize/getCutterRTK/root_2018081411941458_2018081412340056_2018081412646616_20181017154620579_20181017114610579
*/
router.get("/cutteroptimize/getCutterRTK/:departmentid/:pageIndex/:pageSize", CutterOptimizeController.getCutterRTK);

/*
刀具优化、滞后记录
URL参数：
departmentid  - 部门树组织ID
devID - 设备编号 （单设备查询， 和department可以2选1）
date - 日期 YYYY-MM-DD
start - 开始时间 HH:mm
end - 结束时间 HH:mm
pageIndex - 页码
pageSize - 每页多少条记录
*/
router.get("/cutteroptimize/getCutterOptHistroy/:departmentid/:devID/:date/:start/:end/:pageIndex/:pageSize", CutterOptimizeController.getCutterOptHistroy);

/*
导出刀具优化、滞后记录
departmentid  - 部门树组织ID
devID - 设备编号 （单设备查询， 和department可以2选1）
date - 日期 YYYY-MM-DD
start - 开始时间 HH:mm
end - 结束时间 HH:mm
*/
router.post("/cutteroptimize/exportCutterOptHistroy", CutterOptimizeController.exportCutterOptHistroy); 

module.exports = router;
