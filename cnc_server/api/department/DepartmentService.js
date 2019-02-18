const BasicService = require('../../services/BasicService');
const departmentModel = require('../../models/DepartmentModel');
const _ = require('lodash');
let _deparement = null, map = new Map();
class DepartmentService extends BasicService{
    constructor(){
        super(departmentModel);
    }

    async cache(){
        if (!_deparement){
            _deparement = await super.findByCondition({'type': 'department'});
        } 
        if (_deparement)
            this.resetMap(_deparement[0].data, map);
    }

    resetMap(deparement ,_map) {
        _map.clear();
        _map.set(deparement.value, deparement);
        this.set2Map(deparement.children, _map);
      };
    
      set2Map(children, _map) {
        if (children.length <= 0) return;
        children.map(node => {
          _map.set(node.value, node);
          if (node.children.length > 0) {
            this.set2Map(node.children, _map);
          }
        });
      };

    async getDepartmentTreeByDeparementId(departmentId){

        //获取部门树结构
        let deparement = null;
        if (!_deparement){
            deparement = _deparement = await super.findByCondition({'type': 'department'});
        } else {
            deparement = _deparement;
        }
       
        //查找和查询部门一至的
        let tmp = null;
        if (deparement && deparement.length >0){
            tmp = this.getDepartmentByDepartmentId(deparement[0].data, departmentId);
        }
        if (tmp) return tmp;
        return null;
    }

    getDepartmentByDepartmentId(deparement, departmentId){
        if (deparement.value == departmentId){
            return deparement;
        }
        let local = this;
        let children = deparement.children;
        if (!children || children.length <= 0)return null;
        let element = null, tmp = null;
        for (let index = 0; index < children.length; index++) {
            element = children[index];
            tmp = local.getDepartmentByDepartmentId(element, departmentId);
            if (tmp) return tmp;
        }
    }

    getDepartmentById(id){
        return map.get(id);
    }

}

let instance = new DepartmentService();
instance.cache();
module.exports = instance;