var fs = require('fs');

let deviceService = require("../../api/device/DeviceService");
let DeviceModel = require('../../models/DeviceModel');
let TimeUtil = require('../../utils/TimeUtil');
let map = new Map();
map.set('CNC5', {'3': 'root_2018081411941458_2018081412405606_2018081412503604_20181117124621570', '2': 'root_2018081411941458_2018081412405606_2018081412503604_20181011154621539'});
map.set('CNC4', {'3': 'root_2018081411941458_2018081412405606_2018081412511393_20181112124631570', '2': 'root_2018081411941458_2018081412405606_2018081412511393_20181111154621339'});

class UpdateFlashDepartment{

    async export(){
        let rs = await deviceService.findAll({'department': { $regex: 'root_2018081411941458_2018081412340056'}});
        fs.writeFileSync(__dirname+'/device/flashcell', JSON.stringify(rs));
    }

    async import(){
        let content = null;
        try {
            let filename = __dirname+'/device/flashcell';//读取dev数据
            content = fs.readFileSync(filename);
            content = JSON.parse(content);            

            content.forEach( async (row)=>{

                let device = await deviceService.findOne({'dev_id': row.dev_id});//shift
                if (device){
                     //根据制程
                   // let cell =  map.get(colls[0]);
                    //根据cell
                   // cell = cell[colls[2]];
                    //更新device中的部门  department
                    device.department = row.department;
                    //device.name = colls[1];
                    await deviceService.update(device);
                    //let status = await deviceStatusService.findOne('dev_id': device.dev_id);
                    //status.

                }
                
            });
        } catch (error) {
            console.log('ssss');
        }
    }
}

new UpdateFlashDepartment().import();