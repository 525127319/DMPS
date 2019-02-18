db.real_time_data.ensureIndex({"dev_id": 1, "status": 1, "data.start_time": 1, "data.end_time": 1}, {background: true})
db.device.ensureIndex({"department": 1}, {background: true})
db.alarm_info.ensureIndex({"time": 1, "status": 1, "dev_id":1}, {background: true})
db.un_use_data.ensureIndex({"time": 1, "dev_id":1}, {background: true})
db.cutters_life.ensureIndex({"department": 1}, {background: true})
db.cutters_life.ensureIndex({"department": 1}, {background: true})

##2018-12-03---Ray
db.engineer_statics.ensureIndex({"department":1, "alarmtype":1, "frunendtime":1}, {background: true});
db.op_statics.ensureIndex({"department":1, "frunendtime":1}, {background: true});


##20181111：
db.cutters_forecast.ensureIndex({"department": 1, 'genTime':1, 'type':1}, {background: true})



##固定集合：
db.runCommand({"convertToCapped":"device_payload_data", size:1000000000, max:10000000})


db.getCollection('device').find({}).skip(150).limit(200).forEach( function(obj) {
   // obj.dev_id= new NumberInt(obj.dev_id);
    obj.dev_id_s = String(obj.dev_id);
    db.getCollection('device').save(obj);
})


db.device_monitor.ensureIndex({"department": 1, "time": 1, 'data.status': 1}, {background: true})


##分片：
sh.enableSharding('Dms_cnc');
db.device_status_data.ensureIndex({dev_id:1});
sh.shardCollection('Dms_cnc.device_status_data', {dev_id:1});

db.un_use_data.ensureIndex({dev_id:1, time:1})
sh.shardCollection('Dms_cnc.un_use_data', {dev_id:1, time:1})

db.device_payload_data.ensureIndex({"dev_id": 1, "time": 1}, {background: true})
sh.shardCollection('Dms_cnc.device_payload_data', {dev_id:1, time:1})

db.alarm_info.ensureIndex({"time": 1, "dev_id":1}, {background: true})
sh.shardCollection('Dms_cnc.alarm_info', {dev_id:1, time:1})

