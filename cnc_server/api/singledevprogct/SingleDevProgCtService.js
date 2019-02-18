const BasicService = require('../../services/BasicService');
const singleDevProgCtModel = require('../../models/SingleDevProgCtModel');
class SingleDevProgCtModel extends BasicService{
  constructor(){
    super(singleDevProgCtModel);
  }

  //由于base service里的分页，没有最大，最小的统计
  async pageProgramById(devId, pageIndex, pageSize){
    let skip = pageSize * (pageIndex - 1);
    let count = 0;
    try {
        count = await this.model.distinct('prog_name', {'dev_id' : devId});
        count = count.length;
        let rs = await this.model.aggregate([
            {$match: {'dev_id' : devId}},
            {$group : { 
                _id : '$prog_name',
                max_ct : {$max: '$data.max_ct'},
                min_ct : {$min: '$data.min_ct'},
                count : {$sum: '$data.count'}
                }
            },
            {$skip : skip},
            {$limit: pageSize}
        ]);
        // let rs = await this.model.aggregate().group({
        //     'key': { 'dev_id': 1, 'prog_name': 1 },
        //     'cond':{'dev_id': '10312'},
        //     '$reduce': function ( curr, result ) { 
        //         result.total += curr.data.count;
        //         result.count++;
        //         result.max_ct = result.max_ct? result.max_ct > curr.data.max_ct?result.max_ct:curr.data.max_ct:curr.data.max_ct;
        //         result.min_ct = result.min_ct? result.min_ct > curr.data.min_ct?curr.data.min_ct:result.min_ct:curr.data.min_ct;
        
        //         },
        //      'initial': {total: 0, count: 0 }
        //     });
        return { rs: rs, total: count };
      } catch (error) {
          throw error;
      }
      
  }

  async pageProgramByProName(progName, pageIndex, pageSize){
    let skip = pageSize * (pageIndex - 1);
    let count = 0;
    try {
        let list = await this.model.distinct('dev_id', {'prog_name' : progName});
        count = list.length;
        let rs = await this.model.aggregate([
            {$match: {'prog_name' : progName}},
            {$group : { 
                _id : '$dev_id',
                max_ct : {$max: '$data.max_ct'},
                min_ct : {$min: '$data.min_ct'},
                count : {$sum: '$data.count'}
                }
            },
            {$skip : skip},
            {$limit: pageSize}
        ]);
        return { rs: rs, total: count };
      } catch (error) {
          throw error;
      }
      
  }

}
module.exports = new SingleDevProgCtModel();
