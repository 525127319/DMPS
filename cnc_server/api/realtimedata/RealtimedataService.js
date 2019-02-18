const BasicService = require('../../services/BasicService');
const RealtimedataModel = require('../../models/RealtimedataModel');
class RealtimedataService extends BasicService{
  constructor(){
    super(RealtimedataModel);
  }

}
module.exports = new RealtimedataService();
