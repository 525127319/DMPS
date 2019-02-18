const BasicService = require('../../services/BasicService');
const mainProgramNameModel = require('../../models/SingleDevProgCtModel');
const _ = require('lodash');
class PronameService extends BasicService{
  constructor(){
    super(mainProgramNameModel);
  }
}
module.exports = new PronameService();
