import React, { Component } from "react";
import SingleDeviceStatementHeader from './components/SingleDeviceStatementHeader.jsx'
import SingleDeviceStatementTitle from './components/SingleDeviceStatementTitle.jsx'
import CapacityEcharts from '../PublicEcharts/CapacityEcharts.jsx'
import WeeklyEcharts from '../PublicEcharts/WeeklyEcharts.jsx'
import OutputEcharts from './components/OutputEcharts.jsx'
import DayStatus from '../Realtime/components/components/DayStatus_new.jsx'
import AxiosHttp from '@/utils/AxiosHttp.js'
import DepartmentUtil from '@/utils/DepartmentUtil.js';
import DepartmentStatusUtil from "@/utils/DepartmentStatusUtil"
import { Feedback,Loading } from "@icedesign/base";
const Toast = Feedback.toast;
import Store from '@/redux/Store';
import { Moment } from "@icedesign/base"
let departmentId = 'root';
let listener = null, isLestener = false,subscribe = null;
if (!isLestener)
 listener = Store.subscribe(DepartmentUtil.changeDepartment);
export default class Department extends Component {
    constructor(props) {
        super(props);
        this.state = {
            department: '',
            current: 1,
            total: 0, //数据总条数
            deviceMess: null, //设备信息
            devices: [], //设备id
            dataSource: [],//渲染数据
            departmentData: {},
            optiondate: '',
            shift: '',
            dayDevice:[],
            flag: true,
            // datAlarm:[],
            // totalCount:[]
        }
        departmentId =  DepartmentUtil.changeDepartment();
    }
    //获取到部门信息,进行请求  
    getDepartment = (val, shift, ctype) => { 
        this.setState({
            current: 1,
            department: val,
            dataSource: []
        }, () => {
            if (!ctype)
                this.getData()
        })
        if (ctype){
            AxiosHttp.exportExcel('/departmentstatuses/getdepartmentstatuses', { value: val , stime:this.state.optiondate, shift: shift, ctype: ctype}, DepartmentUtil.getDepartmentById(val)+'_'+this.state.optiondate).then(()=>{
                Toast.success('下载成功');
            }).catch(error => {
                console.log(error)
            })
        }  else {
            AxiosHttp.post('/departmentstatuses/getdepartmentstatuses', { value: val , stime:this.state.optiondate, shift: shift, ctype: ctype}).then(
                (res) => {
                    if (res.value.length > 0) {
                        this.setState({ departmentData: res.value[0].data })
                    } else {
                        this.setState({ departmentData: {} })
                    }
                }
            ).catch(error => {
                console.log(error)
            })
        }
    }

    // 拿回表格数据
    handleData = (response) => {
            let deviceData = response.value.devicedata;
            this.setState({
                deviceMess: deviceData.rs,
                total: deviceData.total,
                dataSource :response.value.dayMess,
                flag:false
                // datAlarm : response.value.dayAlarm,
                // totalcount : response.value.totalCount
            })
      
    }
    handleChange = (current) => { //分页
        this.setState({
            current: current,
            dataSource: []
        },
        () => {
            this.getData()
        });
    }
   //根据部门获取部门下表格数据信息
    getData = () => {
        this.setState({
            flag:true
        })
        AxiosHttp
            .post('/getDepartmentDevice/data', 
                { 
                    'department': this.state.department, 
                    'current': this.state.current,
                    'shift': this.state.shift,
                    'time': this.state.optiondate, 
                }
            )
            .then(this.handleData)
            .catch(error => {
                console.log(error)
            })
    }

    componentDidMount() {
        this.handletHeaderDate()
        subscribe = Store.subscribe(this.changeDepartment.bind(this));
    }
    changeDepartment =() =>{
        let state = Store.getState();
        departmentId = state.departmentId
        this.getDepartment(departmentId);

    }
    componentWillUnmount(){
        if(subscribe){
            subscribe()
        }
    }
    // 拿到指定的日期
    handletHeaderDate = (shift, optiondate, ctype) => {
        let today = new Date().toLocaleDateString();
        let times = Moment(today).format("YYYY-MM-DD")
        if (optiondate === undefined || optiondate === times) {
            this.setState({
                optiondate: times,
                shift:shift,
                dataSource:[]
            }, () => {
                 this.getDepartment(departmentId, shift, ctype);
            })
        } else {
            this.setState({ optiondate: optiondate, shift:shift,dataSource:[] }, () => {
                this.getDepartment(departmentId, shift, ctype);
            })
        }
    }

    render() {
        return (
            <div className='main-container'>
               <SingleDeviceStatementHeader handletHeaderDate={this.handletHeaderDate} />
                <div className='con-body main-con-body'>
                <Loading 
                    shape="fusion-reactor"
                    color="#ccc"
                    visible = {this.state.flag}
                     >
                    {/* <DepartmentTable
                        departmentData={this.state.departmentData}
                        current={this.state.current}
                        dataSource={this.state.dataSource}
                        shift={this.state.shift}
                        handleChange={(current) => {
                            this.handleChange(current)
                        }}
                        total={this.state.total} /> */}
                        {/* 头部数据 */}
                        <SingleDeviceStatementTitle/>
                        <div className='echats'>
                            {/* 产出数 */}
                            <div className='echats-r'>
                                <OutputEcharts/>
                                <DayStatus/>
                            </div>
                                
                                
                            {/* 周报 */}
                            <div className='echats-left'>
                                <WeeklyEcharts/>
                                {/* top5 产能损失 */}
                                <CapacityEcharts/>
                            </div>
                        </div>
                 </Loading>
                </div>
            </div>
        )
    }
}
const styles = {
    echarts: {
        height:'400px',
    },
    status:{
        height:'200px',
    }
}
