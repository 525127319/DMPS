const BasicService = require('../../services/BasicService');
const DeviceMonthStatisticModel = require('../../models/DeviceMonthStatisticModel');
class DeviceMonthStatisticService extends BasicService{
    constructor(){
        super(DeviceMonthStatisticModel);
    }
  
}
module.exports = new DeviceMonthStatisticService();
