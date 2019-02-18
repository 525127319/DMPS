import React, { Component } from 'react';
import AxiosHttp from '../../utils/AxiosHttp';
// import Static from './components';
// import Department from './Department'
import MonthPanel from './MonthPanel'
import './MonthStatistic.scss'
export default class DepartmentStatistic extends Component {
    static displayName = 'Layout';

    constructor(props) {//上層組件傳進來的屬性。
        super(props);
    }

    render() {//瀉染

        return (
                <MonthPanel />
        );
    }
    
}