import AxiosHttp from './AxiosHttp';
import DevicetypeUtils from "./DevicetypeUtil";
let deviceinfoMap = new Map();
let departmentDeviceMap = new Map();

class DeviceinfoUtil {
    cacheDeviceinfo() {
        return AxiosHttp
            .get('/device/devicesum')
            .then((res) => {
                return this.handledeviceinfo(res)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    handledeviceinfo(response) {
        let datas = [];
        let deviceinfoStore = localStorage.getItem('deviceinfo');
        if(response && response.value) {
            datas = response.value;
            this.handleData(datas);
            localStorage.setItem('deviceinfo', JSON.stringify(datas));
        } else if(deviceinfoStore) {
            datas = JSON.parse(deviceinfoStore);
            this.handleData(datas);
        }
        datas = null;
        return deviceinfoMap;
    }

    handleData(datas) {
        deviceinfoMap.clear();
        departmentDeviceMap.clear();
        datas.forEach((item) => {
            deviceinfoMap.set(item.dev_id, item);
            if(departmentDeviceMap.has(item.department)){
                departmentDeviceMap.get(item.department).push(item);
            } else {
                departmentDeviceMap.set(item.department, [item]);
            }
            
        })
    }

    handleLocalStroge() {
        this.handledeviceinfo();
    }

    getDeviceByDevid(dev_id) {
        let node = deviceinfoMap.get(parseInt(dev_id));
        if (!node) {
            let emptyNode = {
                dev_id: dev_id,
                dev_id_s: '',
                supplier_id: '',
                type: '',
                brand_name: '',
                model: '',
                time: 0,
                responsibility_by: '',
                name: '',
                location: '',
                department: '',
                conn: {
                    ip: '',
                    port: 0,
                },
                desc: ''
            };
            return emptyNode;
        }
        return node;
    }

    getNameByDevId(dev_id){
        let node = deviceinfoMap.get(parseInt(dev_id));
        if (!node) {
            return dev_id;
        }
        return node.name;
    }

    _getDevicesByDepartmentId(departmentId){
        if (departmentDeviceMap && departmentDeviceMap.size > 0){
            let array = [];
            departmentDeviceMap.forEach((value, key, map)=>{
                if (key.indexOf(departmentId)==0){
                    array = array.concat(departmentDeviceMap.get(key));
                }
            });
            return array;
        }
    }

    /**
     * 根据部门ID，返回步门下的设备
     * @param {*} departmentId 
     */
    getDevicesByDepartmentId(departmentId) {
       if (departmentDeviceMap && departmentDeviceMap.size > 0){
            let list = this._getDevicesByDepartmentId(departmentId);
            return Promise.resolve(list);
       } else {
           let fn = function(){
                let list = this._getDevicesByDepartmentId(departmentId);
                return list;
           }.bind(this);
           return this.cacheDeviceinfo().then(fn);
       }
    }
    
    getAllDevice() {
        if (deviceinfoMap.size <= 0) {
            return this.cacheDeviceinfo();
        } else {
            return Promise.resolve(deviceinfoMap);
        }

    }
}
let DeviceinfoUtils = new DeviceinfoUtil();
DeviceinfoUtils.cacheDeviceinfo();
DeviceinfoUtils.handleLocalStroge();
export default DeviceinfoUtils;