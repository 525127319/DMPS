const BasicService = require('../../services/BasicService');
const equipmentTypeModle = require('../../models/EquipmentTypeModle');
class EquipmentTypeFlagSnService extends BasicService{
  constructor(){
    super(equipmentTypeModle);
  }
}
module.exports = new EquipmentTypeFlagSnService();
