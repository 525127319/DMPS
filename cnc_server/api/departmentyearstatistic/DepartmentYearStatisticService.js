const BasicService = require('../../services/BasicService');
const DepartmentYearStatisticModel = require('../../models/DepartmentYearStatisticModel');
class DepartmentYearStatisticService extends BasicService{
  constructor(){
    super(DepartmentYearStatisticModel);
  }

  

}
module.exports = new DepartmentYearStatisticService();
