const BasicService = require('../services/BasicService');
const deviceModel = require('..//models/DeviceModel');

const insertMonitor = require('./InsertMonitor');
let fs = require('fs');
var readline = require('readline');  

let original = {"dev_id":51001,"supplier_id":"89456","type":"1","brand_name":"FANUC","model":"0","responsibility_by":"1","name":"A999","location":"root_2018062530107167","department":"root_2018070220119910_2018070220246080_2018070220253958","desc":"","conn":{"ip":"192.168.29.199","port":8193},"time":1533571200};

class InsertService extends BasicService{
    constructor() {
        super(deviceModel);
    }

    mock(){
        // let fRead = fs.createReadStream('/Users/ray/Documents/workplace/cnc/ks-200/device.json');  
        // var objReadline = readline.createInterface({
        //     input: fRead
        // });

        // objReadline.on('line', line=>{
           // console.log(line);
            let _a = original;
             delete _a['_id']
            super.create(_a);

            //insertMonitor.mock(_a);
       // });

        // objReadline.on('close', ()=>{  
        //     let id = 20000;
        //     for (let index = 0; index < 3000; index++) {
        //         let target = Object.assign({}, original);
        //         target.dev_id = 20000+index;
        //         target.name = 'B'+target.dev_id;
        //         super.create(target);
        //         insertMonitor.mock(target);
        //     }
        // });  
    }

}


let service = new InsertService();
service.mock();