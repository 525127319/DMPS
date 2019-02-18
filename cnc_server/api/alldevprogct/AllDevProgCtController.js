const allDevProgCtService = require("./AllDevProgCtService");
const singleDevProgCtService = require("../singledevprogct/SingleDevProgCtService");
const shiftDefineService = require("../shift/ShiftService");

let moment = require('moment');
let RSUtil = require('../../utils/RSUtil');
let TimeUtil = require('../../utils/TimeUtil');

class AllDevProgCtController {

  //当天程序列表
  async getDayHistoryProgram(ctx){
    let params=ctx.request.fields;
    let pageIndex = params.pageIndex;
    let condition = {"department": eval("/^" + params.department + "/") };
   // condition.department = {};
    let data = await shiftDefineService.getShiftDefineTime();


    let startTime = TimeUtil.addDayShift(ctx.request.fields.day,0,data.begin_time);
    let endTime = TimeUtil.addDayShift(ctx.request.fields.day, 1,data.end_time);
  
    let curTime = parseInt(TimeUtil.geCurUnixTime()); // 当前时间点，返回当前时间戳
    if(curTime> parseInt(startTime) && curTime<parseInt(endTime)){ 
      startTime = data.sTime;
      endTime = data.eTime;
    }
  

    if (params.keyWords !=="" && params.day) {
      condition.prog_name = RegExp(`${params.keyWords}`);
      // condition.time={$gte:parseInt(params.day),$lt:(parseInt(params.day)+86400)};   
      // condition.time={$gte:parseInt(data.sTime),$lt:parseInt(data.eTime)};   
      condition.time={$gte:parseInt(startTime),$lt:parseInt(endTime)};      
    } else if( params.day && params.keyWords==""){
      // condition.time={$gte:parseInt(params.day),$lt:(parseInt(params.day)+86400)};
      // condition.time={$gte:parseInt(data.sTime),$lt:parseInt(data.eTime)};   
     condition.time={$gte:parseInt(startTime),$lt:parseInt(endTime)};   
    }else{
      condition.prog_name = RegExp(`${params.keyWords}`);
    }
    // condition['type'] = 'prog_ct';
    try {
      let resInfo = await allDevProgCtService.pageByCondition(condition,pageIndex,null,{"data.count":-1});
      if (resInfo && resInfo.rs.length > 0){
          let _promise = [];
        resInfo.rs.forEach((data)=>{
            let term ={};
            if(params.day==""){
                term.prog_name=data.prog_name
            }else{
              term.prog_name=data.prog_name
              // term.time ={$gte:parseInt(params.day),$lt:(parseInt(params.day)+86400)}
              term.time={$gte:parseInt(startTime),$lt:parseInt(endTime)};   
            }
            let _p = singleDevProgCtService.distinct('dev_id',term).then((list)=>{
                data.deviceCount = list.length;
                return data;
            });
            _promise.push(_p);
            // data.deviceCount = list.length;
        });
        let values = await Promise.all(_promise).then(((values)=>{
            return values;
        }));
        ctx.body = RSUtil.ok({ rs: values, total: resInfo.total });
      } else {
        ctx.body = RSUtil.ok(resInfo);
      }
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }
}

module.exports = new AllDevProgCtController();
