let shiftEfficencyService = require("./ShiftEfficencyService");
let RSUtil = require("../../utils/RSUtil");
let TimeUtil = require('../../utils/TimeUtil');
let LogUtil = require('../../utils/LogUtil');

class ShiftefficencyController {

  async getEfficiency(ctx) {
    let params = ctx.params;
    let devid = params.devid;
    let curstartTime = TimeUtil.getDayStartUnixTime();
    try {
      let rs = await shiftEfficencyService.findByCondition({
        "dev_id": devid,
        "time": {$gte: parseInt(curstartTime)}
      });
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
        LogUtil.logError(ctx, error);
    }
  }
}

module.exports = new ShiftefficencyController();