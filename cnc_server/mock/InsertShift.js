const BasicService = require('../services/BasicService');
const ShiftModle = require('..//models/ShiftModle');

let fs = require('fs');
var readline = require('readline');  

class InsertService extends BasicService{
    constructor() {
        super(ShiftModle);
    }

    mock(){
        let fRead = fs.createReadStream('/Users/ray/Documents/workplace/cnc/ks-200/shift_data.json');  
        var objReadline = readline.createInterface({
            input: fRead
        });

        objReadline.on('line', line=>{
            console.log(line);
            let _a = JSON.parse(line);
            // let _a = JSON.parse('\''+line+'\'');
             delete _a['_id']
            super.create(_a);

            //insertMonitor.mock(_a);
        });

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