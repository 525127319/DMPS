let programService = require("./ProgramService");
let RSUtil = require("../../utils/RSUtil");

class ProgramController {
  async addprogram(ctx) {
    let params = ctx.request.fields;
    try {
      let rs = await programService.create(params);
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }

  async list(ctx) {
    let params = ctx.request.fields;
    let pageIndex = params.pageIndex;
    let condition = {};
    if (params.programName) {
      condition.programName = RegExp(`${params.programName}`);
    }
    try {
      let rs = await programService.pageByCondition(
        condition,
        pageIndex,
        null,
        { time: -1 }
      );
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }

  async delete(ctx) {
    let params = ctx.params;
    let pageIndex = params.pageIndex;
    let id = params.id;
    try {
      let rs = await programService.removeById(id);
      rs = await programService.pageByCondition(null, pageIndex);
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }
}
module.exports = new ProgramController();
