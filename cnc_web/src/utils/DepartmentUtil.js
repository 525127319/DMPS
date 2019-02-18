import AxiosHttp from './AxiosHttp';
import DevicetypeUtils from "./DevicetypeUtil";
import Store from '@/redux/Store';

let _departmentMap = new Map();
let _locationMap = new Map();
let department, location;

class DepartmentUtil {
    async cacheDepartment() {
        await AxiosHttp
            .get('/department/get')
            .then((res) => {
                this.handledevdepartment(res)
            })
            .catch((error) => {
                console.log(error);
            });
    } 

    handledevdepartment(response) {
        let datas = [];
        let departmentStore = localStorage.getItem('department');
        if (response && response.value) {
            if (response.value.length > 0) {
                datas = response.value;
                this.handleData(datas);
                localStorage.setItem('department', JSON.stringify(datas));
            }
        } else if (departmentStore) {
            datas = JSON.parse(departmentStore);
            this.handleData(datas)
        }
        datas = null;
    }

    handleData(datas) {
        datas.forEach(item => {
            switch (item.type) {
                case "department":
                    department = item.data;
                    delete department["__watch_cache"];
                    this.resetMap(department, _departmentMap);
                    break;
                case "location":
                    location = item.data;
                    delete location["__watch_cache"];
                    this.resetMap(location, _locationMap);
                    break;
            }
        });
    }

    handleLocalStroge() {
        this.handledevdepartment();
    }

    resetMap = function (response, _map) {
        _map.clear();
        _map.set(response.value, response);
        this.set2Map(response.children, _map);
    }.bind(this);

    set2Map = function (children, _map) {
        if (children.length <= 0) return;
        children.map(node => {
            _map.set(node.value, node);
            if (node.children.length > 0) {
                this.set2Map(node.children, _map);
            }
        });
    }.bind(this);

    async getDepartmentTree() {
        await this.cacheDepartment();
        if (department)
            return [department];
        return []
    }

    async loadDepartment() {
        if (department)
            return Promise.resolve([department]);
        else {
            return await this.getDepartmentTree();
        }
    }

    async getLocationTree() {
        await this.cacheDepartment();
        if (location) {
            return [location];
        } else {
            return [];
        }

    }

    getDepartmentById(id) {
        let node = _departmentMap.get(id);
        if (!node)
            return id;
        return node.label;
    }

    getLocationById(id) {
        let node = _locationMap.get(id);
        if (!node)
            return id;
        return node.label;
    }

    getLocationById(id) {
        let node = _locationMap.get(id);
        if (!node) return id;
        return node.label;
    }

    changeDepartment() {
        let state = Store.getState();
        if (state){
            localStorage.setItem('departmentId', state.departmentId)
        }
        let d = localStorage.getItem('departmentId') || state.departmentId
        if (!d)return 'root';
        return d;
    }

    //获取工厂名
    getFactory(departmentId) {
        let dp = departmentId;
        if (!dp) return;
        dp = dp.split('_');
        if (dp.length > 2) {
            let tmp = dp[0] + '_' + dp[1];
            return this.getDepartmentById(tmp);
        }
        return '';
    }
    //获取楼&楼层
    getBuilding(departmentId) {
        let dp = departmentId;
        if (!dp) return;
        dp = dp.split('_');
        if (dp.length >= 3) {
            let tmp = dp[0] + '_' + dp[1] + '_' + dp[2];
            let name = this.getDepartmentById(tmp);//T2-3F_WestPoint_WF
            if (name) {
                return name.substring(0, name.indexOf('_') - 1);
            }
        }
        return '';
    }

    //获取产品
    getProduct(departmentId) {
        let dp = departmentId;
        if (!dp) return;
        dp = dp.split('_');
        if (dp.length >= 3) {
            let tmp = dp[0] + '_' + dp[1] + '_' + dp[2];
            let name = this.getDepartmentById(tmp);//T2-3F_WestPoint_WF
            if (name) {
                return name.substring(name.indexOf('_') + 1);
            }
        }
        return '';
    }

    //获取夹位
    getPinch(departmentId) {
        let dp = departmentId;
        if (!dp) return;
        dp = dp.split('_');
        if (dp.length >= 4) {
            let tmp = dp[0] + '_' + dp[1] + '_' + dp[2] + '_' + dp[3];
            let name = this.getDepartmentById(tmp);//夹位CNC4
            if (name) {
                return name.replace('夹位', '');
            }
        }
        return '';
    }

     //获取cell
     getCell(departmentId) {
        let dp = departmentId;
        if (!dp) return;
        dp = dp.split('_');
        if (dp.length >= 5) {
            let tmp = dp[0] + '_' + dp[1] + '_' + dp[2] + '_' + dp[3]+ '_' + dp[4];
            let name = this.getDepartmentById(tmp);
            if (name == tmp)
                return '';
            else if (name) {
                return name;
            }
        }
        return '';
    }
    //获取block
    getBlock(departmentId) {
        let dp = departmentId;
        if (!dp) return;
        dp = dp.split('_');
        if (dp.length >= 6) {
            let tmp = dp[0] + '_' + dp[1] + '_' + dp[2] + '_' + dp[3]+ '_' + dp[4]+ '_' + dp[5];
            let name = this.getDepartmentById(tmp);
            if (name == tmp)
                return '';
            else if (name) {
                return name;
            }
        }
        return '';
    }
    //取完整部门路径
    getCompleteDepartmentPath(departmentId){
        let dp = departmentId;
        if (!dp) return;
        dp = dp.split('_');
        let d = '';
        if (dp.length >= 3) {//product
            d += this.getProduct(departmentId);
        }
        if (dp.length >= 4) {//pinch
            d += '>'+this.getPinch(departmentId);
        }

        if (dp.length >= 5) {//cell
            d += '>'+this.getCell(departmentId);
        }
        if (dp.length >= 6) {//block
            d += '>'+this.getBlock(departmentId);
        }
        return d;
    }
}
let DepartmentUtils = new DepartmentUtil();
DepartmentUtils.cacheDepartment();
DepartmentUtils.handleLocalStroge();
export default DepartmentUtils;

