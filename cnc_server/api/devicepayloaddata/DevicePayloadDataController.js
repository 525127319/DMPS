const devicePayloadDataService = require('./DevicePayloadDataService');
let RSUtil = require('../../utils/RSUtil');
let TimeUtil = require('../../utils/TimeUtil');
let LogUtil = require('../../utils/LogUtil');

class DevicePayloadDataController {

  async getdevicepayloaddata(ctx) {
    let params = ctx.params;
    let devid = params.devid;
    let curTime = TimeUtil.geCurUnixTime()-5;
    try {
      let rs = await devicePayloadDataService.findByCondition({
        "dev_id": devid,
        "type" : "payload",
        "time": {$gte: parseInt(curTime)}
      });
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
      LogUtil.logError(ctx, error);
    }
  }
 
}
module.exports = new DevicePayloadDataController();
