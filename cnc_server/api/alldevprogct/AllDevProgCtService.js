const BasicService = require('../../services/BasicService');
const allDevProgCtModel = require('../../models/AllDevProgCtModel');
class AllDevProgCtModel extends BasicService{
  constructor(){
    super(allDevProgCtModel);
  }

}
module.exports = new AllDevProgCtModel();
