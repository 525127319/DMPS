var fs = require('fs');

let deviceService = require("../../api/device/DeviceService");
let deviceStatusService = require('../../api/deviceStatus/DeviceStatusService');
let DeviceModel = require('../../models/DeviceModel');
let TimeUtil = require('../../utils/TimeUtil');
let map = new Map();
map.set('CNC5', {'3': 'root_2018081411941458_2018081412405606_2018081412503604_20181117124621570', '2': 'root_2018081411941458_2018081412405606_2018081412503604_20181011154621539'});
map.set('CNC4', {'3': 'root_2018081411941458_2018081412405606_2018081412511393_20181112124631570', '2': 'root_2018081411941458_2018081412405606_2018081412511393_20181111154621339'});

class UpdateBatmanDepartment{
    async import(){
        let content = null;
        try {
            let filename = __dirname+'/device/batmantc.csv';
            content = fs.readFileSync(filename);
            content = String(content);
            content = content.split('\r\n');
            

            content.forEach( async (row)=>{
                let colls = row.split(',');

                let device = await deviceService.findOne({'conn.ip': colls[4]});
                 //根据制程
                 let cell =  map.get(colls[0]);
                 //根据cell
                 cell = cell[colls[2]];
                 //更新device中的部门  department
                 device.department = cell;
                 device.name = colls[1];
                 await deviceService.update(device);
                 //let status = await deviceStatusService.findOne('dev_id': device.dev_id);
                 //status.

            });
        } catch (error) {
            console.log('ssss');
        }
    }
}

new UpdateBatmanDepartment().import();