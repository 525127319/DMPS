const BasicService = require('../../services/BasicService');
const DeviceWeekStatisticModel = require('../../models/DeviceWeekStatisticModel');
class DeviceWeekStatisticService extends BasicService{
  constructor(){
    super(DeviceWeekStatisticModel);
  }

  

}
module.exports = new DeviceWeekStatisticService();
