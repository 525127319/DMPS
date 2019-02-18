import AxiosHttp from './AxiosHttp';
let cache = new Map();//<品名, <cnc3/cnc4, <T1, {}>>>
class ToolInfoUtil {
    cache() {
        return AxiosHttp
            .get("/toolinfo/getAllToolDefine")
            .then((res) => {
                if (!res || !res.ok)return;
                localStorage.setItem('toolsInfo', JSON.stringify(res.value));
                return this.handle(res.value)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    handle(list){
        if (!list || list.size <= 0)return;
        let product = null, process = null, knifeNo = null;
        let _processMap = null, _toolMap = null;
        list.forEach(tool=>{
            product = tool.product;
            process = tool.process;
            knifeNo = tool.knife_no;
            if (cache.has(product)){
                _processMap = cache.get(product);
                if (_processMap.has(process)){
                    _toolMap = _processMap.get(process);
                    if (!_toolMap.has(knifeNo)){
                        _toolMap.set(knifeNo, tool);
                    }
                } else {
                    _toolMap = new Map();
                    _toolMap.set(knifeNo, tool);
                    _processMap.set(process, _toolMap);
                }
               
            } else {
                _processMap = new Map();
                _toolMap = new Map();
                _toolMap.set(knifeNo, tool);
                _processMap.set(process, _toolMap);
                cache.set(product, _processMap);
            }
        });
    }

     //根据产品， 工序， 刀号获取刀的信息
     getTool(product, process, toolNo){
         if (cache.size <= 0){
            let list = localStorage.getItem('toolsInfo');
            this.handle(JSON.parse(list));
         }
        let _processMap = cache.get(product);
        //产品
        if (!_processMap || !_processMap.has(process)){
            return null;
        }

        //工序
        let _toolMap = _processMap.get(process);
        if (!_toolMap || !_toolMap.has(toolNo)){
            return null;
        }

        return _toolMap.get(toolNo);
    }
}

let instance = new ToolInfoUtil();
instance.cache();
export default instance;