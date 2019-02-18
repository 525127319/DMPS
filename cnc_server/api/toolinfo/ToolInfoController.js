const toolInfoService = require('./ToolInfoService');
const RSUtil = require('../../utils/RSUtil');
const LogUtil = require('../../utils/LogUtil');
let TimeUtil = require('../../utils/TimeUtil');
let FSUtil = require("../../utils/FSUtil");
let xlsx = require('node-xlsx');

class ToolInfoController {

  //导入基本资料共用方法
  async importBasicExcel(ctx) {
    let params = ctx.request.fields.file[0].path;
    try {
      let obj = xlsx.parse(params);
      let entitys =obj[0].data;
      let keys="product process knife_no knife_name knife_size rm_no shank_type collet_type blade_length deviation lifetime producer producer_code process_position dao_way remark".split(' ');
      let condition =[];
      for(var i=0; i<entitys.length; i++){
        let objs ={}
        for(let j=0;j<entitys[i].length;j++){
          if(entitys[i][j] == Number){
             objs[keys[j]]=JSON.stringify( entitys[i][j]);
          }else if(entitys[i][j] == 'default'){
            objs[keys[j]]='';
          }else{
             objs[keys[j]]= entitys[i][j]
          }
         
        }
        condition.push(objs);
      }
      let cons =condition.shift();
      let resInfo = await toolInfoService.createMany(condition);
      await toolInfoService.init();
      ctx.body = RSUtil.ok(resInfo);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }

  getAllTools(ctx){
      let list = toolInfoService.getAllToolDefine();
      ctx.body = RSUtil.ok(list);
  }
}

module.exports= new ToolInfoController();
