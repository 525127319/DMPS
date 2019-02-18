const router=require('koa-router')();
const appConfigController=require('./AppConfigController.js');

//获取刀具自动生成报表的配置 type：0 - 总仓， 1 - 分仓， 2 - 实时
router.get("/appconfig/getCutterAutoReportConfig/:type", appConfigController.getCutterAutoReportConfig);   
//获取不换刀的休息时间
router.get("/appconfig/getRestTimeConfig", appConfigController.getRestTimeConfig);   
//获取效能配置数据
router.get("/appconfig/getEfficientConfig", appConfigController.getEfficientConfig);   

module.exports = router;
