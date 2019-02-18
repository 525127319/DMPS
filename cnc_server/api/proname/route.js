var router = require('koa-router')();
var pronameController = require('./PronameController');
router.get('/card/programname', pronameController.programname);

module.exports = router;
