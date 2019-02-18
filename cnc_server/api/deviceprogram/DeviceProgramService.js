const BasicService = require("../../services/BasicService");
const deviceProgramModel = require("../../models/DeviceProgramRecord");
const IListener = require("../../ipc/IListener");
const logUtil = require("../../utils/LogUtil");

class deviceProgramService extends BasicService {
  constructor() {
    super(deviceProgramModel);
    this.register(["uploadFile"]);
  }
  readData(device) {
    logUtil.debug(device);
    if (device.data) {
      this.toRender(device);
    } else {
      device.forEach(element => {
        let createDeviceListener = new IListener("uploadFile", {
          devID: element.dev_id.toString(),
          recordID: element._id /*字符串*/,
          srcPath: element.fileUrl /*字符串，待上传程序*/,
          dstPath: "" /*字符串，写入的目标位置*/
        });
        this.toMid(createDeviceListener);
      });
    }
  }
}
module.exports = new deviceProgramService();
