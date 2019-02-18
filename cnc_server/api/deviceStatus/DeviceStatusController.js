const deviceStatusService = require("./DeviceStatusService");
const shiftDefineService = require("../shift/ShiftService");
const dayStatisticService = require("./../daystatistic/DayStatisticService");
const DeviceMonitorService=require('./../devicemonitor/DeviceMonitorService')
let RSUtil = require('../../utils/RSUtil');
let TimeUtil = require('../../utils/TimeUtil');
class DeviceStatusController {
  // 实时状态(图表)
  async getDayStatusByDevId(ctx) {
    let params = ctx.params;
    let devid = params.devid;
    let curstartTime = TimeUtil.getDayStartUnixTime();
    let data = await shiftDefineService.getShiftDefineTime();
    let startTime = TimeUtil.addDayShift(params.time,0,data.begin_time);
    let endTime = TimeUtil.addDayShift(params.time, 1,data.end_time);
    let curTime = parseInt(TimeUtil.geCurUnixTime()); // 当前时间点，返回当前时间戳
    if(curTime> parseInt(curstartTime) && curTime<parseInt(endTime)){ 
      startTime = data.sTime;
      endTime = data.eTime;
     }
    try {
      let rs = await deviceStatusService.findByCondition({
        'dev_id': devid,
        'type': 'status',
        'data.end_time': {$gte:parseInt(startTime)},
        'data.start_time': {$lt:parseInt(endTime)},
      },null,{_id:0,type:0});
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
    try {
      let rs = await deviceStatusService.findByCondition({
        'dev_id': devid,
        'type': 'status',
        'data.end_time': {$gte:parseInt(startTime)},
        'data.start_time': {$lt:parseInt(endTime)},
      },null,{_id:0,type:0});
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }
     // 运行状态类型情况和分页
    async getStatusByData(ctx) {
      let params = ctx.params;
      let pageIndex = params.pageIndex;
      let devid = params.devid;
      let data = await shiftDefineService.getShiftDefineTime();
      let startTime = TimeUtil.addDayShift(params.time,0,data.begin_time);
      let endTime = TimeUtil.addDayShift(params.time, 1,data.end_time);
      let curTime = parseInt(TimeUtil.geCurUnixTime()); // 当前时间点，返回当前时间戳
      if(curTime> parseInt(startTime) && curTime<parseInt(endTime)){ 
        startTime = data.sTime;
        endTime = data.eTime;
      }
        let resInfo = await deviceStatusService.pageByCondition({
          "dev_id": devid,
          'type': 'status',
          'data.end_time': {$gte: parseInt(startTime)},
          'data.start_time': {$lt:parseInt(endTime)},
        },pageIndex,null,{'data.end_time':-1});
        try {
          ctx.body = RSUtil.ok(resInfo);
        } catch (error) {
          LogUtil.logError(ctx, error);
        }
      }

// 历史状态接口（新版本，合成一次请求）
async getDayStatusByDevIdsAndDay(ctx){
  let data = await shiftDefineService.getShiftDefineTime();
  let params = ctx.request.fields;
  let devices = params.devices; // 设备ID数组
  let curstartTime = TimeUtil.getDayStartUnixTime();
  let startTime = TimeUtil.addDayShift(params.time,0,data.begin_time);
  let endTime = TimeUtil.addDayShift(params.time, 1,data.end_time);
  let curTime = parseInt(TimeUtil.geCurUnixTime()); // 当前时间点，返回当前时间戳
  if(curTime> parseInt(curstartTime) && curTime<parseInt(endTime)){ 
    startTime = data.sTime;
    endTime = data.eTime;
    }
  try {
    let rs = await deviceStatusService.findByCondition({
      dev_id:{$in:devices},
      'data.end_time': {$gte: parseInt(startTime)},
      'data.start_time': {$lt:parseInt(endTime)},
      'type': 'status'
    },null,{_id:0,type:0}
  )
    ctx.body = RSUtil.ok({rs})
  } catch (error) {
    ctx.body = RSUtil.fail(error);
  }

}
//获取部门下的设备，再拿到设备下实时状态（页面小卡片里面的数据）
async getDeviceData(ctx){
  let params = ctx.request.fields;
  let deparment=params.department;
  let pageIndex=params.current;
  let status = params.status;//运行，空闲之类
  let pageSize = params.pageSize?params.pageSize:10;
  let curstartTime = TimeUtil.getDayStartUnixTime();
  let rs  = null;//await DeviceService.pageByCondition({"department":eval("/^" + deparment + "/") },pageIndex,50,{name : 1});
  let devices = [],statisticData=[],statusData=[];
  let ts = 0, te = 0;
   try {
       let condition = null;
       if (status){
           condition = {"department": eval("/^" + deparment + "/"), 'data.status': status} 
       } else {
           condition = {"department": eval("/^" + deparment + "/")}
       }
      // rs = await DeviceMonitorService.pageByCondition(condition, pageIndex, pageSize, {'dev_id':1});
      //dID, status, pageIndex, pageSize
      rs = DeviceMonitorService.getDeviceByCondition(deparment, status, pageIndex, pageSize); 
      for (let index = 0; index < rs.rs.length; index++) {
           const item = rs.rs[index];
           devices.push(item.dev_id);
       }
   } catch (error) {
       console.error(error);
       LogUtil.debug(error);
   }
    if(devices){
      ts = TimeUtil.timestamp();
      statisticData = await dayStatisticService.findByCondition({"time": {$gte: parseInt(curstartTime)},"dev_id":{$in:devices}}, null, ['dev_id', 'data.wt', 'data.rt','data.efficiency','data.count']);
      te = TimeUtil.timestamp();
      console.log("getDeviceData get dayStatisticService cost:", te - ts);
    }
    if (rs && rs.rs && rs.rs.length > 0){
       statusData = [];
       rs.rs.forEach(item=>{
           statusData.push(item);
       });
    }
    /**
     * 根据状态，根据部门的统计数据--应用在实时状态
     * AddDate: 2018-11-29
     * AddBy: Ray
     */
    let statusStatistic = DeviceMonitorService.getDepartmentStatics();
    ctx.body = RSUtil.ok({deviceData:rs,statisticData:statisticData,statusData:statusData, statusStatistic: statusStatistic});
 }

 
// // 获取部门下的设备，再拿到设备下实时状态（页面小卡片里面的数据）
// async getDeviceData(ctx){
//   let params = ctx.request.fields;
//   let deparment=params.department;
//   let pageIndex=params.current;
//   let status = params.status;//运行，空闲之类
//   let pageSize = params.pageSize?params.pageSize:10;
//   let curstartTime = TimeUtil.getDayStartUnixTime();
//   let rs  = null;//await DeviceService.pageByCondition({"department":eval("/^" + deparment + "/") },pageIndex,50,{name : 1});
//   let devices = [],statisticData=[];
//    try {
//       //  let condition = null;
//       //  if (status){
//       //      condition = {"department": eval("/^" + deparment + "/"), 'data.status': status} 
//       //  } else {
//       //      condition = {"department": eval("/^" + deparment + "/")}
//       //  }
//       //  rs = await DeviceMonitorService.pageByCondition(condition, pageIndex, pageSize, {'dev_id':1});
//       //  for (let index = 0; index < rs.rs.length; index++) {
//       //      const item = rs.rs[index];
//       //      devices.push(item.dev_id);
//       //  }

//      // rs = DeviceMonitorService.getDeviceByCondition(deparment, status, pageIndex, pageSize);
//    } catch (error) {
//        console.error(error);
//    }
//     if(devices){
//       statisticData = await dayStatisticService.findByCondition({"time": {$gte: parseInt(curstartTime)},"dev_id":{$in:devices}}, null, ['dev_id', 'data.wt', 'data.rt','data.efficiency','data.count']);
//     }
//     // if (rs && rs.rs && rs.rs.length > 0){
//     //    statusData = [];
//     //    rs.rs.forEach(item=>{
//     //        statusData.push(item);
//     //    });
//     // }

//     //let dStatics = DeviceMonitorService.getDepartmentStatics();


//     ctx.body = RSUtil.ok({deviceData:rs, statisticData:statisticData, departmentStatics:dStatics});
//  }
}
module.exports = new DeviceStatusController();
