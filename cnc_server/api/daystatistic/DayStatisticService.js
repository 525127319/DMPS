const BasicService = require('../../services/BasicService');
const DayStatisticModel = require('../../models/DayStatisticModel');
class DayStatisticService extends BasicService{
  constructor(){
    super(DayStatisticModel);
  }

  

}
module.exports = new DayStatisticService();
