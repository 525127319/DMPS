import React, { Component, Button } from 'react';
import { Feedback } from "@icedesign/base";
import DeviceinfoUtil from '@/utils/DeviceinfoUtil';
import TimeUtil from '@/utils/TimeUtil';
import StatusStatistic from './component/StatusStatistic';
import StatusSearch from './component/StatusSearch';
import DepartmentTree from '../DepartmentStatistic/components/DepartmentTree.jsx';

import './DayStatusStatistic.scss'
//default day
let defaultDay = TimeUtil.getCurDate('YYYY-MM-DD'), device = [];
const Toast = Feedback.toast;
const prompt = () => Toast.prompt('没有更多数据...');

let index = 0, pageSize = 10, _datasource = [], searchDay = null;
export default class DayStatusStatistic extends Component {

    static defaultProps = {
       
    } 

    constructor(props){
        super(props);
        index = 0;
        _datasource = [];
        this.state={
            datasource:[],
            day: defaultDay,
            display: true
        }
    }

    more(){
       this._loadData();
    }

    componentDidMount() {
        defaultDay = TimeUtil.getCurDate('YYYY-MM-DD');
        DeviceinfoUtil.getAllDevice().then((map)=>{
            if (!map)return;    
            device = [];
            map.forEach(key => {
                device.push(key);
            });
            searchDay = defaultDay;
            this._loadData();
        });
    }

    _loadData(){
        if (device && device.length <= 0){
            prompt();
            this.setState({
                display: false
            });
            return;
        }
        if (index >= device.length){
            prompt();
            this.setState({
                display: false
            });
            return;
        }
        let ndexPageLen = pageSize;
        if (device.length - index < pageSize){//剩下的设备，不够一页了
            ndexPageLen = device.length - index;
            this.setState({
                display: false
            });
        } else {
            this.setState({
                display: true
            });
        }
        let _device = device.slice(index, index + ndexPageLen);//数据合并
        index += ndexPageLen;
        _datasource = _datasource.concat(_device);
        this.setState({
            datasource: _datasource,
            day: searchDay
        });
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
                datasource: tmp,
                day: _day
            });
        } else {
            _datasource = [];
           this._loadData();
        }
    }.bind(this)

    render(){
        return(
            <div className='canvas main-container'>
                <StatusSearch search={this.search}/>
                <div   className='main-con-body'>
                    <StatusStatistic datasource={this.state.datasource} day = {this.state.day}/>
                    <div className='load-more' style={this.state.display ? styles.block : styles.display} onClick={this.more.bind(this)}>
                        <p>
                            <svg  className='load-svg' viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1555">
                                <path d="M512 582c-7.7 0-15.4-2.5-21.9-7.7l-350-280c-15.1-12.1-17.5-34.1-5.5-49.2 12.1-15.1 34.2-17.4 49.2-5.5l350 280c15.1 12.1 17.5 34.1 5.5 49.2-6.9 8.7-17 13.2-27.3 13.2z" fill="" p-id="1556"></path>
                                <path d="M512 582c-10.3 0-20.4-4.5-27.3-13.1-12-15.1-9.6-37.1 5.5-49.2l350-280c15.2-12.1 37.2-9.6 49.2 5.5s9.6 37.1-5.5 49.2l-350 280c-6.5 5.1-14.2 7.6-21.9 7.6z" fill="" p-id="1557"></path>
                                <path d="M512 792c-7.7 0-15.4-2.5-21.9-7.7l-350-280c-15.1-12.1-17.5-34.1-5.5-49.2 12.1-15.1 34.2-17.5 49.2-5.5l350 280c15.1 12.1 17.5 34.1 5.5 49.2-6.9 8.7-17 13.2-27.3 13.2z" fill="" p-id="1558"></path>
                                <path d="M512 792c-10.3 0-20.4-4.5-27.3-13.1-12-15.1-9.6-37.1 5.5-49.2l350-280c15.2-12 37.2-9.6 49.2 5.5s9.6 37.1-5.5 49.2l-350 280c-6.5 5.1-14.2 7.6-21.9 7.6z" fill="" p-id="1559"></path>
                            </svg>
                            <span>点击加载更多</span>
                        </p>
                    </div>
                </div>
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