const BasicService = require('../../services/BasicService');
const devicePayloadDataModel = require('../../models/DevicePayloadDataModel');
class DevicePayloadDataService extends BasicService{
  constructor(){
    super(devicePayloadDataModel);
  }
}
module.exports = new DevicePayloadDataService();