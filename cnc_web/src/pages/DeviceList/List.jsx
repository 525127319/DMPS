import React, { Component } from 'react';
import AxiosHttp from '../../utils/AxiosHttp';
import Table from './Table';
import './sass/List.scss';

export default class List extends Component {
  static displayName = 'DeviceList';

  constructor(props) {//上層組件傳進來的屬性。
    super(props);
  }

  render() {//瀉染
   
    return (
        <Table />
    );
  }
}
