let router = require("koa-router")();
let ProgramController = require("./ProgramController");

router.post("/programlist/addprogram", ProgramController.addprogram);
router.post("/programlist/list", ProgramController.list);
router.get('/programlist/delete/:pageIndex/:id', ProgramController.delete);

module.exports = router;
