var router = require('koa-router')();
const allDevProgCtController=require('./AllDevProgCtController');
router.post("/alldevprogct/getDayHistoryProgram",allDevProgCtController.getDayHistoryProgram);
module.exports = router;
