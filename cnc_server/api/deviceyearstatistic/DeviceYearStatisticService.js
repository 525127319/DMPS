const BasicService = require('../../services/BasicService');
const DeviceYearStatisticModel = require('../../models/DeviceYearStatisticModel');
class DeviceYearStatisticService extends BasicService{
  constructor(){
    super(DeviceYearStatisticModel);
  }

  

}
module.exports = new DeviceYearStatisticService();
