let deviceService = require("./DeviceService");
let flagSnService = require("../flagsn/FlagSnService");
let deviceProgramService = require("../deviceprogram/DeviceProgramService");
let deviceMonitorService = require("../devicemonitor/DeviceMonitorService");
let RSUtil = require("../../utils/RSUtil");
let TimeUtil = require("../../utils/TimeUtil");
let LogUtil = require("../../utils/LogUtil");

class DeviceController {
  async create(ctx) {
    let params = ctx.request.fields;
    let devname = { name: params.name.toUpperCase() };
    let devip = { "conn.ip": params.conn.ip };
    try {
      let findsamename = await deviceService.findByCondition(devname);
      let findsameip = await deviceService.findByCondition(devip);
      if (findsamename.length || findsameip.length) {
        if (findsamename.length >= 1 && findsameip.length >= 1) {
          ctx.body = RSUtil.fail("two");
        } else if (findsamename.length >= 1) {
          ctx.body = RSUtil.fail("name");
        } else if (findsameip.length >= 1) {
          ctx.body = RSUtil.fail("ip");
        }
      } else {
        params.time = TimeUtil.geCurUnixTime();
        // 创建设备
        let rs = await deviceService.create(params);
        // 默认为device_monitor表创建一条记录
        let devicemonitor = deviceService.getDeviceMonitor(params.dev_id);
        deviceMonitorService.create(devicemonitor);
        // 没有记录则创建，有则更新flagSn表
        flagSnService.updateOrCreate(
          { title: "记录SN" },
          { $set: { flagSn: params.dev_id } },
          { upsert: false }
        );
        ctx.body = RSUtil.ok(rs);
        // deviceService.monitorStatus([params]);
        // deviceService.createDevice(rs);
        deviceService.reloadDevice();
        deviceService.reloadAllDevice();
      }
    } catch (error) {
      LogUtil.logError(ctx, error);
    }
  }

  async update(ctx) {
    let params = ctx.request.fields;
    try {
      let findsamename = await deviceService.findByCondition({
        'name': params.name.toUpperCase(),
        'dev_id': {$ne: params.dev_id}
      });
      let findsameip = await deviceService.findByCondition({
        'conn.ip': params.conn.ip,
        'dev_id': {$ne: params.dev_id}
      });
      if (findsamename.length || findsameip.length) {
        if (findsamename.length >= 1 && findsameip.length >= 1) {
          ctx.body = RSUtil.fail("two");
        } else if (findsamename.length >= 1) {
          ctx.body = RSUtil.fail("name");
        } else if(findsameip.length >= 1) {
          ctx.body = RSUtil.fail("ip");
        }
      } else {
        let rs = await deviceService.updateOrCreate(
          { dev_id: { $eq: params.dev_id } },
          params
        );
        ctx.body = RSUtil.ok(rs);
        deviceService.reloadDevice();
        deviceService.reloadAllDevice();
      }
    } catch (error) {
        LogUtil.logError(ctx, error);
    }
  }

  async delete(ctx) {
    let params = ctx.params;
    let pageIndex = params.pageIndex;
    let id = params.id;
    let rs = await deviceService.removeById(id);
    rs = await deviceService.pageByCondition(null, pageIndex);
    ctx.body = RSUtil.ok(rs);
    let devid = ctx.request.fields;
    // deviceService.deleteDevice(devid);
    deviceService.reloadDevice();
    deviceService.reloadAllDevice();
  }

  async list(ctx) {
    let params = ctx.params;
    let pageIndex = params.pageIndex;
    // let rs = await deviceService.pageByCondition(null, pageIndex, null, {
    //   name: 1
    // });  注释
    let rs = await deviceService.pageByCondition(null, pageIndex, null);
    ctx.body = RSUtil.ok(rs);
  }
  
  async devicesum(ctx) {
    try {
      let rs = await deviceService.getCacheDevice();
      ctx.body = RSUtil.ok(rs);
    } catch(error) {
        LogUtil.logError(ctx, error);
    }
  }

  async devicesumPage (ctx) {
    let params = ctx.params;
    let pageIndex = params.pageIndex;
    try{
      let rs = await deviceService.pageByCondition(null,pageIndex,null);
      ctx.body = RSUtil.ok(rs);
    }catch(error){
        LogUtil.logError(ctx, error);
    }
  }

  async listInfo(ctx) {
    let params = ctx.request.fields;
    let pageIndex = params.logCurrent;
    let condition = {};
    let data = {};

    if (params.prog_name) {
      condition.prog_name = RegExp(`${params.prog_name}`);
    }
    if (params.department) {
      data.department = RegExp(params.department);
    }

    try {
      let rsdata = await deviceService.pageByCondition(data, pageIndex);
      let dada = await deviceProgramService.findAll();
      let ret = [];
      if (rsdata) {
        rsdata.rs.forEach(element => {
          dada.forEach(item => {
            if (element.dev_id == item.dev_id) {
              element.prog_name = item.programName;
              element.writeState = item.writeState;
            }
          });
          ret.push(element);
        });
        let objdata = {
          re: ret,
          total: rsdata.total
        };
        ctx.body = RSUtil.ok(objdata);
        ret = null;
      }
    } catch (error) {
      ctx.body = RSUtil.fail(objdata);
    }
  }
   // 根据部门获取部门下的设备
   async getDptData(ctx){
    let params = ctx.request.fields;
    let deparment=params.department;
    let rs  = await deviceService.findByCondition({"department":eval("/^" + deparment + "/") },{name : 1});
    ctx.body = RSUtil.ok(rs);
   }

  async search(ctx) {
    let params = ctx.request.fields;
    let pageIndex=ctx.request.fields.pageIndex;
    delete params.pageIndex;
    if (params.department) {
      params.department = RegExp(`^${params.department}`);
    }
    try {
      let rs = await deviceService.pageByCondition(params,pageIndex);
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }
  // 获取设备列表
  async getDevice(ctx){
    let params = ctx.request.fields;
    let deparment=params.department;
    let pageIndex=params.current;   
    let rs  = await deviceService.pageByCondition({"department":eval("/^" + deparment + "/") },pageIndex,null,{name : 1});
    ctx.body = RSUtil.ok(rs);
   }
}

module.exports = new DeviceController();
