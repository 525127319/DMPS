const router=require('koa-router')();
const BlockController=require('./BlockController.js');
/*
获取某日某班单block的工作详情
URL参数：
departmentid - block的ID
date - 日期
shiftID - 班别
// pageIndex - 页码
// pageSize - 每页个数
// detail - 是否需要详情 0 - 不用，1 - 需要
http://127.0.0.1:3000/api/block/getBlockWorkStaticByShift/root_2018081411941458_2018081412340056_2018081412636566_20181017154620436_7302/2018-11-20/20180824001/1/0/0
*/
router.get("/block/getBlockWorkStaticByShift/:departmentid/:date/:shiftID", BlockController.getBlockWorkStaticByShift); 
/*
获取个时间段单block的工作详情
URL参数：
departmentid - block的ID
start - 开始时间 YYYY-MM-DD HH:mm:ss
end - 结束时间 YYYY-MM-DD HH:mm:ss
// pageIndex - 页码
// pageSize - 每页个数
// detail - 是否需要详情 0 - 不用，1 - 需要
http://127.0.0.1:3000/api/block/getBlockWorkStaticByTime/root_2018081411941458_2018081412340056_2018081412636566_20181017154620436_7302/2018-11-21 11:00:00/2018-11-21 13:00:00/1/0/0
*/
router.get("/block/getBlockWorkStaticByTime/:departmentid/:start/:end", BlockController.getBlockWorkStaticByTime); 
/*
获取某日某班block的工作汇总
URL参数：
departmentid - 部门树的组织ID
date - 日期
shiftID - 班别
pageIndex - 页码
pageSize - 每页个数
// detail - 是否需要详情 0 - 不用，1 - 需要
http://127.0.0.1:3000/api/block/getBlockWorkStaticByShift/root_2018081411941458_2018081412340056_2018081412636566_20181017154620436_7302/2018-11-20/20180824001/1/0/0
*/
router.get("/block/getBlockWorkSummaryByShift/:departmentid/:date/:shiftID/:pageIndex/:pageSize", BlockController.getBlockWorkSummaryByShift); //获取某时间段block工作统计信息

 /*
导出某日某班block的工作汇总
URL参数：
departmentid - 部门树的组织ID
date - 日期
shiftID - 班别
 */
router.post("/block/exportBlockWorkSummaryByShift", BlockController.exportBlockWorkSummaryByShift); 

module.exports = router;
