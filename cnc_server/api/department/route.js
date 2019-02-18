var router = require('koa-router')();
var departmentController = require('./DepartmentController');
router.post('/department/updateAndCreate', departmentController.updateAndCreate);
router.get('/department/get/:type', departmentController.get);
router.get('/department/get', departmentController.getAll);

/*
*给凯胜定制的，可以由组织名称得到组织ID根据详细信息获取部门ID
* factory - 工厂名
* shop - 车间名
* line - 产线名
* station - 工站名
*/
//router.get('/department/getIDByDetail/:factory/:shop/:line/:station', departmentController.getIDByDetail);
router.get('/department/getIDByDetail', departmentController.getIDByDetail);
module.exports = router;
