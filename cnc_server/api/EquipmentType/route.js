let router = require("koa-router")();
let EquipmentTypeController = require("./EquipmentTypeController");
router.post("/equipmentType/add", EquipmentTypeController.add);
router.get("/equipmentType/list/:pageIndex", EquipmentTypeController.list);
router.get('/equipmentType/delete/:pageIndex/:id', EquipmentTypeController.delete);
router.post('/equipmentType/update', EquipmentTypeController.update);
router.get('/device/devicetypelist', EquipmentTypeController.devicetypelist);

module.exports = router;
