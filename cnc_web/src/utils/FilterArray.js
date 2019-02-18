let map = new Map();

 class FilterArray {

    filterArray (ids,arr) {
        map.clear();
        let tmp=[];
        ids.forEach(val=>{
            tmp =  arr.filter(el=>{
                return el.dev_id ==val
            })
             map.set(val,tmp)
        })
        return map;
    }
}

let filterArray = new FilterArray()

export default filterArray;
