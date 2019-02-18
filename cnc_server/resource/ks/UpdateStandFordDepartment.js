var fs = require('fs');

let deviceService = require("../../api/device/DeviceService");
let DeviceModel = require('../../models/DeviceModel');
let TimeUtil = require('../../utils/TimeUtil');
let map = new Map();
map.set('CNC7', {'2': 'root_20180814121930913_2018081412731493_2018081412751807_20181017154620206'});
map.set('CNC8', {'2': 'root_20180814121930913_2018081412731493_2018081412747456_20181017154619957'});

class UpdateStandFordDepartment{
    async import(){
        let content = null;
        try {
            let filename = __dirname+'/device/StandFord.csv';
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

new UpdateStandFordDepartment().import();