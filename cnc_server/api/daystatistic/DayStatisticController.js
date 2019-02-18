const dayStatisticService = require("./DayStatisticService");
let RSUtil = require('../../utils/RSUtil');
let TimeUtil = require('../../utils/TimeUtil');
let LogUtil = require('../../utils/LogUtil');
const shiftDefineService = require("../shift/ShiftService");

class DayStatisticController {

  async getDayEfficiency(ctx) {
    let params = ctx.params;
    let devid = params.devid;
    let curstartTime = TimeUtil.getDayStartUnixTime();
    try {
      let rs = await dayStatisticService.findByCondition({
        "dev_id": devid,
        "time": {$gte: parseInt(curstartTime)}
      });
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
      LogUtil.logError(ctx, error);
    }
  }

  // 班别稼动率
  async getShiftEfficiency(ctx) {
    let params = ctx.params;
    let devid = params.devid;
    let data = await shiftDefineService.getShiftDefineTime();

    let startTime = TimeUtil.addDayShift(params.time,0,data.begin_time);
    let endTime = TimeUtil.addDayShift(params.time, 1,data.end_time);

  let curTime = parseInt(TimeUtil.geCurUnixTime()); // 当前时间点，返回当前时间戳
    if(curTime> parseInt(startTime) && curTime<parseInt(endTime)){ 
      startTime = data.sTime;
      endTime = data.eTime;
     }

    try {
      let rs = await dayStatisticService.findByCondition({
        "dev_id": devid,
        "type":"shift_efficiency",
        "time": {$gte: parseInt(startTime),$lt: parseInt(endTime)},
      });
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
        LogUtil.logError(ctx, error);
    }
  }

  async curtime(ctx) {
    let params = ctx.request.fields;
    let rs;
    try {
      let curstartTime = TimeUtil.getDayStartUnixTime();
      if(params){
          rs= await dayStatisticService.findByCondition({"time": {$gte: parseInt(curstartTime)},"dev_id":{$in:params.devices}}, null, ['dev_id', 'data.wt', 'data.rt','data.efficiency','data.count']);

      }else{
         rs = await dayStatisticService.findByCondition({"time": {$gte: parseInt(curstartTime)}}, null, ['dev_id', 'data.wt', 'data.rt','data.efficiency','data.count']);

      }
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
        LogUtil.logError(ctx, error);
    }
  }

   //日产量列表
   async getDayProduct(ctx) {
    let pageIndex = ctx.params.pageIndex;
    let devid = ctx.params.devid;
    let resInfo = await dayStatisticService.pageByCondition({
      "dev_id": devid,
    },pageIndex,null,{time:-1});
    try {
      ctx.body = RSUtil.ok(resInfo);
    } catch (error) {
        LogUtil.logError(ctx, error);
    }
    
  }

   //日产量详情列表
   async getDayProductDetail(ctx) {
    let deid = ctx.params.deid;
    try {
        let resInfo = await dayStatisticService.findById({
        "_id": deid,
        });
   
      ctx.body = RSUtil.ok(resInfo);
    } catch (error) {
        LogUtil.logError(ctx, error);
        ctx.body = RSUtil.fail('查询失败');
    } 
  }

  // 单设备班别日产量详情列表
  async getSingletDayProductDetail(ctx) {
    let devid = ctx.params.devid;
    let time = ctx.params.time;
    let a = await shiftDefineService.updateDate2ShiftDate(parseInt(time));
    try {
        time = TimeUtil.format(time, 'YYYY-MM-DD HH:mm:ss');
        //time = TimeUtil.formatDateByFormat( );
        let shiftDefine = await shiftDefineService.resetStartAndEnd(a);
        let resInfo = await dayStatisticService.findByCondition({
          "dev_id": devid,
          "type":"shift_efficiency",
          time:{$gte: shiftDefine.start, $lte: shiftDefine.end}
        });
      ctx.body = RSUtil.ok(resInfo);
    } catch (error) {
        LogUtil.logError(ctx, error);
    } 
  }
}

module.exports = new DayStatisticController();

