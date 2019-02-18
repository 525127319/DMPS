const realtimedataService = require("./RealtimedataService");
const shiftDefineService = require("../shift/ShiftService");
let moment = require('moment');
let RSUtil = require('../../utils/RSUtil');
let TimeUtil = require('../../utils/TimeUtil');

class RealtimedataController {

  async getCurDayStatusByDevId(ctx) {
    let params = ctx.params;
    let devid = params.devid;
    let curstartTime = TimeUtil.getDayStartUnixTime();
    try {
      let rs = await realtimedataService.findByCondition({
        'dev_id': devid,
        'time': {
          $gte: parseInt(curstartTime)
        },
        'type': 'status'
      });
      //, {time:  1 }
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }

  // 实时状态
  async getDayStatusByDevId(ctx) {
    
    let params = ctx.params;
    let devid = params.devid;
    let curstartTime = TimeUtil.getDayStartUnixTimeShift();

    let data = await shiftDefineService.getShiftDefineTime();

    try {

      let rs = await realtimedataService.findByCondition({
        'dev_id': devid,
        'type': 'status',
        'data.end_time': {$gte: parseInt(data.sTime)},
        'data.start_time': {$lt:parseInt(data.eTime)},
      });
      //, {time:  1 }
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }
     // 实时状态和分页
     async getStatusByData(ctx) {
      let pageIndex = ctx.params.pageIndex;
      let devid = ctx.params.devid;
      let curstartTime = TimeUtil.getDayStartUnixTime();
      let resInfo = await realtimedataService.pageByCondition({
        "dev_id": devid,
        'type': 'status',
        'data.end_time': {
          $gte: parseInt(curstartTime)
        },
      },pageIndex,null,{'data.end_time':-1});
      try {
        ctx.body = RSUtil.ok(resInfo);
      } catch (error) {
        LogUtil.logError(ctx, error);
      }
      
    }

  async getStatusByDevIdArrayAndDay(ctx) {
    let params = ctx.params;
    let devids = params.devids;
    let day = params.day;

    devids = devids.split(',');

    let startTime = TimeUtil.toLong(day);
    let endTime = TimeUtil.addDay(day, 1);
    try {
      let rs = await realtimedataService.findInCondition({
        'dev_id': {
          $in: devids
        }
      }, {
        'time': {
          $gte: startTime,
          $lt: endTime
        },
        'type': 'status'
      });
      //, {time:  1 }
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }

//  历史状态接口(单个请求旧版)
async getDayStatusByDevIdAndDay(ctx) {
  let params = ctx.params;
  let devid = params.devid;
  let day = params.day;
  
  let startTime = TimeUtil.toLong(day);
  let endTime = TimeUtil.addDay(day, 1);

  

  try {
    let rs = await realtimedataService.findByCondition({
      'dev_id': devid,
      'data.end_time': {$gte: parseInt(startTime)},
      'data.start_time': {$lt:parseInt(endTime)},
      'type': 'status'
  });
  //, {time:  1 }
    ctx.body = RSUtil.ok(rs);
  } catch (error) {
    ctx.body = RSUtil.fail(error);
  }
}

// // 历史状态接口（新版本，合成一次请求）
// async getDayStatusByDevIdsAndDay(ctx){

//   let params = ctx.request.fields;
//   let devices = params.devices; // 设备ID数组

//   let startTime = TimeUtil.toLong(ctx.request.fields.time);
//   let endTime = TimeUtil.addDay(ctx.request.fields.time, 1);

//   try {
//     let rs = await realtimedataService.findByCondition({
//       dev_id:{$in:devices},
//       'data.end_time': {$gte: parseInt(startTime)},
//       'data.start_time': {$lt:parseInt(endTime)},
//       'type': 'status'
//     },null,{_id:0,type:0}
//   )

//     // 对返回数据做处理
//     // if(rs){
//     //   rs = JSON.stringify(FilterArray.filterArray(devices,rs))
//     // }

//     ctx.body = RSUtil.ok({rs})
//   } catch (error) {
//     ctx.body = RSUtil.fail(error);
//   }

// }


// 历史状态接口（新版本，合成一次请求）
async getDayStatusByDevIdsAndDay(ctx){

  let data = await shiftDefineService.getShiftDefineTime();

  let params = ctx.request.fields;
  let devices = params.devices; // 设备ID数组

  let startTime = TimeUtil.toLongShift(ctx.request.fields.time);
  let endTime = TimeUtil.addDayShift(ctx.request.fields.time, 1);

  let curTime = parseInt(TimeUtil.geCurUnixTime()); // 当前时间点，返回当前时间戳
  if(curTime> parseInt(startTime) && curTime<parseInt(endTime)){ 
    startTime = data.sTime;
    endTime = data.eTime;
  }

  try {
    let rs = await realtimedataService.findByCondition({
      dev_id:{$in:devices},
      'data.end_time': {$gte: parseInt(startTime)},
      'data.start_time': {$lt:parseInt(endTime)},
      'type': 'status'
    },null,{_id:0,type:0}
  )

    // 对返回数据做处理
    // if(rs){
    //   rs = JSON.stringify(FilterArray.filterArray(devices,rs))
    // }

    ctx.body = RSUtil.ok({rs})
  } catch (error) {
    ctx.body = RSUtil.fail(error);
  }

}

}

module.exports = new RealtimedataController();
