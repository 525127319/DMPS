const singleDevProgCtService = require("./SingleDevProgCtService");
let moment = require('moment');
let RSUtil = require('../../utils/RSUtil');
let TimeUtil = require('../../utils/TimeUtil');
const shiftDefineService = require("../shift/ShiftService");

class SingleDevProgCtController {

     //历史程序列表
   async getHistoryProgram(ctx) {
    let pageIndex = ctx.params.pageIndex;
    let devid = ctx.params.devid;
    // let resInfo = await singleDevProgCtService.pageByCondition({"dev_id": devid},pageIndex, null, null, 'prog_name');
    try {
      let resInfo = await singleDevProgCtService.pageProgramById(devid, pageIndex, 10);
      ctx.body = RSUtil.ok(resInfo);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }

  //当天程序详情列表
  async getDayProgramDetail(ctx){
    let params=ctx.request.fields;
    let condition={};
    condition.prog_name = params.progName;

    let data = await shiftDefineService.getShiftDefineTime();
    let startTime = TimeUtil.addDayShift(params.time,0,data.begin_time);
    let endTime = TimeUtil.addDayShift(params.time, 1,data.end_time);
  
    let curTime = parseInt(TimeUtil.geCurUnixTime()); // 当前时间点，返回当前时间戳
    if(curTime> parseInt(startTime) && curTime<parseInt(endTime)){ 
      startTime = data.sTime;
      endTime = data.eTime;
    }
    // condition.time={$gte:parseInt(params.time),$lt:(parseInt(params.time)+86400)};
    condition.time={$gte:parseInt(startTime),$lt:parseInt(endTime)}; 
    condition['type'] = 'prog_ct';
    let pageIndex =params.pageIndex; 
    try {
      let resInfo = await singleDevProgCtService.pageByCondition(condition, pageIndex, 10);
     // let resInfo = await singleDevProgCtService.pageProgramByProName(progName, pageIndex, 10);
      // let end = TimeUtil.geCurUnixTime()*1000;
      ctx.body = RSUtil.ok(resInfo);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }

  //历史程序详情列表
  async getHyProDetail(ctx){
    let params=ctx.request.fields;
    let condition={}
    condition.dev_id= params.devID;
    condition.prog_name = params.programName;
    // let curstartTime = TimeUtil.getDayStartUnixTime();
    // condition.time={$gte: parseInt(curstartTime)};
    let pageIndex =params.pageIndex;
    try {
      let resInfo = await singleDevProgCtService.pageByCondition(condition,pageIndex,null,{time:-1});
      ctx.body = RSUtil.ok(resInfo);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    } 
  }

  async singlesum(ctx) {
    let condition={};
    let curstartTime = TimeUtil.getDayStartUnixTime();
    condition.time={$gte: parseInt(curstartTime)};
    try {
      let rs = await singleDevProgCtService.findByCondition(condition);
      ctx.body = RSUtil.ok(rs);
    } catch(error) {
        LogUtil.logError(ctx, error);
    }
  }
}

module.exports = new SingleDevProgCtController();
