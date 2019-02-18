const router=require('koa-router')();
const CellController=require('./CellController.js');
/*
获取某日某班单cell的工作详情
URL参数：
type - 报警类型  4：正常报警， 41：换刀报警， 42：首件报警
departmentid - 部门树ID
date - 日期
shiftID - 班别
// pageIndex - 页码
// pageSize - 每页个数
// detail - 是否需要详情 0 - 不用，1 - 需要
http://127.0.0.1:3000/api/cell/getWorkStaticByShift/4/root_2018081411941458_2018081412340056_2018081412636566_20181017154620436/2018-11-30/20180824001
*/
router.get("/cell/getWorkStaticByShift/:type/:departmentid/:date/:shiftID", CellController.getWorkStaticByShift); 
/*
获取个时间段单cell的工作详情
URL参数：
type - 报警类型  4：正常报警， 41：换刀报警， 42：首件报警
departmentid - block的ID
start - 开始时间 YYYY-MM-DD HH:mm:ss
end - 结束时间 YYYY-MM-DD HH:mm:ss
// pageIndex - 页码
// pageSize - 每页个数
// detail - 是否需要详情 0 - 不用，1 - 需要
http://127.0.0.1:3000/api/cell/getWorkStaticByTime/4/root_2018081411941458_2018081412340056_2018081412636566_20181017154620436/2018-11-30 08:00:00/2018-11-30 20:00:00
*/
router.get("/cell/getWorkStaticByTime/:type/:departmentid/:start/:end", CellController.getWorkStaticByTime); 
/*
获取某日某班cell的工作汇总
URL参数：
type - 报警类型  4：正常报警， 41：换刀报警， 42：首件报警
departmentid - 部门树的组织ID
date - 日期
shiftID - 班别
pageIndex - 页码
pageSize - 每页个数
// detail - 是否需要详情 0 - 不用，1 - 需要
http://127.0.0.1:3000/api/cell/getWorkSummaryByShift/4/root_2018081411941458_2018081412340056_2018081412636566_20181017154620436/2018-11-30/20180824001/0/0
*/
router.get("/cell/getWorkSummaryByShift/:type/:departmentid/:date/:shiftID/:pageIndex/:pageSize", CellController.getWorkSummaryByShift);
/*
获取个时间段cell的工作汇总
URL参数：
type - 报警类型  4：正常报警， 41：换刀报警， 42：首件报警
departmentid - 部门树的组织ID
start - 开始时间 YYYY-MM-DD HH:mm:ss
end - 结束时间 YYYY-MM-DD HH:mm:ss
pageIndex - 页码
pageSize - 每页个数
// detail - 是否需要详情 0 - 不用，1 - 需要
http://127.0.0.1:3000/api/cell/getWorkSummaryByTime/4/root_2018081411941458_2018081412340056_2018081412636566_20181017154620436/2018-11-30 08:00:00/2018-11-30 20:00:00/0/0
*/
router.get("/cell/getWorkSummaryByTime/:type/:departmentid/:start/:end/:pageIndex/:pageSize", CellController.getWorkSummaryByTime);

 /*
导出某日某班cell的工作汇总
URL参数：
type - 报警类型  4：正常报警， 41：换刀报警， 42：首件报警
departmentid - 部门树的组织ID
date - 日期
shiftID - 班别
 */
router.post("/cell/exportWorkSummaryByShift", CellController.exportWorkSummaryByShift); 

module.exports = router;
