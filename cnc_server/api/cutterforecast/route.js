const router=require('koa-router')();
const cutterForecastController=require('./CutterForecastController.js');

/*
获取刀具预期寿命
URL参数：
departmentid  - 部门id
*date - 生成数据的日期 YYYY-MM-DD
*start - 数据的开始时间 08:00
*end - 数据的结束时间 20:00
*type - 0:总仓， 1:分仓， 2:实时
*dev_id - 设备ID 不选的时候就填0
*pageIndex - 页码
*pageSize - 每页多少条记录
*/
//http://127.0.0.1:3000/api/cutterforecast/getCutterForecast/root/2018-11-09/15:00/21:00/1/0/1/10
router.get("/cutterforecast/getCutterForecast/:departmentid/:date/:start/:end/:type/:dev_id/:pageIndex/:pageSize", cutterForecastController.getCutterForecast); //获取刀具预期寿命
router.post("/cutterforecast/export/:departmentid/:date/:start/:end/:type", cutterForecastController.export);          //导出刀具预期寿命                                       
module.exports = router;
