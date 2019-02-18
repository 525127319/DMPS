import React, { Component } from "react";
import StatisticHeader from '@/components/StatisticHeader/PublicHeader.jsx'
// import DepartmentHeader from './components/DepartmentHeader.jsx'
import DepartmentTable from './components/DepartmentTable.jsx'
import AxiosHttp from '@/utils/AxiosHttp.js'
import DepartmentUtil from '@/utils/DepartmentUtil.js';
import DepartmentStatusUtil from "@/utils/DepartmentStatusUtil"
import { Feedback,Loading } from "@icedesign/base";
import ShiftUtil from '@/utils/ShiftUtil';

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
        let shiftDate = ShiftUtil.getShiftDate();
        this.state = {
            department: '',
            current: 1,
            total: 0, //数据总条数
            deviceMess: null, //设备信息
            devices: [], //设备id
            dataSource: [],//渲染数据
            departmentData: {},
            optiondate: shiftDate,
            shift: '',
            dayDevice:[],
            flag: true,
            show:false
            // datAlarm:[],
            // totalCount:[]
        }
        departmentId =  DepartmentUtil.changeDepartment();
    }
   
    // 拿回表格数据
    handleData = (response) => {
            let deviceData = response.value.devicedata;
            let filterData =[];
            response.value.dayMess.forEach(ele =>{
                delete ele.id;
                filterData.push(ele);
            })
            this.setState({
                deviceMess: deviceData.rs,
                total: deviceData.total,
                dataSource :filterData,
                flag:false
            })
      
    }
    handleChange = (current) => { //分页
        this.setState({
            current: current,
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
                    'department': departmentId, 
                    'current': this.state.current,
                    'shift': this.state.shift,
                    'time': this.state.optiondate, 
                }
            )
            .then(this.handleData)
            .catch(error => {
                console.log(error)
            })
            AxiosHttp.post('/departmentstatuses/getdepartmentstatuses', { value:departmentId , stime:this.state.optiondate, shift: this.state.shift, ctype: null}).then(
                (res) => {
                    if (res.value.length > 0) {
                        this.setState({ departmentData: res.value[0].data })
                    } else {
                        this.setState({ departmentData: {}, flag:false })
                    }
                }
            ).catch(error => {
                console.log(error)
            })
    }

    componentDidMount() {
        this.getData();
        subscribe = Store.subscribe(this.changeDepartment.bind(this));
    }
    changeDepartment =() =>{
        let state = Store.getState();
        departmentId = state.departmentId
        this.getData()

    }
    componentWillUnmount(){
        if(subscribe){
            subscribe()
        }
    }
    // 拿到指定的日期
    handletHeaderDate = (shift, optiondate, ctype) => {
        if (optiondate  || shift) {
            this.setState({
                optiondate: optiondate,
                shift:shift,
            }, () => {
                this.getData();
            })
        }
    }

    render() {
        return (
            <div className='main-container'>
               <StatisticHeader handletHeaderDate={this.handletHeaderDate} department={departmentId}  type={1}/>
                <div className='con-body main-con-body'>
                <Loading 
                    shape="fusion-reactor"
                    color="#ccc"
                    visible = {this.state.flag}
                     >
                    <DepartmentTable
                        departmentData={this.state.departmentData}
                        current={this.state.current}
                        dataSource={this.state.dataSource}
                        shift={this.state.shift}
                        handleChange={(current) => {
                            this.handleChange(current)
                        }}
                        total={this.state.total} />
                        <div className="load" style={{display: this.state.show ? "block" : "none"}}>
                        导出中,请稍等<i>...</i>
                        </div>
                </Loading>
                </div>
            </div>
        )
    }
}