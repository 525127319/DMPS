const BasicService = require('../../services/BasicService');
const deviceModel = require('../../models/DeviceModel');
const IListener = require("../../ipc/IListener");
const logUtil = require('../../utils/LogUtil');
const TimeUtil = require('../../utils/TimeUtil');

let cncMap = new Map();
let deviceMap = new Map();
let _devIDS = [];
let reMonitor = false;

 

class DeviceService extends BasicService {
  constructor() {
    super(deviceModel);
    this.register([
      'unregisterStatus',
      'registerStatus',
      'statusData',
      'createDevice',
      'deleteDevice',
      'reloadDevice',
      // 'optimizeExchangeTool',
      // 'delayExchangeTime',
    ]);

 
  }

  monitorStatus(devices) {
    devices.forEach((cnc) => {
      _devIDS.push(cnc.dev_id);
      if (!cncMap.has(cnc.dev_id)) {
        cncMap.set((cnc.dev_id), cnc);
        reMonitor = true;
      }
    });
    if (reMonitor) {
      this.init(_devIDS);
    }
  }

  createDevice(device) {
    logUtil.debug(device);
    if (device.data) {
      // this.toRender(device);
    } else {
      let createDeviceListener = new IListener(
        "createDevice",
        {
          "devID": (device.dev_id).toString(),
          "devName": device.name,
          "ip": device.conn.ip,
          "port": device.conn.port
        }
      );
      this.toMid(createDeviceListener);
    }
  }


  deleteDevice(device) {
    logUtil.debug(device);
    if (device.data) {
      // this.toRender(device);
    } else {
      let deleteDeviceListener = new IListener(
        "deleteDevice",
        {
          "devID": (device.devid).toString()
        }
      );
      this.toMid(deleteDeviceListener);
    }
  }

  reloadDevice(data) {
    if (!data) {
      let reloadDeviceListener = new IListener(
        "reloadDevice",
        {}
      );
      this.toMid(reloadDeviceListener);
    } else if (data && data.errCode === 0) {
      // this.toRender(data);
    }
  }

  init(_devIDS) {
    // 取消监听状态
    let unregisterStatusListener = new IListener(
      "unregisterStatus",
      {
        "devIDArray": _devIDS
      }
    );
    this.toMid(unregisterStatusListener);

    // 请求监听状态
    let registerStatusListener = new IListener(
      "registerStatus",
      {
        "devIDArray": _devIDS
      }
    );
    this.toMid(registerStatusListener);
  }

  /**
   * 请求监听状态
   */
  registerStatus(datas) {
    const arr = Object.keys(datas.data);
    if (arr.length !== 0) {
      this.toRender(datas);
    }
  }

  statusData(datas) {
    this.toRender(datas);
    logUtil.debug(datas);
  }

  /**
   * 取消监听状态
   */
  unregisterStatus(datas) {
    const arr = Object.keys(datas.data);
    if (arr.length !== 0) {
      this.toRender(datas);
    }
  }
  getDeviceMonitor(devid) {
    return {
      dev_id: (devid).toString(),
      time: TimeUtil.geCurUnixTime(),
      type: "real_status",
      start_time: TimeUtil.geCurUnixTime(),
      data: {
        wt: 0,
        rt: 0,
        status: 8,
        payload: 0.00,
        prog_name: "",
        alarm_code: "",
        alarm_msg: "",
        cutters: [
          {
            no: 1,
            spent: 0
          },
          {
            no: 2,
            spent: 0
          },
          {
            no: 3,
            spent: 0
          },
          {
            no: 4,
            spent: 0
          },
          {
            no: 5,
            spent: 0
          },
          {
            no: 6,
            spent: 0
          },
          {
            no: 7,
            spent: 0
          },
          {
            no: 8,
            spent: 0
          },
          {
            no: 9,
            spent: 0
          },
          {
            no: 10,
            spent: 0
          },
          {
            no: 11,
            spent: 0
          },
          {
            no: 12,
            spent: 0
          },
          {
            no: 13,
            spent: 0
          },
          {
            no: 14,
            spent: 0
          },
          {
            no: 15,
            spent: 0
          },
          {
            no: 16,
            spent: 0
          },
          {
            no: 17,
            spent: 0
          },
          {
            no: 18,
            spent: 0
          },
          {
            no: 19,
            spent: 0
          },
          {
            no: 20,
            spent: 0
          },
          {
            no: 21,
            spent: 0
          },

        ],
        count: 0,
        alarm_count: 0
      }
    };
  }

  async reloadAllDevice(){
    let rs = await super.findAll();
    this.devices = rs;
    if (rs){
        rs.forEach(device=>{
            deviceMap.set(''+device.dev_id, device);
        });
    }
    return rs;
  }

  getDeviceById(dev_id){
    return deviceMap.get(dev_id);
  }

  async getCacheDevice(){
      if (this.devices){
          return Promise.resolve(this.devices);
      } else{
          return await this.reloadAllDevice();
      }
  }

  async findByMonitorStatus(departmentId, pageIndex, pageSize, status){
    let condition = null;
    if (status){
        condition = [
            { $eq: ["$dev_id"/*从表*/,  "$$dev_id_s" , ] },
           { $eq: [ "$data.status",/*从表*/ status ] }
          ];
    } else {
        condition = [
            { $eq: ["$dev_id"/*从表*/,  "$$dev_id_s" , ] },
        ];
    }
    try {
      let rs = await this.model.aggregate([
          {
              $lookup: {
                 from: "device_monitor",
                 //localField: "dev_id",    // field in the monitor collection
                 //foreignField: "dev_id_s",  // field in the device collection
                 as: "items",
                 let: { 'dev_id_s': "$dev_id_s"},//主表
                 pipeline: [
                  { $match:
                     { $expr:
                        { $and:
                            condition
                        }
                     }
                  },

                 { $project: {  'data.status':1, 'dev_id':1, 'data.status':1, 'data.alarm_code':1, 'data.alarm_msg':1,'data.prog_name':1} }
               ],
              }
           },

           {
            $match: { "department": eval("/^" + departmentId + "/")  }
            },
           { $project: { conn : 0, supplier_id:0, type:0, brand_name:0, model:0, responsibility_by:0, location:0, department:0, desc:0, time:0, dev_id_s:0} }
      ]);
      
      if (rs){
          console.log(rs);
        let array = [];
        rs.forEach(element=>{
            if (!element.items || element.items.length <=0)return;
            array.push(element);
        });
        let total = array.length;
        let skip = pageSize * (pageIndex - 1);
        rs = array.slice(skip, skip + pageSize);
        rs = { total: total, rs: rs };
        array = null;
        return rs;
      } else {
        rs = null;
        return { total: 0, rs: []};
      }

     
} catch (error) {
  console.error(error);
}}


}

module.exports = new DeviceService();
