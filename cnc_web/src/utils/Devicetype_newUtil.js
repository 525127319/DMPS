let  Device_newMap = new Map();
class DeviceUtil{
    list() {
        let _l = [];
        let _s0 = { value: '0', label: "a_31i" };
        Device_newMap.set(_s0.value, _s0);
        _l.push(_s0);
        let _s1 = { value: '1', label: "M70" };
        Device_newMap.set(_s1.value, _s1);
        _l.push(_s1);
        // let _s2 = { value: '2', label: "水表" };
        // _l.push(_s2);
        // peopleMap.set(_s2.value, _s2);
        return Promise.resolve(_l);
    }

    getDeviceModelById(id){
        let node = Device_newMap.get(id);
        if (!node) {
            return id;
        }
        return node.label;
    }
}

let DeviceUtils = new DeviceUtil();
DeviceUtils.list();
export default DeviceUtils;