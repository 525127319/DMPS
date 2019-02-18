let departmentService = require('./DepartmentService');
let RSUtil = require('../../utils/RSUtil');
let LogUtil = require('../../utils/LogUtil');
const moment = require('moment');
const _ = require('lodash');

class DepartmentController{

    //保存部门的树
    async updateAndCreate(ctx){
        let params = ctx.request.fields;
        if (_.isEmpty(params.type)){
            LogUtil.logError(ctx, 'the params.type can not be empty!');
            ctx.body = RSUtil.fail('the params.type can not be empty!');
            return;
        }
        let doc = await departmentService.findByCondition({'type': params.type});
        if (_.isEmpty(doc)){//当为空时时候，创建
            params.ts = moment().valueOf();
            let rs = await departmentService.create(params);
            let doc = await departmentService.findByCondition({'type': params.type});

            ctx.body = RSUtil.ok(doc[0].data);
        } else {//update
            let rs = await departmentService.updateOrCreate({'type': {$eq: params.type}}, params);
            let doc = await departmentService.findByCondition({'type': params.type});
            ctx.body = RSUtil.ok(doc[0].data);
        }
    }

    async get(ctx){
        let params = ctx.params;
        let type = params.type;
        let doc = await departmentService.findByCondition({'type': type});
        ctx.body = RSUtil.ok(doc[0].data);
    }

    async getAll(ctx){
        let doc = await departmentService.findAll();
        ctx.body = RSUtil.ok(doc);
    }

    //给凯胜定制的，可以由组织名称得到组织ID
    async getIDByDetail(ctx){
        let params = ctx.params;

        // let factory = params.factory;
        // let shop = params.shop;
        // let line = params.line;
        // let station = params.station;

        let ID = 'root_2018081411941458_2018081412340056_2018081412636566_20181017154620491_20181017154620491'
        ctx.body = RSUtil.ok(ID);
    }

}

module.exports = new DepartmentController();
