const dayStatisticService = require("./../daystatistic/DayStatisticService");
const AlarmInfoService = require('./../alarminfo/AlarmInfoService')
const DeviceStatisticUtil = require('../../utils/DeviceStatisticUtil');

const DeviceMonitorService=require('./../devicemonitor/DeviceMonitorService')
let shiftService = require("../shift/ShiftService");
const RSUtil = require('../../utils/RSUtil');
let TimeUtil = require('../../utils/TimeUtil');
class DepartmentStatisticsController{
 // 根据部门表格数据
  async getData(ctx){
    let params = ctx.request.fields;
    let deparment=params.department;
    let pageIndex=params.current;
    let status = params.status;//运行，空闲之类
    let pageSize = params.pageSize?params.pageSize:10;
    let startTime = TimeUtil.toLong(ctx.request.fields.time);
    let endTime = TimeUtil.addDay(ctx.request.fields.time, 1);
    let shift = ctx.request.fields.shift;
    let shiftStime = parseInt(startTime);
    let shiftEtime = parseInt(endTime);
    let rs  = null,devices=[],dayMess=[];//await DeviceService.pageByCondition({"department":eval("/^" + deparment + "/") },pageIndex,50,{name : 1});
     try {
         let condition = null;
         if (status){
             condition = {"department": eval("/^" + deparment + "/"), 'data.status': status} 
         } else {
             condition = {"department": eval("/^" + deparment + "/")}
         }
         rs = await DeviceMonitorService.pageByCondition(condition, pageIndex, pageSize, {'dev_id':1});
         for (let index = 0; index < rs.rs.length; index++) {
          const item = rs.rs[index];
          devices.push(item.dev_id);
         }
         let shifttime = await shiftService.resetStartAndEnd(ctx.request.fields.time);
         if (shifttime){
             shiftStime = parseInt(shifttime.start);
             shiftEtime = parseInt(shifttime.end);
         }
         if(devices){
         
            try {

                dayMess= await dayStatisticService.findByCondition({dev_id:{$in:devices},time:{$gte :shiftStime,$lte:shiftEtime}}, {'dev_id':1})
                let dayMessData= dayMess.map(items =>{
                    let _t = items.data;
                    let dev_id =items.dev_id;
                    return DeviceStatisticUtil.matchByShiftId(_t,shift,dev_id);
                })
             
                //   let dayAlarm = await AlarmInfoService.findByCondition({dev_id:{$in:devices},time:{$gte :shiftStime,$lte:shiftEtime}})
                //   let totalCount=await DeviceMonitorService.findByCondition({dev_id:{$in:devices},time:{$gte :startTime,$lte:endTime}})
                //   ctx.body=RSUtil.ok({'devicedata':rs,'dayMess':dayMess,'dayAlarm':dayAlarm,'totalCount':totalCount})

              ctx.body=RSUtil.ok({'devicedata':rs,'dayMess':dayMessData})
            } catch (error) {
              ctx.body=RSUtil.fail(error)
            }
         }
     } catch (error) {
         console.error(error);
     }
  }
}
module.exports = new DepartmentStatisticsController();
