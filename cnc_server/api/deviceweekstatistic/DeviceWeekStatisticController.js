const DeviceWeekStatisticService = require("./DeviceWeekStatisticService");
const DeviceService = require('./../device/DeviceService');
let RSUtil = require('../../utils/RSUtil');
let TimeUtil = require('../../utils/TimeUtil');
let LogUtil = require('../../utils/LogUtil');
const DeviceStatisticUtil = require('../../utils/DeviceStatisticUtil');

class DeviceWeekStatistController {

  // 获取周的数据
  async weeklist(ctx) {
    let params = ctx.request.fields;
    let deparment = params.department; //部门
    let pageIndex = params.current;   //分页
    let shift = params.shift;
    let deparmentid = {"department": eval("/^" + deparment + "/")}
    let rs = await DeviceService.pageByCondition(deparmentid, pageIndex,10,{'dev_id':1});//部门+分页
    let devIdArr =rs.rs;
    let deviceid = devIdArr.map(item =>{  // 遍历出设备id
            return item.dev_id;
    });
    let condition = {
      week_no: params.week_no,
      year_no: params.year_no,
      dev_id: {$in: deviceid},
    };
    let total =null;
    //1. find the device by department and pageindex.

    //2. find the weekly statistic by the dev_id.

    //in    ($in: {dev_id: [dev_id1, 2,3....]}) week: 41

      let data = await DeviceWeekStatisticService.findByCondition(condition);
      let monthList= data.map(items =>{
        let _t = items.data;
        let dev_id =items.dev_id;
        return DeviceStatisticUtil.matchByShiftId(_t,shift,dev_id);
    })
    if(monthList.length ==0){
      total =monthList.length;
    }else{
        total =rs.total;
    }
    ctx.body = RSUtil.ok({'monthList':monthList,'total':total});


  }
}






module.exports = new DeviceWeekStatistController();
