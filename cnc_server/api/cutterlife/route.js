const router=require('koa-router')();
const cutterLifeController=require('./CutterLifeController.js');

router.get("/cutterlife/getCutterlifeByDepartmentId/:hours/:departmentid/:pageIndex",cutterLifeController.getCutterlifeByDepartmentId);//根据部门获取刀具时间
router.post("/cutterlife/export",cutterLifeController.export);//根据部门获取刀具时间
module.exports = router;
