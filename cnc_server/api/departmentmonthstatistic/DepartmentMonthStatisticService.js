const BasicService = require('../../services/BasicService');
const departmentMonthStatisticModel = require('../../models/DepartmentMonthStatisticModel');
const dayStatisticService = require("./../daystatistic/DayStatisticService");
const deviceService = require('../device/DeviceService');
const shiftService = require('../shift/ShiftService');
const CommonUtil = require('../../utils/CommonUtil');
var xlsx = require('node-xlsx');
class DepartmentMonthStatisticService extends BasicService {
  constructor() {
    super(departmentMonthStatisticModel);
   
  }

}

module.exports = new DepartmentMonthStatisticService();
