let shiftService = require("./ShiftService");
let RSUtil = require("../../utils/RSUtil");
let TimeUtil = require('../../utils/TimeUtil');
const uuidV4 = require('uuid/v4');

class ShiftController {

  async findById(ctx) {
    let params = ctx.params;
    try {
      let param = {
        shift_id: params.id
      }
      let rs = await shiftService.findOne(param);
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }

  async findAll(ctx){
    try {
      let rs = await shiftService.findAll();
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }

  async addShift(ctx) {
    let params = ctx.request.fields;
    let id = uuidV4();
    let curTime = TimeUtil.geCurUnixTime();
    let query = {
      'name': params.name
    }
    try {
      let param = {
        'shift_id': id,
        'time': curTime,
        'name': params.name,
        // 'shift':[{'attrbute':params.shift,'start_time':params.shift_start_time,'end_time':params.shift_end_time},],
        // 'rest_time':[{'attrbute':params.rest_time,'start_time':params.rest_start_time,'end_time':params.rest_end_time}]
      }
      let resInfo = await shiftService.findByCondition(query);
      if(resInfo.length>0){
        ctx.body = RSUtil.fail("名称重复,请重新输入");
        return;
      } 
      let rs = await shiftService.create(param);
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }

  async add(ctx) {
    let params = ctx.request.fields;
    let condition;
    let con;
    try {
      if (params.id) {
        con = {
          'rest_time': {
            $elemMatch: {
              'attrbute': params.shift
            }
          }
        };
        condition = {
          $push: {
            'rest_time': {
              'attrbute': params.shift,
              'start_time': params.start_time,
              'end_time': params.end_time
            }
          }
        }
      } else {
        con = {
          'shift': {
            $elemMatch: {
              'attrbute': params.shift
            }
          }
        }
        condition = {
          $push: {
            'shift': {
              'attrbute': params.shift,
              'start_time': params.start_time,
              'end_time': params.end_time
            }
          }
        }
      }
      let query = {
        'shift_id': params.shift_id
      }
      let resInfo = await shiftService.findByCondition(con);
      if(resInfo.length>0){
        ctx.body = RSUtil.fail("名称重复,请重新输入");
        return;
      }
      let res = await shiftService.findByCondition(query);
      let queryShift = [];
      let queryRest = [];
      if (res && res.length > 0) {
        if (params.id) {
          res.forEach(ele => {
            ele.rest_time.forEach(item => {
              if (item.start_time < params.start_time && params.end_time < item.end_time) {
                queryRest.push(item);
              } else if (item.start_time > params.start_time && params.end_time < item.end_time) {
                queryRest.push(item);
              } else if (item.start_time < params.start_time && params.end_time > item.end_time) {
                queryShift.push(item);
              }
            })
          });
        } else {
          res.forEach(ele => {
            ele.shift.forEach(item => {
              if (item.start_time < params.start_time && params.end_time < item.end_time) {
                queryShift.push(item);
              } else if (item.start_time > params.start_time && params.end_time < item.end_time) {
                queryShift.push(item);
              } else if (item.start_time < params.start_time && params.end_time > item.end_time) {
                queryShift.push(item);
              }
            })
          });
        }
        // if (queryShift.length > 0) {
        //   ctx.body = RSUtil.fail("时间段重复,请重新输入");
        //   queryShift = [];
        //   return;
        // } 
        // else if (queryRest.length < 0) {
        //   ctx.body = RSUtil.fail("时间段重复,请重新输入");
        //   queryRest = [];
        //   return;
        // }
      }
      let rs = await shiftService.updateOrCreate(query, condition);
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }

  async list(ctx) {
    let params = ctx.params;
    let pageIndex = params.pageIndex;
    try {
      let rs = await shiftService.pageByCondition(null, pageIndex);
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }

  async updateName(ctx) {
    let params = ctx.request.fields;
    try {
      let rs = await shiftService.updateOrCreate({'_id':params._id},params);
         
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
      LogUtil.logError(ctx, error);
    }
  }

  async update(ctx) {
    let params = ctx.request.fields;
    let condition;
    let query;
    let con;
    try {
      if (params.id) {
        con = {
          'rest_time': {
            $elemMatch: {
              'attrbute': params.attrbute
            }
          }
        };
        query = {
          'shift_id': params.shift_id,
          'rest_time': {
            $elemMatch: {
              "attrbute": {
                $eq: params.attrbute
              }
            }
          }
        }
        condition = {
          'rest_time.$.start_time': params.start_time,
          'rest_time.$.end_time': params.end_time
        }
      } else {
        con = {
          'shift': {
            $elemMatch: {
              'attrbute': params.attrbute
            }
          }
        }
        query = {
          'shift_id': params.shift_id,
          'shift': {
            $elemMatch: {
              "attrbute": {
                $eq: params.attrbute
              }
            }
          }
        }
        condition = {
          'shift.$.start_time': params.start_time,
          'shift.$.end_time': params.end_time
        }
      }
      let qu = {
        'shift_id': params.shift_id
      }
      let resInfo = await shiftService.findByCondition(con);
      // if(resInfo.length>0){
      //   ctx.body = RSUtil.fail("名称重复,请重新输入");
      //   return;
      // }
      let res = await shiftService.findByCondition(qu);
      let queryShift = [];
      let queryRest = [];
      if (res && res.length > 0) {
        if (params.id) {
          res.forEach(ele => {
            ele.rest_time.forEach(item => {
              if (item.start_time < params.start_time && params.end_time < item.end_time) {
                queryRest.push(item);
              } else if (item.start_time > params.start_time && params.end_time < item.end_time) {
                queryRest.push(item);
              } else if (item.start_time < params.start_time && params.end_time > item.end_time) {
                queryShift.push(item);
              }
            })
          });
        } else {
          res.forEach(ele => {
            ele.shift.forEach(item => {
              if (item.start_time < params.start_time && params.end_time < item.end_time) {
                queryShift.push(item);
              } else if (item.start_time > params.start_time && params.end_time < item.end_time) {
                queryShift.push(item);
              } else if (item.start_time < params.start_time && params.end_time > item.end_time) {
                queryShift.push(item);
              }
            })
          });
        }
        //  if(queryShift.length>0){
        //     ctx.body = RSUtil.fail("时间段重复,请重新输入");
        //     queryShift=[];
        //     return;
        //  }else if(queryRest.length>0){
        //   ctx.body = RSUtil.fail("时间段重复,请重新输入");
        //   queryRest=[];
        //   return;
        //  }
      }
      let rs = await shiftService.updateOrCreate(query, condition);
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }

  async delete(ctx) {
    let params = ctx.request.fields;
    try {
      let condition;
      if (params.id) {
        condition = {
          $pull: {
            'rest_time': {
              "attrbute": {
                $eq: params.attrbute
              }
            }
          }
        }
      } else {
        condition = {
          $pull: {
            'shift': {
              "attrbute": {
                $eq: params.attrbute
              }
            }
          }
        }
      }
      let query = {
        'shift_id': params.shift_id
      }
      let rs = await shiftService.updateOrCreate(query, condition);
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }

  async deleteById(ctx) {
    let params = ctx.request.fields;
    let condition = {
      shift_id: params.shift_id
    }
    try {
      let rs = await shiftService.remove(condition);
      ctx.body = RSUtil.ok(rs);
    } catch (error) {
      ctx.body = RSUtil.fail(error);
    }
  }

  async getShiftDefineTime(ctx){
    try {
       
        ctx.body =   await shiftService.getShiftDefineTime();
    }catch(error){
        ctx.body = RSUtil.fail(error);
    }
  }


}
module.exports = new ShiftController();
