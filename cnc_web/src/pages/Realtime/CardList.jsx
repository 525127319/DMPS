import React, { PureComponent } from "react";
import { Grid,Pagination,Loading } from "@icedesign/base";
import IceContainer from "@icedesign/container";
import Card from "./components";
import AxiosHttp from "../../utils/AxiosHttp";
import { evn } from "../../utils/Config";
import CardOverView from "./components/CardOverView";
import DepartmentUtil from '@/utils/DepartmentUtil.js';
import DeviceMonitorUtil from '@/utils/DeviceMonitorUtil.js';
import Store from '@/redux/Store';
let departmentId = 'root';
let timer = null;
const { Row } = Grid;
 let listener = null, isLestener = false, status = 0;
if (!isLestener)
    listener = Store.subscribe(DepartmentUtil.changeDepartment);
export default class CardList extends PureComponent {
  static displayName = "CardList";
  static defaultProps = {
    //本界面的默认配置，会合并到props里，但这里的属性为只读
    pageSize: 50
};
  constructor(props) {
    //上層組件傳進來的屬性。
    super(props);
    this.state = {
      dataSource: [],
      curTimeArr: [],
      deviceStatusArr: [],
      devices:[],
      devtype: "all",
      current:1,
      statusStatus: {},
      flag: true, // 加载动画
    };
    this.handleChange = this.handleChange.bind(this);
    departmentId = DepartmentUtil.changeDepartment();
  }
  handleDevStatus = function(response) {
    if (response.ok) {
      this.setState({
        deviceStatusArr: response.value,
      });
    }
  }.bind(this);

  invoke() {
    this.getData()
  }
  //瀉染完後，在後臺整合數據
  componentDidMount() {
    this.getDepartment(departmentId);
    listener = Store.subscribe(this.changeDepartment.bind(this));
    timer = setInterval(() => {
      this.invoke();
    }, evn.reRender);
  }
  changeDepartment =() =>{
    let state = Store.getState();
    departmentId = state.departmentId
    this.setState({
      flag:true
    })
    this.getDepartment(departmentId);
}
  componentWillUnmount() {
    clearInterval(timer);
    if(listener){
      listener()
    }
  }
  handleDataSource(type) {
    this.setState({
      devtype: type,
      current:1,
      flag:true
    },()=>{
      if(type=='all'){
        status = 0;
      }else if(type=='run'){
        status = 2;
      }else if(type=='idle'){
        status = 1;
      }else if(type=='debug'){
        status = 7;
      }else if(type=='alarm'){
        status = 4;
      }else if(type=='disconnect'){
        status = 8;
      }else if(type=='WaitingMaterial'){
          status = 11;
      }else if(type=='UpAndDownMaterial'){
          status = 12;
      }else if(type=='ToolChangerAlarm'){
          status = 41;
      }else if(type=='FirstPieceAlarm'){
          status = 42;
      }
      this.getData() 
    });
  }
  // 点击分页
  handleChange(current) {
    this.setState({
      current,
      flag: true
    },()=>{
      this.getData()
    }
  );
  }
  getDepartment = (val) => { //获取到部门信息  
    this.setState({
        current: 1,
        department: val,
        devtype:'all',
    }, () => {
         this.handleDataSource(this.state.devtype) 
         this.getData()
    })
}
  //根据部门，获取设备信息以及状态和运行信息
  getData = () => {
    AxiosHttp
        .post('/getDevice/devicedata', { 'department': this.state.department, 'current': this.state.current,'status':status, pageSize: this.props.pageSize})
        .then(this.handleData)
        .catch(error => {
            console.log(error)
        })
}


// 获取设备信息以及状态和运行信息
handleData = (response) => {
  if(response.ok == 0){
    this.setState({
      flag:false
    })
  }
    if (!response || !response.value)return;
    let map  = DeviceMonitorUtil.handleDeviceStatueByDepartment(response.value.statusStatistic);
      this.setState({
          total: response.value.deviceData.total,
          dataSource:response.value.deviceData.rs,
          curTimeArr: response.value.statisticData,
          deviceStatusArr: response.value.statusData,
          statusStatistic: map,
          flag:false,

      })
}
  render() {
    //瀉染
    return (
         <Loading 
                color="#ccc"
                shape="fusion-reactor"
                visible = {this.state.flag}
                style={{width:'100%'}}
            > 
        <IceContainer className="card-body main-container">
          <CardOverView
              devtype = {this.state.devtype}
              deviceStatus={this.state.deviceStatusArr}
              handleDataSource={this.handleDataSource.bind(this)}
              handleChange = {this.handleChange}
              statusStatistic = {this.state.statusStatistic}
          />
          <Row className='realtime-body main-con-body' wrap gutter={20}>
            <Card 
              dataSource={this.state.dataSource}
              curTimeArr={this.state.curTimeArr}
              deviceStatusArr={this.state.deviceStatusArr}
              devtype={this.state.devtype}
              onChange={this.handleChange}
            />
            <div style = {realData}>
                <div style={flex}>
                  <span className='total'>共 {this.state.total} 条</span>
                  <Pagination
                    current={this.state.current}
                    onChange={this.handleChange}
                    total={this.state.total}
                    pageSize={this.props.pageSize}
                  />
                </div>
            </div>
          </Row>
        
        </IceContainer>
        </Loading>
    );
  }
}

const realData = {
  display:'flex',
  'align-items':'center',
  'justify-content': 'flex-end',
  width: '100%',
  padding:'50px 10px 0 0',
  height:0
}
const flex ={
  display:'flex',
  'align-items':'center'
}
