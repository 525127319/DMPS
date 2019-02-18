let RSUtil = require('../../utils/RSUtil');
const cncService = require('../device/DeviceService');
const pronameService = require('./PronameService');
class PronameController{
  async programname(ctx){
    let cncs = await cncService.findByCondition();
    let cncProNames = await pronameService.findAll();
    let rs = [];
    let cncProNamesObj = {};
    cncs.forEach((cnc) => {
      cncProNamesObj = cncProNames.filter((item => item.devID == cnc.devID))[0];
      if (cncProNamesObj) {
        rs.push(cncProNamesObj);
      }
    });
    ctx.body = RSUtil.ok(rs);
    cncProNamesObj = null;
    rs = null;
  }
}

module.exports = new PronameController();
