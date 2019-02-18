const BaseService = require('../../services/BasicService');
const alarmInfoModel= require('../../models/AlarmInfoModel');
let TimeUtils = require('../../utils/TimeUtil')
let xlsx = require('node-xlsx');
let title = ['设备名称', '设备类型', '责任人', '报警时间', '报警码', '报警程序','报警描述'];
class AlarmInfoService extends BaseService{
    constructor (){
      super(alarmInfoModel);
    }
    // 导出异常表
    async exportExcel(rs,allDevice){
      if (!rs || rs.length <= 0)
      return 0;
      let datas = [];
      this.exportSheet(rs,datas,allDevice);
      let result =  xlsx.build(datas);
      datas = null;
      return result;
    }
    exportSheet(rs,datas,allDevice){
      rs.sort((a,b) =>{
        return b.time-a.time;
      })
      let data = [];
      data.push(title);// 第一行表头
      rs.forEach(v=>{
          data.push(this.ItemData(v,allDevice))
      });
      datas.push({name:'异常报警信息',data:data})
    }
    ItemData(v,allDevice){
      let deviceItem =  allDevice.find(item=>{
        return v.dev_id == item.dev_id
      })
      let deviceName = deviceItem.name;
      let alarmTime = TimeUtils.formatDateByFormat(v.time* 1000,TimeUtils.format4);
      let alarmCode = v.data.alarm_code;
      let progName = v.data.prog_name; 
      let alarmMsg = v.data.alarm_msg;
      return [deviceName,'CNC','admin',alarmTime,alarmCode,progName,alarmMsg]
    }

    exportEmpty(){
      let datas = [];
      datas.push({name: '没有查询到数据', data: [title]});
      let result =  xlsx.build(datas);
      return result;
    }

}

module.exports = new AlarmInfoService();
