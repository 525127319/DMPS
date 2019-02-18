import React, { Component } from "react";
import ToolHeader from './components/ToolHeader'
import ToolTable from './components/ToolTable'
import AxiosHttp from '@/utils/AxiosHttp.js'
import DepartmentUtil from '@/utils/DepartmentUtil.js';
import DeviceinfoUtil from "@/utils/DeviceinfoUtil.js"
import Uuid from "@/utils/Uuid.js"
import { Feedback ,Moment,Loading} from "@icedesign/base";
import Store from '@/redux/Store';
let departmentId = 'root';
let listener = null, isLestener = false,subscribe = null;
if (!isLestener)
 listener = Store.subscribe(DepartmentUtil.changeDepartment);
export default class Tool extends Component {
    constructor(props) {
        super(props);
        this.state = {
            department: '',
            current: 1,
            total: 0, //数据总条数
            devices: [], //设备id
            dataSource: [],//渲染数据
            departmentData: {},
            selectTime: 4,
            flag: true, // 加载
            deviceId:'',
        }
        departmentId =  DepartmentUtil.changeDepartment();
    }
    // 处理刀具数据结构满足插件要求
    handleCutterData = (response) => {
        if(response.ok===1){
            if(response.value&&response.value.rs){
           
            let node = null;
                response.value.rs.forEach(el=>{
                    node = DeviceinfoUtil.getDeviceByDevid(el.dev_id);
                    el.parentId = 'root';
                    el.id = el.dev_id;
                    el.name = node?node.name:el.dev_id;
                    el.time = Moment(el.time*1000).format('HH:mm:ss')
                    el.cutters.forEach((val,index)=>{
                        response.value.rs.push( val )
                        val.id =Uuid.guid()
                       val._department = el.department;
                        val.parentId = el.dev_id
                    })
                })

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
    handleChange = (current) => { //分页
        this.setState({
            current: current
        },
        () => {
            this.getCutterData(departmentId)

        });
    }
   
    getCutterData = () => {
        //   console.log(this.state.selectTime,departmentId,this.state.current,'lookkk')
        //获取换刀设备信息
        this.setState({
            flag: true,
        })
        AxiosHttp
            .get('/cutterlife/getCutterlifeByDepartmentId/' +this.state.selectTime+ '/' +departmentId +'/' + this.state.current)
            .then(this.handleCutterData)
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
        this.setState({ current: 1 },()=>{
            this.getCutterData(departmentId);
      })

    }

    componentWillUnmount(){
        if(subscribe){
            subscribe()
        }
      
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

    // 拿到指定的时间
    handletHeaderDate = ( selectTime,ctype,deviceId) => {
        this.setState({
            current: 1 ,
            selectTime:selectTime || 4,
            deviceId:deviceId
        },()=>{
            this.getCutterData(departmentId)
        })
    }

    render() {
        return (
            <div className='main-container'>
             <ToolHeader handletHeaderDate={this.handletHeaderDate} departmentId={departmentId}  dataSource={this.state.dataSource}/>
                <div className='con-body main-con-body  '>
                <Loading 
                    color="#ccc"
                    shape="fusion-reactor"
                    visible = {this.state.flag}
                >
                    <ToolTable
                        departmentData={this.state.departmentData}
                        current={this.state.current}
                        dataSource={this.state.dataSource}
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