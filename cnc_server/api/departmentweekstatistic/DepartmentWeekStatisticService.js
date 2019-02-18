const BasicService = require('../../services/BasicService');
const DepartmentWeekStatisticModel = require('../../models/DepartmentWeekStatisticModel');
class DepartmentWeekStatisticService extends BasicService{
  constructor(){
    super(DepartmentWeekStatisticModel);
  }

  

}
module.exports = new DepartmentWeekStatisticService();
