const BasicService = require('../../services/BasicService');
const DeviceQuarterStatisticModel = require('../../models/DeviceQuarterStatisticModel');
class DeviceQuarterStatisticService extends BasicService{
    constructor(){
        super(DeviceQuarterStatisticModel);
    }
  
}
module.exports = new DeviceQuarterStatisticService();
