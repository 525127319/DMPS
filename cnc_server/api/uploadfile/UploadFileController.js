let FSUtil = require("../../utils/FSUtil");
let RSUtil = require("../../utils/RSUtil");

class UploadFileController {
  async upLoadFile(ctx) {
    let params = ctx.request.fields.file;
    try {
      let rs = await FSUtil.copyUploadFile(params);
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }
}
module.exports = new UploadFileController();
