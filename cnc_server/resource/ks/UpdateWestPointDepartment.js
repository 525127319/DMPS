var fs = require('fs');

let deviceService = require("../../api/device/DeviceService");
let DeviceModel = require('../../models/DeviceModel');
let TimeUtil = require('../../utils/TimeUtil');
let map = new Map();
map.set('CNC3', {'16': 'root_20180814121930913_20180814122052414_20180814122109966_20181017154619717'});
map.set('CNC4', {'3': 'root_20180814121930913_20180814122052414_20180814122105031_20181017154619477'});

class UpdateWestPointDepartment{
    async import(){
        let content = null;
        try {
            let filename = __dirname+'/device/WestPoint.csv';
            content = fs.readFileSync(filename);
            content = String(content);
            content = content.split('\r\n');
            
            let i = 0;
            content.forEach( async (row)=>{
                let colls = row.split(',');

                let device = await deviceService.findOne({'conn.ip': colls[4]});
                console.log(++i);
                 //根据制程
                 let cell =  map.get(colls[0]);
                 //根据cell
                 cell = cell[colls[2]];
                 //更新device中的部门  department
                 device.department = cell;
                 device.name = colls[1];
                 await deviceService.update(device);
     
            });
        } catch (error) {
            console.log('ssss');
        }
    }
}

new UpdateWestPointDepartment().import();