import React, { Component } from "react";
// import WeekHeader from './components/WeekHeader'
import StatisticHeader from '@/components/StatisticHeader/PublicHeader.jsx'
import WeekTable from './components/WeekTable'
import AxiosHttp from '@/utils/AxiosHttp.js'
import IceContainer from '@icedesign/container';
import { moment, Loading } from "@icedesign/base";

import DepartmentUtil from '@/utils/DepartmentUtil.js';
import Store from '@/redux/Store';
let departmentId = 'root';
let listener = null, isLestener = false;
if (!isLestener)
    listener = Store.subscribe(DepartmentUtil.changeDepartment);

export default class Week extends Component {
    static defaultProps = {
        //本界面的默认配置，会合并到props里，但这里的属性为只读
        pageSize: 10
    };
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],//渲染数据
            current: 1,  //分页
            total: 0,    //数据总条数
            year_no: '', //指定年
            week_no: '', //指定周数
            shift: '',   //查询班别
            weekpartmentdata: {}, //部门周的数据
            flag: true,  //加载
        };
        departmentId = DepartmentUtil.changeDepartment();
    }

    //获取到部门信息 
    getDepartment = (val) => {
        this.setState({
            department: val,
        }, () => {
            this.getWeekdata()
        })
    }

    //瀉染完後，在後臺整合數據
    componentDidMount() {
        this.getDepartment(departmentId);
        listener = Store.subscribe(this.changeDepartment.bind(this));
    }

    changeDepartment = () => {
        let state = Store.getState();
        departmentId = state.departmentId
        this.setState({ current: 1, dataSource: [] }, () => {
            this.getDepartment(departmentId);
        })
    }

    componentWillUnmount() {
        if (listener) {
            listener()
        }
    }

    // 判断今天是第几周
    getWeekOfYear() {
        var today = new Date();
        var firstDay = new Date(today.getFullYear(), 0, 1);
        var dayOfWeek = firstDay.getDay();
        var spendDay = 1;
        if (dayOfWeek != 0) {
            spendDay = 7 - dayOfWeek + 1;
        }
        firstDay = new Date(today.getFullYear(), 0, 1 + spendDay);
        var d = Math.ceil((today.valueOf() - firstDay.valueOf()) / 86400000);
        var result = Math.ceil(d / 7);
        return result + 1;
    };
    // 周数据
    getWeekdata = () => {
        let date = new Date();
        let yeardate = moment(date).format('YYYY');
        this.setState({
            flag: true
        })
        // 请求设备周统计的数据
        AxiosHttp.post('/weekStatistic/weeklist',
            {
                current: this.state.current,
                year_no: !this.state.year_no ? yeardate : this.state.year_no,
                week_no: !this.state.week_no ? this.getWeekOfYear() : this.state.week_no,
                shift: this.state.shift,
                department: this.state.department,

            })
            .then(this.handleweekdevices)
            .catch(error => {
                console.log(error);
            });

        // 请求部门周统计的数据
        AxiosHttp.post('/departmentweekstatistic/weekdepartment',
            {
                year_no: !this.state.year_no ? yeardate : this.state.year_no,
                week_no: !this.state.week_no ? this.getWeekOfYear() : this.state.week_no,
                value: this.state.department,
            })
            .then(this.handleweekdepartment)
            .catch(error => {
                console.log(error);
            });
    }

    // 设备周统计
    handleweekdevices = (response) => {
        let filterData = [];
        response.value.monthList.forEach(ele =>{
            delete ele.id;
            filterData.push(ele);
        })
        this.setState({
            dataSource: filterData,
            total: response.value.total,
            flag: false
        })
    }

    // 部门周统计
    handleweekdepartment = (response) => {
        if (response.value.length > 0) {
            this.setState({
                weekpartmentdata: response.value[0].data,
            })

        } else {
            this.setState({ weekpartmentdata: {}, })
        }
        if(response.ok == 0){
            this.setState({
                flag: false
            })
        }
    }

    //分页
    handleChange = (current) => {
        this.setState({
            current: current,
        }, () => {
            this.getWeekdata()
        });
    }

    // 拿到指定的年和周
    handletHeaderDate = (shift, optiondate, week_no) => {
        this.setState({
            current: 1,
            year_no:optiondate,
            week_no:new Number(week_no),
            shift:shift
        },()=>{this.getWeekdata()})
        // this.state.year_no = data.year_no;
        // this.state.week_no = data.week_no;
        // this.state.shift = data.shift;
    }

    render() {
        return (
            <div className='main-container' >
                    <StatisticHeader
                        handletHeaderDate={this.handletHeaderDate}
                        department={departmentId}
                        type ={4}
                    />
                    <div className='con-body main-con-body  '>
                    <Loading
                        shape="fusion-reactor"
                        color="#ccc"
                        visible={this.state.flag}
                    >
                        <WeekTable
                            weekpartmentdata={this.state.weekpartmentdata}
                            shift={this.state.shift}
                            dataSource={this.state.dataSource}
                            handleChange={(current) => {
                                this.handleChange(current)
                            }}
                            current={this.state.current}
                            total={this.state.total}
                        />
                    </Loading>
                </div>

            </div>
        )
    }
}