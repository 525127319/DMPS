var router = require('koa-router')();
var shiftController = require('./ShiftController');

router.get('/shift/findById/:id', shiftController.findById);
router.post('/shift/add', shiftController.add);
router.post('/shift/addShift', shiftController.addShift);
router.post('/shift/update', shiftController.update);
router.post('/shift/updateName', shiftController.updateName);
router.post('/shift/delete', shiftController.delete);
router.post('/shift/deleteById', shiftController.deleteById);
router.get('/shift/list/:pageIndex', shiftController.list);
router.post('/shift/findAll',shiftController.findAll);
router.get('/shift/getShiftDefineTime',shiftController.getShiftDefineTime);

module.exports = router;
