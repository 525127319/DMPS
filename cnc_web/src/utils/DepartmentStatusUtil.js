class DepartmentStatusUtil{

    matchByShiftId(departmentStatus, shiftid){
        if (!departmentStatus)return null;
        if (!shiftid) return departmentStatus;
        let children = departmentStatus.children;
        let departmentData = null;
        for (let index = 0; index < children.length; index++) {
            const element = children[index];
            if (element.id == shiftid){
                departmentData = element;
                break;
            }
        }
        return departmentData;
    }

}

export default new DepartmentStatusUtil();