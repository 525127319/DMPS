import {
  createStore
} from 'redux';

import {
  Reducer
} from './Reducer';

const initValues = {
  'departmentId': 'root',
};

const store = createStore(Reducer, initValues);

export default store;