import {SELECT_DEPARTMENT}from './ActionTypes.js';


let Reducer =  (state = [], action) => {
  switch(action.type) {
    case SELECT_DEPARTMENT: {
        return {...state, departmentId: action.departmentId};
    }
    default: {
      return state;
    }

  }
};

export {Reducer};
