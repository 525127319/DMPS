import React, { Component, Button } from 'react';
import { Feedback, Pagination,Loading } from "@icedesign/base";
import DeviceinfoUtil from '@/utils/DeviceinfoUtil';
import TimeUtil from '@/utils/TimeUtil';
import StatusStatistic from './component/StatusStatistic';
import StatusSearch from './component/StatusSearch';
// import DepartmentTree from '../DepartmentStatistic/components/DepartmentTree.jsx';
// import DepartmentTree from '@/components/DepartmentTree/DepartmentTree.jsx'

import AxiosHttp from '@/utils/AxiosHttp.js';
import FilterArray from '@/utils/FilterArray.js';
import Store from '@/redux/Store';
import DepartmentUtil from '@/utils/DepartmentUtil.js';
let departmentId = 'root';
let listener = null, isLestener = false;

import './DayStatusStatistic.scss'
import { isNull } from 'util';
//default day
let defaultDay = TimeUtil.getCurDate('YYYY-MM-DD'), device = [];
const Toast = Feedback.toast;
const prompt = () => Toast.prompt('没有更多数据...');

const tipLoader1 = (
    <div className="load-container load1">
      <div className="loader">loading...</div>
    </div>
  );

let index = 0, pageSize = 10, _datasource = [], searchDay = null;

if (!isLestener)
    listener = Store.subscribe(DepartmentUtil.changeDepartment);

export default class DayStatusStatistic extends Component {

    static defaultProps = {
       
    } 

    constructor(props){
        super(props);
        index = 0;
        _datasource = [];
        this.state={
            dataSource:[], // 部门设备
            day: defaultDay,
            display: true,
            devices:[], // 部门下的设备ID数组
            department: '',// 当前部门
            current: 1, // 当前页码
            total: 0, //数据总条数
            statusMap: null, // 一页设备的状态数据
            flag: true, // 加载动画
        }
        departmentId = DepartmentUtil.changeDepartment();

    }

    getDepartment = (val) => { //获取到部门信息  
        if(this.state.statusMap){
            this.state.statusMap.clear();
          }
        this.setState({ current: 1 })
        this.setState({
            department: val
        }, () => {
             this.getData()
        })

    }

    handleChange = (current) => { //分页
        this.setState({
            current: current
        },
            // {selectDeaprment: Object.assign(current:current)},
            () => {
                // console.log(this.state, 2222)
                this.getData()

            });
    }
    //根据部门，获取设备信息
    getData = () => {
        AxiosHttp
            .post('/getDepartmentDevice/data', { 'department': this.state.department, 'current': this.state.current })
            .then(this.handleData)
            .catch(error => {
                console.log(error)
            })
    }

    

    handleData = (response) => {
        console.log(response,'response')
        if(response.ok == 0){
                    this.setState({
            flag:false
        })
        }
        defaultDay = TimeUtil.getCurDate('YYYY-MM-DD');
        // searchDay = defaultDay;
        let devices = [] //所有设备ID
        if (response.value.devicedata.total) {
            response
                .value
                .devicedata
                .rs
                .forEach(item => {
                    devices.push(item.dev_id);
                })
            this.setState({ total: response.value.devicedata.total})
            this.setState({
                devices: devices,
                dataSource:response.value.devicedata.rs,
                day: searchDay
            },()=>{
              this.getDayStatusByDevIdsAndDay()

            })
        } else {
            this.setState({ statusMap: null,flag:false})
        }
    }
    // 历史状态一次请求
    getDayStatusByDevIdsAndDay = () => {
        this.setState({
            flag:true
        })
        AxiosHttp.post('/deviceStatusData/getDayStatusByDevIdsAndDay',{devices:this.state.devices,time:this.state.day})
        .then(this.handleDayStatus.bind(this))
        .catch(err=>{
            console.log(err)
        })
    }
    handleDayStatus = (response) => {
        this.setState({
            flag:false
        })
        if(this.state.statusMap){
          this.state.statusMap.clear();
        }
        this.setState({
            statusMap: FilterArray.filterArray(this.state.devices,response.value.rs)
        })

        // console.log(this.state.statusMap,'this.state.statusMap')

    }
    componentWillMount(){
        sessionStorage.removeItem('flag');
        sessionStorage.removeItem('deviceList');
        sessionStorage.removeItem('day');
        sessionStorage.removeItem('week')
        sessionStorage.removeItem('month')
        sessionStorage.removeItem('quarter');
        sessionStorage.removeItem('year');
        sessionStorage.removeItem('alarm');
    }
    componentDidMount() {
        this.getDepartment(departmentId);
        defaultDay = TimeUtil.getCurDate('YYYY-MM-DD');
        searchDay = defaultDay;
        listener = Store.subscribe(this.changeDepartment.bind(this));

    }


    changeDepartment =() =>{
        let state = Store.getState();
        departmentId = state.departmentId
        this.getDepartment(departmentId);

    }

    componentWillUnmount(){
        if(listener){
            listener()
        }
      
    }

    search = function(device0, day){
        index = 0;
        let _day = null, tmp = null;
        if (day && day.datepicker){
            _day = day.datepicker;
            _day = TimeUtil.formatDateByFormat(_day, 'YYYY-MM-DD');
        } else {
            _day = defaultDay;//默认当天
        }
        searchDay = _day;

        if (device0){//选中机器
            tmp = [device0]
            this.setState({
                display: false
            });
            this.setState({
                dataSource: tmp,
                day: _day
            });
        } else {
            this.getDepartment(departmentId);
        }
    }.bind(this)

    render(){
        return(
            <div className='canvas main-container'>
            <Loading 
                color="#ccc"
                shape="fusion-reactor"
                style={{display: 'block',width:'100%',height:'100%'}}
                visible = {this.state.flag}
            >
             <StatusSearch search={this.search}/>
                <div   className='con-body main-con-body'  style={{padding: '0 20px 20px 20px',}}>
               

                    {/* <div   className=' main-con-body'> */}
                    {/* <DepartmentTree
                            getDepartment={(val) => {
                                this.getDepartment(val)
                            }}>
                    </DepartmentTree> */}
                    <div className='history-data'>
                    <StatusStatistic statusMap={this.state.statusMap} datasource={this.state.dataSource} day = {this.state.day}/>

                        <div className='paginationStatus' style={{margin:'10px 0 0 0'}}>
                        <span className='total'>共 {this.state.total} 条</span>
                        <Pagination
                        current={this.state.current}
                        onChange={this.handleChange}
                        total={this.state.total}
                        />
                    </div>
                  
                </div>
                </div>
              
                </Loading>
               
            </div>
        )
    }
}

const styles = {
    display:{
        display: 'none'
    },
    block:{
        display: 'block'
    }
}