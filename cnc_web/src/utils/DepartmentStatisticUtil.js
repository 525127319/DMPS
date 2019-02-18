import AxiosHttp from './AxiosHttp';
import TimeUtil from './TimeUtil';
let map = new Map();
/**
 * 部门统计工具类， 首页， 部门统计那使用
 */
class DepartmentStatisticUtil {

    init() {
        AxiosHttp.post('/departmentstatuses/getdepartmentstatuses', {stime: TimeUtil.getCurDate(TimeUtil.format3)}).then(
            (res) => {
                let values = res.value;
                if (values.length > 0) {
                    map.clear();
                    values.forEach(element => {
                        map.set(element.value, element);
                    });
                } 
            }
        ).catch(error => {
            console.log(error)
        })
    }

    load(){
        return map;
    }

    //根据部门获取部门的统计信息
    getStatisticByDepartmentId(departmentId){
        let v = map.get(departmentId);
        return v?v:{};
    }

    parseTime(time){
        return time? (time / 3600).toFixed(2)  : 0;
    }
}
let util = new DepartmentStatisticUtil();

export default util;
