var router = require('koa-router')();
var strategyController = require('./StrategyController');
router.post('/strategy/create',strategyController.create);
router.get('/strategy/list/:pageIndex', strategyController.list);
router.post('/strategy/update',strategyController.update);
router.post('/strategy/delete/:pageIndex/:id',strategyController.delete);
router.post('/strategy/search',strategyController.search);
module.exports = router;