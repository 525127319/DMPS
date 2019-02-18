const deviceQuarterStatisticService = require('./DeviceQuarterStatisticService');
const DeviceService=require('../device/DeviceService');
const DeviceStatisticUtil = require('../../utils/DeviceStatisticUtil');
let RSUtil = require('../../utils/RSUtil');
const LogUtil = require('../../utils/LogUtil');
const moment = require('moment');
let TimeUtil = require('../../utils/TimeUtil');


class DeviceQuarterStatisticController {

    //根据设备Id查询季度统计数据
    async getQuarterStatisticData(ctx){
        let params = ctx.request.fields;
        let date = params.time;
        let shift = params.shift;//班别ID
        let deparment=params.department;
        let pageIndex=params.current;
        let index =date.indexOf('-')
        let year =date.slice(0,index);
        let quarter =date.slice(index+1,date.length);
        let total =null;
        try {
            let  condition = {"department": eval("/^" + deparment + "/")}
            let rs = await DeviceService.pageByCondition(condition, pageIndex,10,{'dev_id':1});
            let devIdArr =rs.rs;
            let device = devIdArr.map(item =>{
                  return item.dev_id;
            });
          let quarterMess= await deviceQuarterStatisticService.findByCondition({dev_id:{$in:device},quarter_no:quarter,year_no:year}, {'dev_id':1})
          let quarterList= quarterMess.map(items =>{
                let _t = items.data;
                let dev_id =items.dev_id;
             return DeviceStatisticUtil.matchByShiftId(_t,shift,dev_id);
         })
         if(quarterList.length == 0){
              total =quarterList.length;
          }else{
              total =rs.total;
          }
         ctx.body=RSUtil.ok({'quarterList':quarterList,'total':total})
        } catch (error) {
          ctx.body=RSUtil.fail(error)
        }
    
      }

  
}

module.exports= new DeviceQuarterStatisticController();
