let  brandMap = new Map();
class BrandUtil{
    list(){
        let _l = [];
        let _s0 = {value: '0', label:  "FANUC"};
        brandMap.set(_s0.value, _s0);
        _l.push(_s0);

        let _s1 = {value: '1', label:  "MitsuBishi"};
        _l.push(_s1);
        brandMap.set(_s1.value, _s1);

        // let _s2 = {value: '2', label:  "三菱"};
        // _l.push(_s2);
        // brandMap.set(_s2.value, _s2);

        return Promise.resolve(_l);
    }

    getBrandLabelById(id){
        let node = brandMap.get(id);
        if (!node) {
            return id;
        }
        return node.label;
    }
}

let brandUtil = new BrandUtil();
brandUtil.list();
export default brandUtil;