import AxiosHttp from './AxiosHttp';
let cache = new Map();//<品名, <cnc3/cnc4, <T1, {}>>>
let branchWMS = null, branchPromise = null;
let centerWMS = null, centerWMSPromise = null;
let sixhourOptimize = null, sixhourPromise = null;
let scheduleOptimize = null, schedulePromise = null;
let standard=null ,standardPromise=null;
class ToolInfoUtil {
    constructor(){
        this.branchwms = 1;
        this.generalwms = 0;
        this.sixhour = 2;
        this.schedule = 3;
        this.standardVal =4;
        this.optimize =5;
    }
    cache() {
        standardPromise =AxiosHttp
            .get("/appconfig/getEfficientConfig")
            .then((res) => {
                if (!res || !res.ok)return;
                localStorage.setItem('appconfig.standard', JSON.stringify(res.value));
                standard = res.value;
                return standard;
            })
            .catch((error) => {
                console.log(error)
            })
        branchPromise = AxiosHttp
            .get("/appconfig/getCutterAutoReportConfig/" + this.branchwms)
            .then((res) => {
                if (!res || !res.ok)return;
                localStorage.setItem('appconfig.branch', JSON.stringify(res.value));
                branchWMS = res.value;
                return branchWMS;
            })
            .catch((error) => {
                console.log(error)
            })
            centerWMSPromise = AxiosHttp
            .get("/appconfig/getCutterAutoReportConfig/" + this.generalwms)
            .then((res) => {
                if (!res || !res.ok)return;
                localStorage.setItem('appconfig.center', JSON.stringify(res.value));
                centerWMS = res.value;
                return centerWMS;
            })
            .catch((error) => {
                console.log(error)
            })
        sixhourPromise = AxiosHttp
            .get("/appconfig/getCutterAutoReportConfig/" + this.sixhour)
            .then((res) => {
                if (!res || !res.ok)return;
                localStorage.setItem('appconfig.sixhour', JSON.stringify(res.value));
                sixhourOptimize = res.value;
                return sixhourOptimize;
            })
            .catch((error) => {
                console.log(error)
            })
    }

     //根据产品， 工序， 刀号获取刀的信息
     getToolConfigByType(type){
         if (type == this.branchwms) {
             if (!branchWMS){
                let s = localStorage.getItem('appconfig.branch');
                if (s){
                    branchWMS = JSON.parse(s);
                } else {
                    return branchPromise;
                }
             }
             return Promise.resolve(branchWMS);
         } else if (type == this.generalwms){
            if (!centerWMS){
                let s = localStorage.getItem('appconfig.center');
                if (s){
                    centerWMS = JSON.parse(s);
                } else {
                    return centerWMSPromise;
                }
            }
            
            return Promise.resolve(centerWMS);
         }else if (type == this.sixhour){
             if (!sixhourOptimize){
                 let s = localStorage.getItem('appconfig.sixhour');
                 if (s){
                     sixhourOptimize = JSON.parse(s);
                 } else {
                     return sixhourPromise;
                 }
             }

             return Promise.resolve(sixhourOptimize);
         }else if (type == this.schedule){
             if (!sixhourOptimize){
                 let s = localStorage.getItem('appconfig.sixhour');
                 if (s){
                     sixhourOptimize = JSON.parse(s);
                 } else {
                     return sixhourPromise;
                 }
             }

             return Promise.resolve(sixhourOptimize);
         }else if(type == this.standardVal){
            if (!standard){
                let s = localStorage.getItem('appconfig.standard');
                if (s){
                    standard = JSON.parse(s);
                    return Promise.resolve(standard);
                } else {
                    return standardPromise;
                }
            } else {
                return Promise.resolve(standard);
            }
         }

    }

    getDefaultValue(type){
        if (type == this.branchwms) {
           let s = localStorage.getItem('appconfig.branch');
           if (s)
               return JSON.parse(s);
            return null;
        } else if (type == this.generalwms){
               let s = localStorage.getItem('appconfig.center');
               if (s){
                   return JSON.parse(s);
               }
               return null;
        }else if (type == this.sixhour){
            let s = localStorage.getItem('appconfig.sixhour');
            if (s){
                return JSON.parse(s);
            }
            return null;
        }else if (type == this.schedule){
            let s = localStorage.getItem('appconfig.sixhour');
            if (s){
                return JSON.parse(s);
            }
            return null;
        }else if( type == this.optimize){
            let s = localStorage.getItem('appconfig.sixhour');
            if (s){
                return JSON.parse(s);
            }
            return null;
        }
    }
}

let instance = new ToolInfoUtil();
instance.cache();
export default instance;