var router = require("koa-router")();
var flagSnController = require("./FlagSnController");

router.get("/device/findFlagSn", flagSnController.findFlagSn);
router.post("/device/createFlagSn", flagSnController.createFlagSn);

module.exports = router;
