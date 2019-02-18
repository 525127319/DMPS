import AxiosHttp from './AxiosHttp';

let devicetypeMap = new Map(),
    devBrandNameMap = new Map(),
    deviceModelMap = new Map();
let devicetype = [], deviceBrandName = [], deviceModel = [];

class DevicetypeUtil{
    cacheDeviceType() {
        AxiosHttp
            .get('/device/devicetypelist')
            .then((res) => {
                this.handledevicetype(res)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    handledevicetype(response) {
        let datas = null;
        let devicetypeStore = localStorage.getItem('devicetype');
        if(response && response.value) {
            datas = response.value;
            localStorage.setItem('devicetype', JSON.stringify(datas));
            this.handleData(datas);
        } else if(devicetypeStore) {
            datas = JSON.parse(devicetypeStore);
            this.handleData(datas)
        }
        datas = null;
    }

    handleData(datas) {
        if (!datas)return;
        devicetypeMap.clear();
        devBrandNameMap.clear();
        deviceModelMap.clear();
        devicetype.length = 0;
        deviceBrandName.length = 0;
        deviceModel.length = 0;

        datas.forEach((item, index) => {
            devicetype.push({label: item.type, value: index.toString()});
            deviceBrandName.push({label: item.name, value: index.toString()});
            deviceModel.push({label: item.model, value: index.toString()});

            devicetypeMap.set(index, item.type);
            devBrandNameMap.set(index, item.name);
            deviceModelMap.set(index, item.model);
        });
    }

    handleLocalStroge() {
        this.handledevicetype();
    }

    getDevicetype() {
        return devicetype;
    }

    getBrandName() {
        return deviceBrandName;
    }

    getModel() {
        return deviceModel;
    }

    getDevicetypeById(id){
        let node = devicetypeMap.get(parseInt(id));
        if (!node)
            return id;
        return node;
    }

    getDevBrandNameById(id){
        let node = devBrandNameMap.get(parseInt(id));
        if (!node)
            return id;
        return node;
    }

    getDeviceModelById(id){
        let node = deviceModelMap.get(parseInt(id));
        if (!node)
            return id;
        return node;
    }
}
let DevicetypeUtils = new DevicetypeUtil();
//DevicetypeUtils.cacheDeviceType();
//DevicetypeUtils.handleLocalStroge();
export default DevicetypeUtils;