const deviceMonitorService = require('./DeviceMonitorService');
const deviceService = require('../device/DeviceService');
const dayStatisticService = require("./../daystatistic/DayStatisticService");
let RSUtil = require('../../utils/RSUtil');
let TimeUtil = require('../../utils/TimeUtil');
let LogUtil = require('../../utils/LogUtil');
let _array = [];

class DeviceMonitorController {
    async deviceload(ctx) {
        try {
            let params = ctx.request.fields;
            let curstartTime = TimeUtil.getDayStartUnixTime();
            let rs = await deviceMonitorService.findByCondition({ 'dev_id': params.devid, "time": { $gte: parseInt(curstartTime) } });
            ctx.body = RSUtil.ok(rs);
        } catch (error) {
            LogUtil.logError(ctx, error);
        }
    }
    deviceStatusByDepartment(ctx) {
        ctx.body = RSUtil.ok(_array);
    }
    async _deviceStatusByDepartment() {
        try {
            let devs = await deviceMonitorService.findAll();
            let rs = await instance.handleDeviceStatus(devs);
            let _m = null;
            if (rs && rs.size > 0){
                let array = [];
                rs.forEach((value, key)=>{
                    let o = {};
                    value.forEach((v,k)=>{
                        o[k] = v;
                    });
                    _m = {};
                    _m[key] = o;
                    array.push(_m);
                });
                rs = null;
                _array = array;

                deviceMonitorService.setDeviceMonitorCache(devs);
                deviceMonitorService.setDepartmentStaticsCache(array);
            } else {
            }
        } catch (error) {
            LogUtil.logErrorWithoutCxt(error);
        }
    }
    async handleDeviceStatus(values) {
        let monitorMap = new Map();
        values.forEach(element => {
            let curTimeStamp = TimeUtil.times();
            if(curTimeStamp - element.time > 180) {
                element.data.status = 8;
            }
            monitorMap.set(element.dev_id, element);
        });
        let monitorStatusMap = await instance.groupMonitorByDepartment(monitorMap);
        return monitorStatusMap;
    }

    /**
         * 把monitor的数据按照部门来分组， 如部门1： {status0: 3, statu2: 4...}
         */
    async groupMonitorByDepartment(monitorMap) {
        let departmentDeviceMap = new Map();
        let deviceinfoArray = await deviceService.getCacheDevice();
        let monitor = null, status = null, map = null, v = null;
        deviceinfoArray.forEach((value) => {
            monitor = monitorMap.get('' + value.dev_id);
            if(!monitor){ // 在device表里有这个ID的设备，但是device_monitor表里找不到这台设备的记录
              return;
            }
            status = '' + monitor.data.status;
            if (departmentDeviceMap.has(value.department)) {
                map = departmentDeviceMap.get(value.department);
                if (map.has(status)) {
                    v = map.get(status);
                    v++;
                } else {
                    v = 1;
                }
                map.set(status, v);
            } else {
               // console.log(value.department);
                map = new Map();
                map.set(status, 1);
                departmentDeviceMap.set(value.department, map);
            }

        });
        if (departmentDeviceMap.size > 0)
            return instance.countByDepartment(departmentDeviceMap);
        else
            return null;
    }

    /**
     * 处理父部门子部门的关系， 子部门+1， 那父部门也+1
     * 部门是： a_b_c来的上下级关系
     */
    countByDepartment(departmentDeviceMap) {
        let map = new Map(), keys = null, tmp, tmpV;
        departmentDeviceMap.forEach((value, key) => {//value is map{status: 2, status2: 4}
            keys = key.split('_');//key: 是父部门_子部门_子部门
            keys.forEach(k => {//k为部门代号
                if (map.has(k)) {
                    tmp = map.get(k);//tmp is a map.
                    value.forEach((v, status) => {
                        if (tmp.has(status)) {//判断此部门是否已有些状态了
                            tmpV = tmp.get(status);
                            tmp.set(status, tmpV + v);
                        } else {
                            tmp.set(status, v);
                        }
                    });
                } else {
                    let _map = new Map();
                    value.forEach((v, k) => {
                        _map.set(k, v);
                    });
                    map.set(k, _map);
                }
            });
        });
        return map;
  }
  async devicestatus(ctx) {
    let params = ctx.request.fields;
  
    try {
      let curstartTime = TimeUtil.getDayStartUnixTime();
      let rs; 
      if(params){
        rs = await deviceMonitorService.findByCondition({
          "time": {$gte: parseInt(curstartTime)},
          "dev_id":{$in:params.devices} 
        
        }, {'dev_id':1}, ['dev_id', 'data.status', 'data.alarm_code', 'data.alarm_msg','data.prog_name']);
      }else{
         rs = await deviceMonitorService.findByCondition({
          "time": {$gte: parseInt(curstartTime)},
        }, {'dev_id':1}, ['dev_id', 'data.status', 'data.alarm_code', 'data.alarm_msg','data.prog_name']);
      }
     

      ctx.body = RSUtil.ok(rs);
    } catch(error) {
        LogUtil.logError(ctx, error);
    }
  }

    // 获取刀具相关数据
    async getMonitorData(ctx) {
        let pageIndex = ctx.params.pageIndex;
        let devid = ctx.params.devid;
        let resInfo = await deviceMonitorService.pageByCondition({
            "dev_id": devid,
        }, pageIndex, null, { time: -1 });
        try {
            ctx.body = RSUtil.ok(resInfo);
        } catch (error) {
            LogUtil.logError(ctx, error);
        }

    }

    // // 获取部门下的设备，再拿到设备下实时状态（页面小卡片里面的数据）
    // async getDeviceData(ctx){
    //     let params = ctx.request.header;
    //     try {
    //         let deparment=params.department;
    //         let pageIndex=params.current;
    //         let status = params.status;//运行，空闲之类
    //         let pageSize = params.pageSize?params.pageSize:10;
    //         let curstartTime = TimeUtil.getDayStartUnixTime();
    //         let rs  = null;//await DeviceService.pageByCondition({"department":eval("/^" + deparment + "/") },pageIndex,50,{name : 1});
    //         let devices = [],statisticData=[];
    //         try {
    //             rs = deviceMonitorService.getDeviceByCondition(deparment, status, pageIndex, pageSize);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //         if(devices){
    //             statisticData = await dayStatisticService.findByCondition({"time": {$gte: parseInt(curstartTime)},"dev_id":{$in:devices}}, null, ['dev_id', 'data.wt', 'data.rt','data.efficiency','data.count']);
    //         }
    //         let dStatics = deviceMonitorService.getDepartmentStatics();
        
        
    //         ctx.body = RSUtil.ok({deviceData:rs, statisticData:statisticData, departmentStatics:dStatics});
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
}
let instance = new DeviceMonitorController();
setInterval(()=>{
    instance._deviceStatusByDepartment();
}, 5000);
instance._deviceStatusByDepartment();
module.exports = instance;
