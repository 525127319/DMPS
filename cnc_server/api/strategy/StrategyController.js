let strategyService = require('./StrategyService');
let RSUtil = require('../../utils/RSUtil');

class StrategyController {
    async create (ctx) {
        let params = ctx.request.fields;
        let rs = await strategyService.create(params);
        ctx.body = RSUtil.ok(rs);
    }
    async list (ctx){
        let params = ctx.params;
        let pageIndex = params.pageIndex;
        let rs = await strategyService.pageByCondition(null,pageIndex);
        ctx.body = RSUtil.ok(rs);
    }
    async update (ctx){
        let params = ctx.request.fields;
        let rs = await strategyService.update(params);
        ctx.body = RSUtil.ok(rs);
    }
    async delete (ctx){
        let params = ctx.params;
        let pageIndex = params.pageIndex;
        let  id = params.id;
        let rs = await strategyService.removeById(id);
        rs = await strategyService.pageByCondition(null,pageIndex);
        ctx.body = RSUtil.ok(rs);
    }
    async search (ctx){
        let params = ctx.request.fields;
        // let rs = await strategyService.findByCondition({'company':params.company,'devType':params.devType});
        let rs = await strategyService.findByCondition(params);
        ctx.body = RSUtil.ok(rs);
    }
}

module.exports = new StrategyController();