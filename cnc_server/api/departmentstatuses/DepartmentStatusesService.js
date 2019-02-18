const BasicService = require('../../services/BasicService');
const departmentStatusesModel = require('../../models/DepartmentStatusesModel');
const dayStatisticService = require("./../daystatistic/DayStatisticService");
const deviceService = require('../device/DeviceService');
const shiftService = require('../shift/ShiftService');
const CommonUtil = require('../../utils/CommonUtil');
let LogUtil = require('../../utils/LogUtil');
var xlsx = require('node-xlsx');
let title = ['名称', '工作时长(h)', '开机时长(h)', '稼动率(%)','报警总数','报警总时长(h)', '有效产量', '异常产量'];
class DepartmentStatusesService extends BasicService {
  constructor() {
    super(departmentStatusesModel);
   
  }

  /**
   * 把设备统计信息放到部门树中
   * @param {*} rs : 部门数据
   * @param {*} departmentid 选择的部门ID
   * @param {*} shifttime 选择的班别， 默认是全天（08-08(第二天)）
   */
  async loadDeviceAndStatistic(departmentDeviceMap, departmentid, shifttime){
      if (!shifttime || !shifttime.start || !shifttime.end)return null;
      //找出所属总的设备
    let devices = await deviceService.findByCondition({department: {$regex: departmentid}}, {'name':1}, ['dev_id', 'name', 'department']);
    if (!devices || devices.length <= 0)return null;
    let shiftStime = shifttime.start;
    let shiftEtime = shifttime.end;
    let count = await dayStatisticService.countByCondition({time:{$gte :shiftStime,$lte:shiftEtime}});
    let dayStatistics = [],  _dayStatistics = null;
    if (count > 2000){//2000的取，暂时没有，后面取咯

    } else {
        _dayStatistics= await dayStatisticService.findByCondition({time:{$gte :shiftStime,$lte:shiftEtime}});
        if (_dayStatistics){
            dayStatistics = dayStatistics.concat(_dayStatistics);
        }
    }

    if (!_dayStatistics){//没有当天的设备统计数据
        return null;
    }
    let map = new Map(), tmpDayStatistic = null;
    _dayStatistics.forEach(dayStatistics0=>{
        map.set(dayStatistics0.dev_id, dayStatistics0);
    });
    devices.forEach(device=>{//根据设备分组
        if (departmentDeviceMap.has(device.department)){//把设备统计信息加进去部门。
            let departmentNode = departmentDeviceMap.get(device.department);
            let dayStatistic0 = departmentNode['dayStatistic'];
            if (!dayStatistic0){//未有设备统计信息
                dayStatistic0 = departmentNode.dayStatistic = [];
            }
            tmpDayStatistic = map.get(''+device.dev_id);
            tmpDayStatistic.name = device.name;
            dayStatistic0.push(tmpDayStatistic);
        }
    });
  }

  async exportExcel(rs, departmentid, time){
      
    if (!rs || rs.length <= 0)
        return 0;
       
     let map = new Map();
     let parentMap = new Map();
     //把部门转为树结构。
     rs.forEach(deprtment => {
        map.set(deprtment.value, deprtment);
        if (deprtment.parent_id){
            if (parentMap.has(deprtment.parent_id)){
                parentMap.get(deprtment.parent_id).push(deprtment);
            } else {
                parentMap.set(deprtment.parent_id, [deprtment]);
            }
        }
     });
     //根据部门去加载设备统计
     await this.loadDeviceAndStatistic(map, departmentid, time);
     let shiftDefine = await shiftService.getShiftDefineTime();
     let root = map.get(departmentid);
     this.createTree(root, parentMap, map);
     let result = this.exportExcel0(root, shiftDefine);
    //  fs.writeFile('./resut.xlsx', result, function (err) {
    //     if (err)
    //         throw err;
    //     console.log('Write to xls has finished');
    
    //     // 读xlsx
    //     var obj = xlsx.parse("./" + "resut.xlsx");
    //     console.log(JSON.stringify(obj));
    // });
     return result
     //console.log(JSON.stringify(root));

  }

  createTree(parent, parentMap, map){
    let childs = parentMap.get(parent.value);//查找到儿子
    if (childs){
        parent.childs = childs;
        childs.forEach(item=>{//查找儿子
            this.createTree(item, parentMap, map);
        });
    }    
  }

  exportEmpty(){
    let datas = [];
    datas.push({name: '没有查询到数据', data: [title]});
    let result =  xlsx.build(datas);
    return result;
  }

  exportExcel0(root, shiftDefine){
    let datas = [];
    //let data = this.genData(root.data, 0, root.label);
    //datas.push({name: root.label, data: [title, data]});
    
    this.exportSheet(root, datas, shiftDefine);
    let result =  xlsx.build(datas);
    datas = null;
    //data = null;
    return result;
  }
  //datas:  存放着excel的sheet
  exportSheet(parent, datas, shiftDefine){
    let childs = parent.childs;
    if (!childs){
        if (parent.dayStatistic){
            this.justExportDevice(parent, datas, shiftDefine);
        }
        return;
    }
    let data = null;
    let shifts = shiftDefine.data;
    shifts.forEach(shift=>{//每个班虽，一个sheet
        data = [];//工厂里，把所有部门都放在一个sheet里
        data.push(title);
//导出选中的部门
        data.push(this.exportDepartmentByShift(parent.data.children, 0, parent.label, shift.id));
//如果有设备，可以在这里：  this.exportDevice(item, data, 2, shift.id);//导出设备
        childs.forEach(item=>{
           
        data.push(this.exportDepartmentByShift(item.data.children, 1, item.label, shift.id));//第二个行
           this.exportDevice(item, data, 3, shift.id);//导出设备
            if (item.childs && item.childs.length > 0){
                this.exportChild(item, data, 2, shift.id);//导出下一级，下一级只需要2个blank
            }
        });
        datas.push({name: shift.name, data: data});

    });

  }
//仅仅导出设备
  justExportDevice(parent, datas, shiftDefine){
    let shifts = shiftDefine.data;
    let data = null;
    shifts.forEach(shift=>{
        data = [];//工厂里，把所有部门都放在一个sheet里
        data.push(title);
        data.push(this.exportDepartmentByShift(parent.data.children, 0, parent.label, shift.id));
        this.exportDevice(parent, data, 1, shift.id);//导出设备
        datas.push({name: shift.name, data: data});
    });
  }


  //manyBlank:  多少个空格
  //shiftId:  班别ID
  exportChild(parent, data, manyBlank, shiftId){
    let childs = parent.childs;//子节点
    if (!childs)return;
    let _manyBlank = manyBlank;
    childs.forEach(item=>{
        data.push(this.exportDepartmentByShift(item.data.children, _manyBlank, item.label, shiftId));
       //把班别的数据也导进
       //this.exportShift(item, data, manyBlank+1);
       this.exportDevice(item, data, (manyBlank+1), shiftId);
        if (item.childs && item.childs.length > 0){
           // data.push(this.genData(item, manyBlank));
            this.exportChild(item, data, (manyBlank+1), shiftId);
        }
    });
    //return data;
  }

  //根据班别导出
  exportDepartmentByShift(tmpData, manyBlank, label, shiftid){
    for (let index = 0; index < tmpData.length; index++) {
        const element = tmpData[index];
        if (element.id != shiftid){
            continue;
        }
        return this.genData(element, manyBlank, label);
    }
  }

  /**
   * 
   * @param {*} department//班别统计数据
   *   "name" : "白班",
                "wt" : 0.0,
                "rt" : 0.0,
                "efficiency" : 0.0,
                "count" : 0,
                "alarm_count" : 0, 
    @param data:  excel中行对象
    @param manyBlank  多少个空格
   */
  exportShift(department, data, manyBlank){
    let shifts = department.data.children;//班别
    if (shifts && shifts.length > 0){
        let s = this.genBlank(manyBlank);
        shifts.forEach(shiftStatistic=>{
            let wt = shiftStatistic.wt;
            wt = wt? (wt/3600).toFixed(2):0;
            let rt = shiftStatistic.rt;
            rt = rt? (rt/3600).toFixed(2):0;
            let alarm_duration = shiftStatistic.alarm_duration;
            alarm_duration = alarm_duration? (alarm_duration/3600).toFixed(2):0;
            data.push([s+shiftStatistic.name, wt, rt, shiftStatistic.efficiency, shiftStatistic.alarm_count, alarm_duration, shiftStatistic.count, shiftStatistic.invalid_count]);
        });
        // if (array){
        //     data = data.concat(array);
        // }
    }
    //return data;
  }

  /**
   * 导出设备每天的数据
   * @param {*} dayStatistic 
   * @param {*} data 
   * @param {*} manyBlank 
   */
  exportDevice(department, data, manyBlank, shiftId){
      let dayStatistic = department.dayStatistic;
      if (!dayStatistic || dayStatistic.length <= 0)return;
      let tmpData = null;
      dayStatistic.forEach(shiftStatistic=>{
        tmpData = shiftStatistic.data.children;
        for (let index = 0; index < tmpData.length; index++) {
            const element = tmpData[index];
            if (element.id != shiftId){
                continue;
            }
            data.push(this.genData(element, manyBlank, shiftStatistic.name));
        }
    });
  }

  genBlank(manyBlank){
    return CommonUtil.genBlank(manyBlank);
  }

  genData(record, manyBlank, name){
      //departmentData.wt  ? ((departmentData.wt) / 3600).toFixed(2)  : 0
    let label = name?name:record.label;
    let wt = record.wt;
    wt = wt? (wt/3600).toFixed(2):0;
    let rt = record.rt;
    rt = rt? (rt/3600).toFixed(2):0;
    let efficiency = record.efficiency;
    let alarm_count = record.alarm_count;
    let alarm_duration = record.alarm_duration;
    alarm_duration = alarm_duration? (alarm_duration/3600).toFixed(2):0;

    let invalid_count = record.invalid_count;
    let count = record.count;
    let s = this.genBlank(manyBlank);
    return [s + label, wt, rt, efficiency, alarm_count, alarm_duration, count, invalid_count];//''这里为异常产量， 正常产量，等中间件定义
  }
  /*
  Joshua _a 
  获取某日某班某部门及子部门统计数据
  */
    async getStaticsByShift(department, date, shift){
        let shiftTime = null;
        let sTime = 0, eTime = 0;
        let list = [];
        let result = [];
        
        try {
            shiftTime = await shiftService.resetStartAndEnd(date);  //获取当天
            if (shiftTime){
                sTime = shiftTime.start;
                eTime = shiftTime.end;
            }
            list = await this.findByCondition({
                "value": {$regex:department},
                "time": {$gte: parseInt(sTime),$lte:parseInt(eTime)},
                "type" : "department_shift"
              }); 
        } catch (error) {
            LogUtil.debug(error);
            return result;
        }

        if(list.length > 0){
            list.forEach(val=>{
                let dVal = {};
                let child = val.data.children;
                
                for(let i=0; i<child.length; i++){

                    if(child[i].id == shift){
                        dVal = child[i];
                        dVal.department = val.value;
                        dVal.children = null;   //不需要详情
                        dVal.valid_count = dVal.count - dVal.invalid_count;
    
                        result.push(dVal);
                        break;
                    }
                }
            });
        }

        return result;
    }
}



module.exports = new DepartmentStatusesService();
