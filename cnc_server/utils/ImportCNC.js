var fs = require('fs');
let deviceService = require("../api/device/DeviceService");
let DeviceModel = require('../models/DeviceModel');
let TimeUtil = require('./TimeUtil');
class ImportCNC{
    async import(){
        let filename = './CNC_0920/cnc4.csv';
        let content = fs.readFileSync(filename);
        content = String(content);
        content = content.split('\r\n');
        let recored = await deviceService.findOne({type:'1'}, {dev_id: -1});
        console.log(recored);
        console.log(content.length);
        let ss = null, dev_id = recored.dev_id;
        let cnc3 =  "root_2018081411941458_2018081412340056_2018081412646616"
        let cnc4 = "root_2018081411941458_2018081412340056_2018081412636566"

        content.forEach(item=>{
            ss = item.split(',');
            dev_id++;
            this.createModel(cnc4, dev_id, ss[4], ss[0], ss[3]);
        });

       // var obj = xlsx.parse(filename);
       // console.log(JSON.stringify(obj));
    }

    createModel(department, dev_id, name, ip, port){
        let device = {};
        device.dev_id = dev_id;
        device.supplier_id = 89458;
        device.type = '1';
        device.brand_name = 'Fanuc';
        device.model = '0';
        device.responsibility_by = '1';
        device.name = name;
        device.location = 'root';
        device.department = department;
        device.desc = '';
        device.conn = {
            ip: ip,
            port: port
        },
        device.time = TimeUtil.getDayStartUnixTime();
        device.dev_id_s = ''+dev_id;
        deviceService.create(device);
    }

}

new ImportCNC().import();