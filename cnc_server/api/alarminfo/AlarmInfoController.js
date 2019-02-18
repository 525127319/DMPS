const alarmInfoService = require('./AlarmInfoService');
const deviceService = require('../device/DeviceService')
const RSUtil = require('../../utils/RSUtil');
const LogUtil = require('../../utils/LogUtil');
let TimeUtil = require('../../utils/TimeUtil');
const shiftDefineService = require("../shift/ShiftService");
let FSUtil = require("../../utils/FSUtil");
let xlsx = require('node-xlsx');

class AlarmInfoController {

  async upLoadFile(ctx) {
    let params = ctx.request.fields.file[0].path;
    try {
      let obj = xlsx.parse(params);
      let entitys =obj[0].data[1];
      let resInfo = await alarmInfoService.createMany(entitys);
      ctx.body = RSUtil.ok(resInfo);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }

  async updateOrCreate(ctx) { //处理报警
    let params = ctx.request.fields;
    let rs = await alarmInfoService.updateOrCreate({"_id":params._id},params);
    ctx.body = RSUtil.ok(rs);
  }

  //历史报警列表
  async getHistoryAlarms(ctx) {
    let pageIndex = ctx.params.pageIndex;
    let devid = ctx.params.devid;
    let resInfo =await alarmInfoService.pageByCondition({"dev_id": devid},pageIndex,null,{time:-1});
    try {
      ctx.body = RSUtil.ok(resInfo);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }

  }

  async allAlarmCode(ctx){//获取报警码
    let params = ctx.params;
    let rs = await alarmInfoService.findAll(params);
    ctx.body = RSUtil.ok(rs);
  }

  async searchNotDeal(ctx){ //搜索未处理的报警
    let params=ctx.request.fields;
    let ctype = ctx.request.fields.ctype;
    let data = await shiftDefineService.getShiftDefineTime();
    let startTime = TimeUtil.addDayShift(params.startTime,0,data.begin_time);
    let endTime = TimeUtil.addDayShift(params.endTime, 1,data.end_time);
    let filt={
      dev_id:params.dev_id,
      time:{$gte: startTime,$lte: endTime },
    }
    let pageIndex=params.current;
    let alarmCode=params.alarmCode;
    let rs, count = 0;
    if(ctype){
      count = await alarmInfoService.countByCondition({'time':filt.time,'status':0,dev_id:{$in:params.dev_id}});
      if(count > 10000){
        ctx.body = RSUtil.ok({code:0,msg:'导出数据量太大，请过滤条件后重试'})
        return;
     }
      try {
        rs = await alarmInfoService.findByCondition({'time':filt.time,'status':0,dev_id:{$in:params.dev_id}});
      } catch (error) {
        LogUtil.logError(ctx, error);
      }
       let allDevice = await deviceService.getCacheDevice();
       if (rs && rs.length > 0){
        let result = await alarmInfoService.exportExcel(rs,allDevice);
        ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        ctx.set("Content-Disposition", "attachment; filename=" + "o2olog.xlsx");
        ctx.body = result; 
      } else {
        ctx.set("Content-Disposition", "attachment; filename=" + "o2olog.xlsx");
        ctx.body = departmentStatusesService.exportEmpty(); 
      }

    }else{ // 这段代码要重构!!!!!!!!!
      if(params.startTime){
        if(  filt.dev_id==0&&(!params.alarmCode||params.alarmCode=='全部')){//没有ID 没有code
              rs= await alarmInfoService.pageByCondition( { 'time':filt.time,'status':0,dev_id:{$in:params.dev_id}} ,pageIndex,null,{time:-1})
        }else if(filt.dev_id==0&&params.alarmCode&&params.alarmCode!='全部'){//没有ID有code
              rs= await alarmInfoService.pageByCondition( {'time':filt.time,'data.alarm_code':alarmCode,'status':0,dev_id:{$in:params.dev_id}} ,pageIndex,null,{time:-1})
        }else if(filt.dev_id&&(!params.alarmCode||params.alarmCode=='全部')){//有ID没有code
              rs= await alarmInfoService.pageByCondition( {'time':filt.time,'dev_id':filt.dev_id,'status':0,dev_id:{$in:params.dev_id}} ,pageIndex,null,{time:-1})
        }else if(filt.dev_id&&params.alarmCode&&params.alarmCode!='全部'){//有ID有code
              rs= await alarmInfoService.pageByCondition( {'time':filt.time,'dev_id':filt.dev_id,'data.alarm_code':alarmCode,'status':0,dev_id:{$in:params.dev_id}} ,pageIndex,null,{time:-1})
        }
      }else if(!params.startTime){
        if(alarmCode.length==1){
          rs= await alarmInfoService.pageByCondition( {'status':0,'data.alarm_code':{$in:alarmCode},dev_id:{$in:params.dev_id}} ,pageIndex,null,{time:-1}); //没有时间只有一个报警码
        }else if(alarmCode.length>1){
          rs= await alarmInfoService.pageByCondition( {'status':0,'data.alarm_code':{$nin:alarmCode},dev_id:{$in:params.dev_id}} ,pageIndex,null,{time:-1});//没有时间有多个报警码
        }else{
          rs= await alarmInfoService.pageByCondition( {'status':0,dev_id:{$in:params.dev_id}} ,pageIndex,null,{time:-1}); //没有时间没有code
        }
      }
        ctx.body=RSUtil.ok(rs);
    }
    
  }

  async searchDeal(ctx){ //搜索处理过的报警
    let params=ctx.request.fields;
    let filt={
      dev_id:params.dev_id,
      time:{$gte : params.startTime,$lte:params.endTime },
    }
    let pageIndex=params.current;
    let alarmCode=params.alarmCode;

    let rs
    if(params.startTime){
      if(filt.dev_id==0&&(!params.alarmCode||params.alarmCode=='全部')){//没有ID 没有code 有时间
          rs= await alarmInfoService.pageByCondition( { 'fix_time':filt.time,'status':1} ,pageIndex,null,{fix_time:-1})
      }else if(filt.dev_id==0&&params.alarmCode&&params.alarmCode!='全部'){//没有ID有code
            rs= await alarmInfoService.pageByCondition( {'fix_time':filt.time,'data.alarm_code':eval("/^" + alarmCode + "/"),'status':1} ,pageIndex,null,{fix_time:-1})
      }else if(filt.dev_id&&(!params.alarmCode||params.alarmCode=='全部')){//有ID没有code
            rs= await alarmInfoService.pageByCondition( {'fix_time':filt.time,'dev_id':filt.dev_id,'status':1} ,pageIndex,null,{fix_time:-1})
      }else if(filt.dev_id&&params.alarmCode&&params.alarmCode!='全部'){//有ID有code
            rs= await alarmInfoService.pageByCondition( {'fix_time':filt.time,'dev_id':filt.dev_id,'data.alarm_code':eval("/^" + alarmCode + "/"),'status':1} ,pageIndex,null,{fix_time:-1})
      }
    }else{
          rs= await alarmInfoService.pageByCondition( { 'status':1} ,pageIndex,null,{fix_time :-1})
    }
      // console.log(rs , 'rs');
      ctx.body=RSUtil.ok(rs);

  }
  async groupByCode(ctx){
    let params = ctx.request.fields;
    let device = params.devices;
    let _time = params.day;
    let data = await shiftDefineService.getShiftDefineTime();
    let startTime = TimeUtil.addDayShift(_time,0,data.begin_time);
    let endTime = TimeUtil.addDayShift(_time, 1,data.end_time);
  
    let curTime = parseInt(TimeUtil.geCurUnixTime()); // 当前时间点，返回当前时间戳
    if(curTime> parseInt(startTime) && curTime<parseInt(endTime)){ 
      startTime = data.sTime;
      endTime = data.eTime;
    }
  
    // let Time = parseInt(TimeUtil.toLong(_time));
      try {
        let resInfo = await alarmInfoService.countByGroupField('$data.alarm_code', {'status': 0,dev_id:{$in:device},time:{$gte:parseInt(startTime),$lt:parseInt(endTime)}});
        ctx.body = RSUtil.ok(resInfo);
      } catch (error) {
        LogUtil.error('error for group alarm info:  '+error);
      }
  }

  async findAlarmInfo(ctx){
    let params = ctx.request.fields;
    let curstartTime = TimeUtil.getDayStartUnixTime();
    let data = await shiftDefineService.getShiftDefineTime();
    let startTime = TimeUtil.addDay(params.time,0);
    let endTime = TimeUtil.addDayShift(params.time, 1,data.end_time);
    // let rs = await alarmInfoService.findByCondition({'type':'alarm',"dev_id" : params.devid,'time':{$gte:params.startTime,$lte:params.endTime}});
    let rs = await alarmInfoService.findByCondition({
      'type':'alarm',
      "dev_id" : params.devid,
      'time':{$gte:parseInt(startTime),$lt:parseInt(endTime)}
    });
    ctx.body = RSUtil.ok(rs);
  }


}

module.exports= new AlarmInfoController();
