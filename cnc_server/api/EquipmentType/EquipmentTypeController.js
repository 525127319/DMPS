let equipmentTypeService = require("./EquipmentTypeService");
let equipmentTypeFlagSnService = require("./EquipmentTypeFlagSnService");
let RSUtil = require("../../utils/RSUtil");
class EquipmentTypeController {
  async add(ctx) {
    let params = ctx.request.fields;
    try {
      let resInfo = await equipmentTypeService.create(params);
      ctx.body = RSUtil.ok(resInfo);
    } catch (error) {
      ctx.body = RSUtil.fail("品牌名、设备类型、设备型号重复,请重新填写");
    }
  }

  async list(ctx) {
    let pageIndex = ctx.params.pageIndex;
    try {
      let resInfo = await equipmentTypeService.pageByCondition(null, pageIndex);
      ctx.body = RSUtil.ok(resInfo);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }

  async delete(ctx) {
    let pageIndex = ctx.params.pageIndex;
    let id = ctx.params.id;
    try {
      let resInfo = await equipmentTypeService.removeById(id);
      resInfo = await equipmentTypeService.pageByCondition(null, pageIndex);
      ctx.body = RSUtil.ok(resInfo);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }

  async update(ctx) {
    let params = ctx.request.fields;
    try {
      let resInfo = await equipmentTypeService.update(params);
      ctx.body = RSUtil.ok(resInfo);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }

  async devicetypelist(ctx) {
    try {
      let rs = await equipmentTypeService.findAll();
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }
}

module.exports = new EquipmentTypeController();
