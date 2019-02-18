const BaseService = require('../../services/BasicService');
const ShiftEfficencyModel= require('../../models/ShiftEfficencyModel');

class ShiftEfficencyService extends BaseService{
    constructor (){
      super(ShiftEfficencyModel);
    }

}

module.exports = new ShiftEfficencyService();