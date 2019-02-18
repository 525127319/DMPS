import React, { Component } from "react";
import AxiosHttp from '@/utils/AxiosHttp.js'
import DepartmentUtil from '@/utils/DepartmentUtil.js';
import DeviceinfoUtil from "@/utils/DeviceinfoUtil.js"
import paginationConfigUtil from "@/utils/paginationConfigUtil.js"
import TimeUtil from "@/utils/TimeUtil.js"
import Uuid from "@/utils/Uuid.js"
import { Moment, Loading} from "@icedesign/base";
import ToolHeader from './ToolHeader'
import ToolTable from './ToolTable'
import Store from '@/redux/Store';
import ShiftUtil from '@/utils/ShiftUtil';
import './Tool.scss'

let departmentId = 'root';
let listener = null, isLestener = false,subscribe = null;
if (!isLestener)
 listener = Store.subscribe(DepartmentUtil.changeDepartment); 
 let optiondate = TimeUtil.getCurDate(TimeUtil.format3);
//type 0-center, 1-branch

export default class Tool extends Component {
    constructor(props) {
        super(props);
        let shiftDate = ShiftUtil.getShiftDate();
        this.state = {
            department: DepartmentUtil.changeDepartment(),
            current: 1,
            total: 0, //数据总条数
            devices: [], //设备id
            dataSource: [],//渲染数据
            departmentData: {},
            selectTime: {},
            flag: false, // 加载
            optiondate: shiftDate,
            deviceId: 0,
        };
        departmentId =  DepartmentUtil.changeDepartment();
        this.type = this.props.type;
    }
    // 处理刀具数据结构满足插件要求
    handleCutterData = (response) => {
        if(response.ok===1){
            if(response.value&&response.value.rs){
            //  console.log( response.value.rs,'kkkkkkkk')
            let node = null;
                response.value.rs.forEach(el=>{
                    node = DeviceinfoUtil.getDeviceByDevid(el.dev_id);
                    el.parentId = 'root';
                    el.id = el.dev_id;
                    el.name = node?node.name:el.dev_id;
                    el.time = Moment(el.time*1000).format('HH:mm:ss');
                    el.cuttersLen = el.cutters.length;
                    el.cutters.forEach((val,index)=>{
                        response.value.rs.push( val );
                        val.id =Uuid.guid();
                        val._department = el.department;
                        val.parentId = el.dev_id
                    })
                });

                response.value.rs.unshift({
                    id: 'root',
               })
            }
            this.setState({
                dataSource: response.value.rs,
                 total: response.value.total,
                 flag: false,
            })

        }else{
            this.setState({
                flag: false,
            })
        }
      
    };

    // 处理航班轮播需要的数组数据
    handleOptimizeArr = (arr, length) => {
        var _arr = [];
        while(arr.length){
            _arr.push(arr.splice(0, length))
        }
        return _arr
    };

    // 处理刀具优化后航班数据结构满足插件要求
    handleOptimizeData = (response) => {
        // clearInterval(this.timer);
        clearInterval(this.timer1);
        let timeArr = TimeUtil.format(TimeUtil.times(),TimeUtil.format4).split(" ");
        let arr = [];
        let total = 0;
        if(response.ok===1){
            if(response.value.length !== 0){
                let node = null;
                let index = 1;
                response.value.forEach((item) => {
                    node = DeviceinfoUtil.getDeviceByDevid(item.dev_id);
                    item.parentId = 'root';
                    item.name = node?node.name:item.dev_id;
                    item.time = TimeUtil.format(item.time, 'HH:mm:ss');
                    item.index = index++;
                    arr.push(item);
                });
            }

            arr.sort((a,b) => {
                let timeA = TimeUtil.changeTimestamp(a.estimate_time);
                let timeB = TimeUtil.changeTimestamp(b.estimate_time);
                return timeA < timeB;
            });

            total = arr.length;
            // let _arr = this.handleOptimizeArr(arr,15);
            // let order = 0;
            // let dataSourceArr = [];

            // dataSourceArr = _arr[order];
            this.setState({
                // dataSource: dataSourceArr,
                dataSource: arr,
                total: total,
                flag: false,
                timeArr:timeArr
            });

            // this.timer = setInterval(() => {
            //     if(order < _arr.length - 1) {
            //         order = order + 1;
            //     } else {
            //         order = 0;
            //     }
            //     dataSourceArr = _arr[order];
            //
            //     this.setState({
            //         dataSource: dataSourceArr,
            //         total: total,
            //         flag: false,
            //     });
            //
            // }, 10000);

            this.timer1 = setInterval(() => {
                this.type = 3;
                this.getCutterData();
            }, 120000);

        } else {
            this.setState({
                timeArr:timeArr,
                flag: false,
            });
        }

    };

    handleOptimizeLagData =(response) =>{
        if(response.ok === 1){
            let arr =[];
            if(response.value&&response.value.rs){
                let node = null;
                response.value.rs.forEach(el=>{
                    node = DeviceinfoUtil.getDeviceByDevid(el.dev_id);
                    el.parentId = 'root';
                    el.id = el.dev_id;
                    el.name = node?node.name:el.dev_id;
                    el.time = Moment(el.time*1000).format('HH:mm:ss');
                    el.cutters.forEach((val,index)=>{
                       response.value.rs.push( val );
                        val.id =Uuid.guid();
                        val._department = el.department;
                        val.parentId = el.dev_id
                    })
                });
    
                response.value.rs.unshift({
                    id: 'root',
               })  
            }
            this.setState({
                 dataSource: response.value.rs,
                 total: response.value.total,
                 flag: false,
            })
        }else(
            this.setState({
                flag: false,
            })
        )
    }

    getCutterData = () => {
        //   console.log(this.state.selectTime,departmentId,this.state.current,'lookkk')
        //获取换刀设备信息
        this.setState({
            flag: true,
        });
        if(this.type === 3) {
            AxiosHttp
                .get('/cutteroptimize/getCutterRTK/'+departmentId + '/' + paginationConfigUtil.getPageIndex(0) + '/' + paginationConfigUtil.getPageSize(0))
                .then(this.handleOptimizeData)
                .catch(error => {
                    console.log(error)
                })
        } else if(this.type === 5){
            AxiosHttp
            .get('/cutteroptimize/getCutterOptHistroy/'+departmentId+'/' + this.state.deviceId + '/' +this.state.optiondate+'/'+this.state.selectTime.start+'/'+ this.state.selectTime.end+'/' + this.state.current + '/' + paginationConfigUtil.getPageSize())
            .then(this.handleOptimizeLagData)
            .catch(error => {
                console.log(error)
            })
        }
        else {
            AxiosHttp
                .get('/cutterforecast/getCutterForecast/' +departmentId+'/' +this.state.optiondate+'/'+this.state.selectTime.start+'/'+ this.state.selectTime.end+'/'+this.type +'/'+ this.state.deviceId + '/'+ this.state.current + '/' + paginationConfigUtil.getPageSize())
                .then(this.handleCutterData)
                .catch(error => {
                    console.log(error)
                })
        }
    };

    setFlag(flag){
        this.setState({
            flag: flag
        });
        
    }

    componentDidMount() {
        const _this = this;
       // _this.handletHeaderDate()

        subscribe = Store.subscribe(_this.changeDepartment.bind(_this));
        
    }
    

    changeDepartment =() =>{
        let state = Store.getState();
        departmentId = state.departmentId
        this.setState({ current: 1 },()=>{
            this.getCutterData(departmentId);
      })

    }

    componentWillUnmount(){
        // clearInterval(this.timer);
        clearInterval(this.timer1);
        if(subscribe){
            subscribe()
        }
    }
    

    // 拿到指定的时间
    handletHeaderDate = (selectTime, _optiondate, ctype,deviceId) => {
        optiondate = _optiondate?_optiondate:optiondate;
        this.setState({
            current: 1 ,
            selectTime: selectTime,
            optiondate: optiondate,
            deviceId:deviceId
        },()=>{
            this.getCutterData(departmentId)
        })
    }

    handleChange = (current) => { //分页
        this.setState({
            current: current
        },
        () => {
            this.getCutterData(departmentId)

        });
    }


    render() {
     return (<div className='main-container'>
        <ToolHeader handletHeaderDate={this.handletHeaderDate} departmentId={departmentId} setFlag = {this.setFlag.bind(this)} type={this.type} timeArr={this.state.timeArr}/>
           <div className='con-body main-con-body ov-main-con-body'>
           <Loading 
               color="#ccc"
               shape="fusion-reactor"
               visible = {this.state.flag}
           >
               <ToolTable
                   departmentData={this.departmentData}
                   current={this.state.current}
                   dataSource={this.state.dataSource}
                   handleChange={(current) => {
                       this.handleChange(current)
                   }}
                   total={this.state.total}
                   type={this.type}/>
           </Loading>
           </div>
       </div>);
    }
}