const BasicService = require('../../services/BasicService');
const deviceMonitorModel = require('../../models/DeviceMonitorModel');
class DeviceMonitorService extends BasicService{
  constructor(){
    super(deviceMonitorModel);
    this.devMap = new Map();
    this.devList = [];
    this.depList = [];
  }

  async findByMonitorStatus(departmentId){
      try {
        let rs = await this.model.aggregate([
            {
                $lookup: {
                   from: "device",
                   //localField: "dev_id",    // field in the monitor collection
                   //foreignField: "dev_id_s",  // field in the device collection
                   as: "items",
                   let: { dev_id: "$dev_id", order_qty: "$ordered" },//主表
                   pipeline: [
                    { $match:
                       { $expr:
                          { $and:
                             [
                               { $eq: [ "$dev_id_s"/*从表*/,  "$$dev_id" ] },
                               { $eq: [ "$department"/*从表*/,  departmentId ] },
                               //{ $eq: [ "$data.status"/*从表*/, 2 ] }
                             ]
                          },
                         // "$data.status"/*从表*/: 2
                       }
                    },
                    // {
                    //     $match: { "$start_time": 1535375784 }
                    //  }
                    //{ $project: { stock_item: 0, _id: 0 } }
                 ],
                 
                },
             },

             {
                $match: { "inventory_docs": { $ne: [] } }
             }
        ]);
        console.log('rs', rs);
  } catch (error) {
    console.error(error);
  }

    // .find(condition).populate({
    //     path: 'device',
    //     match: { 'dev_id':   2},
    //     options: { limit: 5 }
    //   });
  }

  /*
  设置缓存
  */

  setDeviceMonitorCache(devMons){
      this.devList = devMons;
      this.devList.sort((a, b)=>{
        return a.dev_id - b.dev_id;
      });
      this.devMap.clear();
  }

  getDeviceByCondition(dID, status, pageIndex, pageSize){
    let key = dID + '_' + status;
    let result = {};
    let list = [];
    let ps = 0, pe = 0;

    if(this.devMap.has(key)){       //如果已经缓存，就直接取缓存
      list = this.devMap.get(key);
    }
    else{     //没有就先算一次，然后存缓存
      this.devList.forEach(dev => {
        if(dev.department.indexOf(dID) != -1 && (status == 0 || dev.data.status == status)){
          dev.data.cutters = null;    //不需要这个数据
          list.push(dev);
        }
      });
      this.devMap.set(key, list);
    //return {rs: list, total: list.length};
    }
    
    if(pageIndex <= 0){
      result = {total:list.length, rs:list};
    }
    else{
      ps = (pageIndex-1)*pageSize;
      pe = ps + pageSize;
      result = {total:list.length, rs:list.slice(ps, pe)};
    }
    return result;
  }

  setDepartmentStaticsCache(list){
    this.depList = list;
  }

  getDepartmentStatics(){
    return this.depList;
  }
}
module.exports = new DeviceMonitorService();
