const deviceMonthStatisticService = require('./DeviceMonthStatisticService');
const DeviceService=require('../device/DeviceService');
let RSUtil = require('../../utils/RSUtil');
const DeviceStatisticUtil = require('../../utils/DeviceStatisticUtil');
const LogUtil = require('../../utils/LogUtil');
const moment = require('moment');
let TimeUtil = require('../../utils/TimeUtil');


class DeviceMonthStatisticController {


    //根据设备Id查询月统计数据
    async getMonthStatisticData(ctx){
        let params = ctx.request.fields;
        let date = params.time;
        let deparment=params.department;
        let pageIndex=params.current;
        let shift = params.shift;//班别ID
        let index =date.indexOf('-');
        let year =date.slice(0,index);
        let month =date.slice(index+1,date.length);
        let total =null;
        try {
          let  condition = {"department": eval("/^" + deparment + "/")}
          let rs = await DeviceService.pageByCondition(condition, pageIndex,10,{'dev_id':1});
          let devIdArr =rs.rs;
          let device = devIdArr.map(item =>{
                return item.dev_id;
          });
          let monthMess= await deviceMonthStatisticService.findByCondition({dev_id:{$in:device},month_no:month,year_no:year}, {'dev_id':1})
          let monthList= monthMess.map(items =>{
            let _t = items.data;
            let dev_id =items.dev_id;
            return DeviceStatisticUtil.matchByShiftId(_t,shift,dev_id);
        })
        if(monthList.length ==0){
            total =monthList.length;
        }else{
            total =rs.total;
        }
          ctx.body=RSUtil.ok({'monthList':monthList,'total':total})
        } catch (error) {
          ctx.body=RSUtil.fail(error);
        }
    
      }

  
}
 
module.exports=new DeviceMonthStatisticController();
