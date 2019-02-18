let departmentService = require("../../api/department/DepartmentService");
let deviceService = require("../../api/device/DeviceService");

var fs = require('fs');

let map = new Map();

let set = new Set();
let mm = new Map();

class UpdateDepartment{

    import(){
        let obj = {};
        let filename = __dirname+'/flash-block.csv';
        let content = fs.readFileSync(filename);
        content = String(content);
        content = content.split('\r\n');
        content.forEach(async (row)=>{

            let colls = row.split(',');
             let key = colls[1] + '#-' + colls[3] + '#-' + colls[5]
            if (!set.has(key)){
                set.add(key);
            }
            if (mm.has(key)){
                mm.get(key).push(colls[2]);
            } else {
                mm.set(key, [colls[2]]);
            }
        });
        // set.forEach(key=>{
        //     console.log('key',  key);
        // });
        console.log('set.length', set.size);
    }


    async update(){
        let key = 'root_2018081411941458_2018081412340056';//'M8-2F_FlashDH';
        let department = await departmentService.findAll();
        let p = departmentService.getDepartmentByDepartmentId(department[0].data, key);
        let _map = new Map();
        departmentService.resetMap(p, _map);
        console.log(_map.size);
        let tmp = new Map();//根据夹位分组
        _map.forEach((value, key)=>{
            if (value.label.indexOf('CNC') == 0){//根据夹位分组
                tmp.set(value, new Map());
                return;
            }
        });

        this.import();

        _map.forEach((value, key)=>{
            tmp.forEach((_v, _k)=>{
                if (value.value == _k.value)return;
                if (value.value.indexOf(_k.value) == 0){//把cell放到相对应的夹位上
                    _v.set(value.label, value);
                }
            });
        });


        set.forEach(key=>{
            let colls = key.split('#-');//[0]-夹位， [1]-cell name, [2]-block
            let devices = mm.get(key);
            tmp.forEach((cells, _k)=>{
                if (_k.label  != colls[0])//夹位下的所有cell
                    return;
                cells.forEach(cell=>{
                    if (cell.label != 'CELL'+colls[1])
                        return;
                   // cell = cell.get('CELL'+colls[1]);
                    let children = cell.children;
                    if (children.length <= 0){
                        children.push({
                            "label" : colls[2],
                            "parent_id" : cell.value,
                            "value" : cell.value+'_'+this.rand(1000, 9999),
                            "children" : []
                        });
                    } else {
                        let flag = false, _block;
                        children.forEach(item => {
                            if (item.label == colls[2]){//已经存在block
                                flag = true;
                                _block = item;
                            }
                        });
                        if (!flag){
                            children.push({
                                "label" : colls[2],
                                "parent_id" : cell.value,
                                "value" : cell.value+'_'+this.rand(1000, 9999),
                                "children" : []
                            });
                        } else {
                            devices.forEach(async device=>{
                                let d = await deviceService.findByCondition({'name': device.trim()});
                                console.log(d);
                                if (d && d.length > 0)
                                d[0].department = _block.value;
                                deviceService.update(d[0]);
                            });
                        }
                    }


                });

               
            });
           
           // this.fn(_map, key);;
        });
       // console.log(tmp.size);
        try {
            await departmentService.update(department[0]);
        } catch (error) {
            console.error(error);
        }

    }

    rand(min,max) {
        return Math.floor(Math.random()*(max-min))+min;
    }

    fn(_map, label){
        _map.forEach(value, key =>{
            if (value.label == label){
                console.log(label);
            }
        });
    }

}

new UpdateDepartment().update();