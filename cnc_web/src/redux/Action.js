import { SELECT_DEPARTMENT } from './ActionTypes';

class Action {

    changeDepartment(departmentId) {
        return {
            type: SELECT_DEPARTMENT,
            departmentId: departmentId
        };
    }
    

}

export default new Action();