const BasicService = require('../../services/BasicService');
const flagSnModel = require('../../models/FlagSnModel');
class FlagSnService extends BasicService{
  constructor(){
    super(flagSnModel);
  }
}
module.exports = new FlagSnService();
