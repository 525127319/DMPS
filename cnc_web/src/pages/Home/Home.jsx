

import React, { Component } from 'react';
import DepartmentUtil from '@/utils/DepartmentUtil';
import CenteredTree from './component/CenteredTree';
import DeviceMonitorUtil from '@/utils/DeviceMonitorUtil';
import DepartmentStatisticUtil from '@/utils/DepartmentStatisticUtil';

import './Home.scss';

export default class Home extends Component {
    static displayName = 'Home';

    constructor(props) {
        super(props);
        this.state = { datasorce: null };
    }

    convert(deparments, obj) {
        let local = this, tmp = null, statusMap = null;
        deparments.forEach(department => {
            tmp = { name: department.label };
            //let d = department.value.split('_');
            //statusMap = departmentMonitorMap.get(d[d.length - 1]);
           // tmp.content = statusMap;
            tmp.value = department.value;
            obj.children.push(tmp);
            if (department.children && department.children.length > 0) {
                tmp.children = [];
                local.convert(department.children, tmp);
            }
        });
    }

    componentWillUnmount(){
        clearInterval(this.timer);
    }

    async componentDidMount() {
        let departments = await DepartmentUtil.loadDepartment();
        //let fn = function (departmentMonitorMap) {
            let department = departments[0];
            if(!department)return;
            let obj = { name: department.label, children: [], value: department.value};//,content: departmentMonitorMap.get(department.value) 
            this.convert(department.children, obj);
            this.setState({
                datasorce: [obj]
            });
        //}.bind(this);
        this.timer = setInterval(() => {
            DeviceMonitorUtil.init();
            DepartmentStatisticUtil.init();
        }, 5000);
        //DeviceMonitorUtil.init();
        DepartmentStatisticUtil.init();
    }

    render() {
        return (
            <CenteredTree datasorce={this.state.datasorce} />
        );
    }
}


const styles = {
    bg: {
        backgroundColor: '#fff'
    },
    status_height: {
        height: '40px',
        margin: '6px 0'
    },

    status_height2: {
        height: '380px',
        width: '1200px'
    }
}