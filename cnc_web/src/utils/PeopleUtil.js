let  peopleMap = new Map();
class PeopleUtil{
    // list(){
    //     peopleMap.set(1, "admin");
    //     return Promise.resolve(peopleMap);
    // }
    list() {
        let _l = [];
        let _s0 = { value: '0', label: "admin" };
        peopleMap.set(_s0.value, _s0);
        _l.push(_s0);
        let _s1 = { value: '1', label: "heoo" };
        peopleMap.set(_s1.value, _s1);
        _l.push(_s1);
        // let _s2 = { value: '2', label: "水表" };
        // _l.push(_s2);
        // peopleMap.set(_s2.value, _s2);
        return Promise.resolve(_l);
    }

    getPeopleById(id){
        // let node = peopleMap.get(parseInt(id));
        let node = peopleMap.get(id);
        if (!node) {
            return id;
        }
        return node.label;
    }
}

let PeopleUtils = new PeopleUtil();
PeopleUtils.list();
export default PeopleUtils;