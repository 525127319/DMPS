const RSUtil = require("../../utils/RSUtil");
const DeviceProgramService = require("./DeviceProgramService");

class DeviceProgramController {
  async saveDeviceProgram(ctx) {
    let params = ctx.request.fields;
    try {
      let rs = await DeviceProgramService.createMany(params);
      ctx.body = RSUtil.ok(rs);
      DeviceProgramService.readData(rs);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }

  async list(ctx) {
    let pageIndex = ctx.params.pageIndex;
    let devid = ctx.params.dev_id;
    try {
      let resInfo = await DeviceProgramService.pageByCondition(
        { dev_id: devid },
        pageIndex
      );
      ctx.body = RSUtil.ok(resInfo);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }

  async updateOrCreate(condition, entity, option) {
    let params = ctx.request.fields;
    try {
      let rs = await this.model.update(condition, entity, option);
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }
}

module.exports = new DeviceProgramController();
