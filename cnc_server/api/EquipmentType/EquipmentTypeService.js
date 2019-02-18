const BasicService = require('../../services/BasicService');
const EquipmentTypeModle = require('../../models/EquipmentTypeModle');
class EquipmentTypeService extends BasicService{
    constructor(){
        super(EquipmentTypeModle);
    }
    async create(entity) {
        let rs =await super.countByCondition({name:entity.name,
            type:entity.type,
            model:entity.model
        })
        
        if(rs > 0){
            return false;
        }
 
        return super.create(entity);
    }
}
module.exports = new EquipmentTypeService();