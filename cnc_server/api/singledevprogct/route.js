var router = require('koa-router')();
const singleDevProgCtController=require('./SingleDevProgCtController');
router.get("/singledevprogct/getHistoryProgram/:devid/:pageIndex", singleDevProgCtController.getHistoryProgram);
router.post("/singledevprogct/getDayProgramDetail", singleDevProgCtController.getDayProgramDetail);
router.post("/singledevprogct/getHyProDetail", singleDevProgCtController.getHyProDetail);
router.get("/singledevprogct/singlesum", singleDevProgCtController.singlesum);
module.exports = router;
