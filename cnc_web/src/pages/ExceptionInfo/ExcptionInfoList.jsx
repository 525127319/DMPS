import React, { Component } from "react";
import Chart from "./components/Chart";
import AxiosHttp from '@/utils/AxiosHttp';
import TimeUtil from '@/utils/TimeUtil';
import ShiftUtil from '@/utils/ShiftUtil';


let listener = null, isLestener = false;

if (!isLestener)
    listener = Store.subscribe(DepartmentUtil.changeDepartment);

import DepartmentUtil from '@/utils/DepartmentUtil.js';
import Store from '@/redux/Store';
let departmentId = 'root';

let index = 0, searchDay = null;
let defaultDay = null;

export default class ExcptionInfoList extends Component {
    static displayName = "ExcptionInfoList";

    constructor(props) {
        super(props);
        defaultDay = ShiftUtil.getShiftDate();
        this.state = {
            alarmTypeArr: [],
            devices: [],
            day: defaultDay,
            department: "",
            display: true,
        };
        departmentId = DepartmentUtil.changeDepartment();
    }

    getDepartment = (val) => { //获取到部门信息  
        this.setState({
            department: val
        }, () => {
            this.getDptData()
        })
    }

    //根据部门，获取设备信息
    getDptData = () => {
        AxiosHttp
            .post('/getDepartmentDevice/getDptData', { 'department': this.state.department })
            .then(this.handleData.bind(this))
            .catch(error => {
                console.log(error)
            })
    }

    handleData = (response) => {
        defaultDay = this.state.day;
        let devices = [] //所有设备ID
        if (response.value.length > 0) {
            response
                .value
                .forEach(item => {
                    devices.push(item.dev_id.toString());
                })
            this.setState({
                devices: devices,
                day: searchDay?searchDay:defaultDay
                //   dataSource:response.value.rs,
            }, () => {
                this.getAlarmsTypeData();

            })
        } else {
        }
    }

    getAlarmsTypeData() {
        AxiosHttp.post("/alarminfo/group", { devices: this.state.devices, day: this.state.day })
            .then(this.handleResponse)
            .catch(error => {
                //   console.log(error);
            });
    }

    handleResponse = (res) => {
        // console.log(res)
        this.setState({
            alarmTypeArr: res.value,
        })
    }
    componentDidMount() {
        this.getDepartment(departmentId);
        // defaultDay = TimeUtil.getCurDate('YYYY-MM-DD');
        // searchDay = defaultDay;
        listener = Store.subscribe(this.changeDepartment.bind(this));
    }

    // componentWillMount(){
    //     sessionStorage.removeItem('flag');
    //     sessionStorage.removeItem('deviceList');
    //     sessionStorage.removeItem('day');
    //     sessionStorage.removeItem('week')
    //     sessionStorage.removeItem('month')
    //     sessionStorage.removeItem('quarter');
    //     sessionStorage.removeItem('year');
    //     sessionStorage.removeItem('alarm');
    // }

    componentWillUnmount() {
        if (listener) {
            listener()
        }
    }

    changeDepartment = () => {
        let state = Store.getState();
        departmentId = state.departmentId
        this.getDepartment(departmentId);
    }

    search = function (device0, day) {
        index = 0;
        let _day = null, tmp = null;
        if (day && day.datepicker) {
            _day = day.datepicker;
            _day = TimeUtil.formatDateByFormat(_day, 'YYYY-MM-DD');
        } else {
            _day = defaultDay;//默认当天
        }
        searchDay = _day;

        if (device0) {//选中机器
            tmp = [device0]
            this.setState({
                display: false
            });
            this.setState({
                // dataSource: tmp,
                day: _day
            });
        } else {
            this.getDepartment(departmentId);
        }
    }.bind(this)

    render() {
        return (
            <Chart alarmType={this.state.alarmTypeArr} search={this.search} />
        )
    }
}