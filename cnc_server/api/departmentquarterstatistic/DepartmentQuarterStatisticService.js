const BasicService = require('../../services/BasicService');
const departmentQuarterStatisticModel = require('../../models/DepartmentQuarterStatisticModel');
const dayStatisticService = require("./../daystatistic/DayStatisticService");
const deviceService = require('../device/DeviceService');
const shiftService = require('../shift/ShiftService');
const CommonUtil = require('../../utils/CommonUtil');
var xlsx = require('node-xlsx');

class DepartmentQuarterStatisticService extends BasicService {
  constructor() {
    super(departmentQuarterStatisticModel);
   
  }

 
}

module.exports = new DepartmentQuarterStatisticService();
