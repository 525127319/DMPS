const BasicService = require('../../services/BasicService');
const DeviceStatusModel = require('../../models/DeviceStatusModel');
class DeviceStatusService extends BasicService{
  constructor(){
    super(DeviceStatusModel);
  }

}
module.exports = new DeviceStatusService();
