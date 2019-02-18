var router = require("koa-router")();
var deviceProgramController = require("./DeviceProgramController");

router.post(
  "/deviceProgramRecord/saveDeviceProgram",
  deviceProgramController.saveDeviceProgram
);
router.post(
  "/deviceProgramRecord/updateProgram",
  deviceProgramController.updateOrCreate
);

router.get(
  "/deviceProgramRecord/list/:pageIndex/:dev_id",
  deviceProgramController.list
);

module.exports = router;
