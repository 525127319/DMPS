import React, { Component } from 'react';
import AxiosHttp from '../../utils/AxiosHttp';
// import Static from './components';
// import Department from './Department'
import SingleDeviceStatementPanel from './SingleDeviceStatementPanel'
import './SingleDeviceStatement.scss'
export default class SingleDeviceStatement extends Component {
    static displayName = 'Layout';

    constructor(props) {//上層組件傳進來的屬性。
        super(props);
    }

    render() {//瀉染

        return (
                <SingleDeviceStatementPanel/>
        );
    }
    
}