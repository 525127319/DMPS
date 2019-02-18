import React, { Component } from "react";
import QuarterStatisticHeader from './components/QuarterStatisticHeader.jsx'
// import DepartmentTree from './components/DepartmentTree.jsx'
// import DepartmentTree from '@/components/DepartmentTree/DepartmentTree.jsx'
import QuarterStatisticTable from './components/QuarterStatisticTable.jsx'
import AxiosHttp from '@/utils/AxiosHttp.js'
import DepartmentUtil from '@/utils/DepartmentUtil.js';
import DepartmentStatusUtil from "@/utils/DepartmentStatusUtil"
import { Feedback,Loading } from "@icedesign/base";
const Toast = Feedback.toast;

import Store from '@/redux/Store';
import Action from '@/redux/Action';


import { Moment } from "@icedesign/base"
//import { Map } from "immutable";
let departmentId = 'root';
let listener = null, isLestener = false,subscribe = null;
if (!isLestener)
 listener = Store.subscribe(DepartmentUtil.changeDepartment);
export default class MonthPanel extends Component {
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
            deviceData:[],
            flag: true, // 加载动画
        }
        departmentId =  DepartmentUtil.changeDepartment();
    }

    getDepartment = (val, shift, ctype) => { //获取到部门信息  
        this.setState({ current: 1, dataSource:[] })
        this.setState({
            department: val
        }, () => {
            if (!ctype)
                this.getData()//这是为何每次都请求一次设备信息？
        })
        if (ctype){
            AxiosHttp.exportExcel('/departmentstatuses/getdepartmentstatuses', { value: val , stime:this.state.optiondate, shift: shift, ctype: ctype}, DepartmentUtil.getDepartmentById(val)+'_'+this.state.optiondate).then(()=>{
                Toast.success('下载成功');
            }).catch(error => {
                console.log(error)
            })
        }  else {
            AxiosHttp.post('/getDepartmentQuarterStatistic/dqsData', { value: val , stime:this.state.optiondate, shift: shift, ctype: ctype}).then(
                (res) => {
                    if (res.value.length > 0) {
                        this.setState({ departmentData: res.value[0] })
                    } else {
                        this.setState({ departmentData: {} })
                    }
                }
            ).catch(error => {
                console.log(error)
            })
        }
    }
    handleData = (response) => {
        let quarterList = response.value.quarterList;
        this.setState({ 
            dataSource: quarterList,
            total: response.value.total,
            deviceData:response.value.devIdArr,
            flag:false
         })
        
    }
      
    handleChange = (current) => { //分页
        this.setState({
            current: current,
            dataSource: [] 
        },
            // {selectDeaprment: Object.assign(current:current)},
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
            .post('/getQuarterStatisticData/list', { 'department': this.state.department, time: this.state.optiondate,'current': this.state.current, 'shift': this.state.shift })
            .then(this.handleData)
            .catch(error => {
                console.log(error)
            })
    }

    componentDidMount() {
        const _this = this;
        _this.handletHeaderDate()

        subscribe = Store.subscribe(_this.changeDepartment.bind(_this));
        

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
        this.setState({ dataSource:[]})
        let times;
        let curQuarterText = new Date().getMonth()+1;
        let curYear =new Date().getFullYear();
        if(curQuarterText<=3){
            times=curYear+'-1'
        }else if(curQuarterText>3 && curQuarterText<=6 ){
            times=curYear+'-2'
        }else if(curQuarterText>6 && curQuarterText<=9){
            times=curYear+'-3'
        }else{
            times=curYear+'-4'
        }
        
        if (optiondate === undefined || optiondate === times) {
            this.setState({
                optiondate: times,
                shift:shift
            }, () => {
                if (!ctype)
                 this.getDepartment(departmentId, shift, ctype);
                
            })

        } else {
            this.setState({ optiondate: optiondate, shift:shift }, () => {
                if (!ctype)
                this.getDepartment(departmentId, shift, ctype);
                

            })
        }
    }

  

    render() {
        return (
            <div className='main-container'  >
               <QuarterStatisticHeader handletHeaderDate={this.handletHeaderDate}  />
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
                <QuarterStatisticTable
                        departmentData={this.state.departmentData}
                        current={this.state.current}
                        dataSource={this.state.dataSource}
                        shift={this.state.shift}
                        deviceData={this.state.deviceData}
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