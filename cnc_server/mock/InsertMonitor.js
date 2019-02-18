const BasicService = require('../services/BasicService');
const DeviceMonitorModel = require('..//models/DeviceMonitorModel');

class InsertMonitor extends BasicService{
    constructor(){
        super(DeviceMonitorModel);
    }

    mock(device){
        let model = {
            dev_id: device.dev_id,
            type: 'real_status',
            time: 1533830454,
            start_time: 1533830454,
            data:{
                wt: 2100,
                rt: 2100,
                status: 1,
                payload: 12,
                prog_name: '1',
                alarm_code: '2',
                alarm_msg: '3',
                cutters: [],
                count: 34,
                alarm_count: 10
            }
        };
        super.create(model);
    }
}

module.exports = new InsertMonitor();