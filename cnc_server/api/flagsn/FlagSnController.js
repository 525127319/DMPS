let flagSnService = require("./FlagSnService");
let RSUtil = require("../../utils/RSUtil");

class FlagSnController {
  async findFlagSn(ctx) {
    let params = ctx.params;
    let rs = await flagSnService.findAll(params);
    ctx.body = RSUtil.ok(rs);
  }

  async createFlagSn(ctx) {
    let params = ctx.request.fields;
    let rs = await flagSnService.create(params);
    ctx.body = RSUtil.ok(rs);
  }
}

module.exports = new FlagSnController();
