const router=require('koa-router')();
const toolInfoController=require('./ToolInfoController.js');

router.post('/importBasicExcel', toolInfoController.importBasicExcel);
router.get('/toolinfo/getAllToolDefine', toolInfoController.getAllTools);

module.exports = router;
