let equipmentUtilMap = new Map();
class EquipmentUtil {
    list() {
        let _l = [];
        // let _s0 = { value: '0', label: "机器人" };
        // equipmentUtilMap.set(_s0.value, _s0);
        // _l.push(_s0);
        let _s1 = { value: '1', label: "CNC" };
        equipmentUtilMap.set(_s1.value, _s1);
        _l.push(_s1);
        // let _s2 = { value: '2', label: "水表" };
        // _l.push(_s2);
        // equipmentUtilMap.set(_s2.value, _s2);
        return Promise.resolve(_l);
    }

    getEquipmentUtilLabelById(id) {
        let node = equipmentUtilMap.get(id);
        if (!node) {
            return id;
        }
        return node.label;
    }
}

let equipmentUtil = new EquipmentUtil();
equipmentUtil.list();
export default equipmentUtil;