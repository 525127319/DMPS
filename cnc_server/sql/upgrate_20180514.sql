/* 索引 */
db.device_status_data.ensureIndex({"dev_id": 1, "time": 1, "type": 1}, {background: true})
db.device_status_data.ensureIndex({"dev_id": 1, "status": 1, "data.start_time": 1, "data.end_time": 1}, {background: true})
db.single_dev_prog_ct.ensureIndex({"dev_id": 1, "time": 1, "type": 1, "prog_name": 1}, {background: true})
db.single_dev_prog_ct.ensureIndex({"dev_id": 1, "prog_name": 1}, {background: true})
db.day_statistic.ensureIndex({"dev_id": 1, "time": 1}, {background: true})
db.all_dev_prog_ct.ensureIndex({"type": 1, "time": 1}, {background: true})
db.department_statuses.ensureIndex({"time": 1, "parent_id": 1, "value":1}, {background: true})
db.department_statuses.ensureIndex({"time": 1, "type": 1, "value":1}, {background: true})
db.device_monitor.ensureIndex({"dev_id": 1, "time": 1}, {background: true})
db.device_monitor.ensureIndex({"department": 1, "time": 1}, {background: true})
db.device_payload_data.ensureIndex({"dev_id": 1, "type":1, "time": 1}, {background: true})

/* 表导入导出 */
/* 导出： mongoexport -h IP –port 端口 -u 用户名 -p 密码 -d 数据库 -c 表名 -f 字段 -q 条件导出 –csv -o 文件名
 * 在mongodb的bin目录下执行
 */
mongoexport -h 10.131.212.67 -p 27017 -d Dms_cnc_shift -c device -o ./device.json
mongoexport -h 10.131.212.67 -p 27017 -d Dms_cnc_shift -c department -o ./department.json
mongoexport -h 10.131.212.67 -p 27017 -d Dms_cnc_shift -c tool_info  -o ./tool_info.json

mongoexport -h 10.131.212.67 -p 27017 -d Dms_cnc_dev -c device -o ./device.json
mongoexport -h 10.131.212.67 -p 27017 -d Dms_cnc_dev -c department -o ./department.json
mongoexport -h 10.131.212.67 -p 27017 -d Dms_cnc_dev -c tool_info  -o ./tool_info.json


mongoexport -h 10.132.207.19 -p 27017 -d Dms_cnc_shift -c equipment_type_list -o ./equipment_type_list.json
mongoexport -h 10.132.207.19 -p 27017 -d Dms_cnc_shift -c shift_data -o ./shift_data.json




mongoimport -h 10.131.212.67 -p 27017 -d Dms_cnc_shift -c shift_data --type=json --file shift_data.json
mongoimport -h 10.131.212.67 -p 27017 -d Dms_cnc_shift -c department --type=json --file department.json
mongoimport -h 10.131.212.67 -p 27017 -d Dms_cnc_shift -c device  --type=json --file device.json
mongoimport -h 10.131.212.67 -p 27017 -d Dms_cnc_shift -c tool_info  --type=json --file tool_info.json



mongoimport -h 10.131.212.67 -p 27017 -d Dms_cnc_dev -c shift_data -o ./shift_data.json


mongoimport -h 10.131.212.67 -p 27017 -d Dms_cnc_dev -c department --type=json --file department.json
mongoimport -h 10.131.212.67 -p 27017 -d Dms_cnc_dev -c shift_data --type=json --file ./shift_data.json


/*导库*/
mongodump -h 10.131.212.67 -d Dms_cnc_shift -o ./Dms_cnc_dev
mongodump -h 10.131.212.67 -d Dms_cnc_newstatus -o ./Dms_cnc_newstatus.sql
mongodump -h 10.131.212.67 -d Dms_cnc_shift --excludeCollection=device_payload_data --excludeCollection=un_use_data --excludeCollection=device_output_data -o ./Dms_cnc_dev

mongorestore -d Dms_cnc_dev --dir /mnt/db/Dms_cnc_dev
/* 导入
 * 去掉_id，数组形式,
 * dev_id需转为为整型："dev_id":NumberInt(20188)
 */
db.getCollection('department').insertMany([])


/**
* 把dev_id转为整型
*/
db.getCollection('device').find({}).skip(150).limit(200).forEach( function(obj) {
    obj.dev_id= new NumberInt(obj.dev_id);
    db.getCollection('device').save(obj);
})

