import AxiosHttp from './AxiosHttp';
import DeviceinfoUtil from './DeviceinfoUtil';
// let deviceinfoMap = new Map();
// let monitorMap = new Map();
// let departmentDeviceMap = new Map();
// let monitorStatusMap = null;
let departmentStatisticMap = new Map();

/**
 * 实时状态
 */
class DeviceMonitorUtil {

    load() {
        //if (monitorStatusMap){
            return departmentStatisticMap;
        //}
    }

    init(){
        return AxiosHttp.post("/devicemonitor/deviceStatusByDepartment")
            .then(this.handleDeviceStatueByDepartment.bind(this))
            .catch(error => {
                console.log(error);
            });
    }

    handleDeviceStatueByDepartment(res){
        if (res&&res.length > 0){
            departmentStatisticMap.clear();
            res.forEach(element => {
                for (const key in element) {
                    if (element.hasOwnProperty(key)) {
                        element = element[key];
                        departmentStatisticMap.set(key, element);
                    }
                }
            });
        }
        return departmentStatisticMap;
    }

    // handleDeviceStatus(res) {
    //     if (!res.ok || !res.value || res.value.length <= 0) return;
    //     let values = res.value;
    //     values.forEach(element => {
    //         monitorMap.set(element.dev_id, element);
    //     });
    //     monitorStatusMap = this.groupMonitorByDepartment();
    //     return monitorStatusMap;
    // }

    // /**
    //  * 把monitor的数据按照部门来分组， 如部门1： {status0: 3, statu2: 4...}
    //  */
    // async groupMonitorByDepartment() {
    //     departmentDeviceMap.clear();
    //     deviceinfoMap =  await DeviceinfoUtil.getAllDevice();
    //     let monitor = null, status = null, map = null, v = null;
    //     deviceinfoMap.forEach((value, key)=>{
    //         monitor = monitorMap.get(''+value.dev_id);
    //         status = ''+monitor.data.status;
    //         if (departmentDeviceMap.has(value.department)){
    //             map = departmentDeviceMap.get(value.department);
    //             if (map.has(status)){
    //                 v = map.get(status);
    //                 v++;
    //             } else {
    //                 v = 1;
    //             }
    //             map.set(status, v);
    //             //departmentDeviceMap.get(value.department).push(value);
    //         } else {
    //             map = new Map();
    //             map.set(status, 1);
    //             departmentDeviceMap.set(value.department, map);
    //         }
            
    //     });
    //     if (departmentDeviceMap.size > 0)
    //         return this.countByDepartment();
    //     else 
    //         return null;
    // }

    // /**
    //  * 处理父部门子部门的关系， 子部门+1， 那父部门也+1
    //  * 部门是： a_b_c来的上下级关系
    //  */
    // countByDepartment() {
    //     let map = new Map(), keys = null, tmp, tmpV ;
    //     departmentDeviceMap.forEach((value, key)=>{//value is map{status: 2, status2: 4}
    //         keys = key.split('_');//key: 是父部门_子部门_子部门
    //         keys.forEach(k=>{//k为部门代号
    //             if (map.has(k)){
    //                 tmp = map.get(k);//tmp is a map.
    //                 value.forEach((v, status)=>{
    //                     if (tmp.has(status)){//判断此部门是否已有些状态了
    //                         tmpV = tmp.get(status);
    //                         tmp.set(status, tmpV + v);
    //                     } else {
    //                         tmp.set(status, v);
    //                     }
    //                 });
    //             } else {
    //                 let _map = new Map();
    //                 value.forEach((v, k)=>{
    //                     _map.set(k, v);
    //                 });
    //                 map.set(k, _map);
    //             }
    //         });
    //     });
    //     return map;
    // }

}
let util = new DeviceMonitorUtil();
export default util;