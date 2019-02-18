import React, { Component } from "react";
// import MonthStatisticHeader from './components/MonthStatisticHeader.jsx'
import StatisticHeader from '@/components/StatisticHeader/PublicHeader.jsx'
// import DepartmentTree from './components/DepartmentTree.jsx'
// import DepartmentTree from '@/components/DepartmentTree/DepartmentTree.jsx'
import MonthStatisticTable from './components/MonthStatisticTable.jsx'
import AxiosHttp from '@/utils/AxiosHttp.js'
import DepartmentUtil from '@/utils/DepartmentUtil.js';
import DepartmentStatusUtil from "@/utils/DepartmentStatusUtil"
import { Feedback, Loading } from "@icedesign/base";
const Toast = Feedback.toast;
import ShiftUtil from '@/utils/ShiftUtil';
import Store from '@/redux/Store';
import Action from '@/redux/Action';
import { Moment } from "@icedesign/base"
//import { Map } from "immutable";
let departmentId = 'root';
let listener = null, isLestener = false,subscribe = null;
if (!isLestener)
 listener = Store.subscribe(DepartmentUtil.changeDepartment);
 let today = new Date().toLocaleDateString();
 let times = Moment(today).format("YYYY-MM")
export default class MonthPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            department: DepartmentUtil.changeDepartment(),
            current: 1,
            total: 0, //数据总条数
            deviceMess: null, //设备信息
            devices: [], //设备id
            dataSource: [],//渲染数据
            departmentData: {},
            optiondate: times,
            shift: '',
            deviceData:[],
            flag: true, // 加载动画
        }
        departmentId =  DepartmentUtil.changeDepartment();
    }

    handleData = (response) => {
        let filterData = [];
        if(response.ok == 0){
            this.setState({
                flag:false
            })
        }
        response.value.monthList.forEach(ele =>{
            delete ele.id;
            filterData.push(ele);
        })
        this.setState({ 
            dataSource: filterData,
            total: response.value.total,
            deviceData:filterData,
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
   
    getData = () => {
        //获取设备信息
        this.setState({
            flag:true
        })
        AxiosHttp
            .post('/getMonthStatisticData/list', { 'department':departmentId, 'time': this.state.optiondate,'current': this.state.current, 'shift': this.state.shift })
            .then(this.handleData)
            .catch(error => {
                console.log(error)
            })

        AxiosHttp.post('/getDepartmentMonthStatistic/dmsData', { value:departmentId , stime:this.state.optiondate, shift: this.state.shift}).then(
            (res) => {
                if (res.value.dpMonthList.length > 0) {
                    this.setState({ departmentData: res.value.dpMonthList[0]})
                } else {
                    this.setState({ departmentData: {} })
                }
            }
            
        ).catch(error => {
            console.log(error)
        })


    }

    componentDidMount() {
        const _this= this;
        _this.getData();
        subscribe = Store.subscribe(_this.changeDepartment.bind(_this));
        

    }
    

    changeDepartment =() =>{
        let state = Store.getState();
        departmentId = state.departmentId
        this.getData();  

    }

    componentWillUnmount(){
        if(subscribe){
            subscribe()
        }
      
    }

    // 拿到指定的日期
    handletHeaderDate = (shift, optiondate, ctype) => {
        if (optiondate || shift ) {
            this.setState({
                optiondate: times,
                shift:shift
            }, () => {
                 this.getData();   
            })
        } 
    }

  

    render() {
        return (
            <div className='main-container'  >
               <StatisticHeader handletHeaderDate={this.handletHeaderDate} department={departmentId} type={2} />
                <div className='con-body main-con-body  '>
                <Loading 
                color="#ccc"
                shape="fusion-reactor"
                visible = {this.state.flag}
            >

                    {/* <DepartmentTree
                        getDepartment={(val) => {
                            this.getDepartment(val)
                        }}></DepartmentTree> */}
                <MonthStatisticTable
                        departmentData={this.state.departmentData}
                        current={this.state.current}
                        dataSource={this.state.dataSource}
                        deviceData={this.state.deviceData}
                        shift={this.state.shift}
                        handleChange={(current) => {
                            this.handleChange(current)
                        }}
                        total={this.state.total} />
                        </Loading>
                </div>
              
            </div>
        )
    }
}