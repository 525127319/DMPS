import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import {hashHistory} from 'react-router';
import DeviceMonitorUtil from '@/utils/DeviceMonitorUtil';
import {status} from '@/utils/Config';
import DepartmentUtil from '@/utils/DepartmentUtil.js';
import "../sass/cardOverView.scss";
let departmentId = 'root';
let listener = null, isLestener = false,fn,timer;
import Store from '@/redux/Store';
if (!isLestener)
    listener = Store.subscribe(DepartmentUtil.changeDepartment);
let workcount = 0,
  idlecount = 0,
  disconnectcount = 0,
  WaitingMaterialcount = 0,
  UpAndDownMaterialcount = 0,
  ToolChangerAlarmcount = 0,
  FirstPieceAlarmcount = 0,
  alarmcount = 0,
  debugcount = 0, // 调试
  devicecount = 0; // 暂停
export default class CardOverView extends PureComponent {
  static displayName = "CardOverView";
  static propTypes = {
    deviceStatusArr: PropTypes.array
  };
  static defaultProps = {
    deviceStatusArr: []
  };
  constructor(props) {
    super(props);
    this.state = {
        type: 'all',
        idlecount: 0,
        workcount:0,
        alarmcount:0,
        debugcount: 0,
        disconnectcount:0,
        WaitingMaterialcount:0,
        UpAndDownMaterialcount:0,
        ToolChangerAlarmcount:0,
        FirstPieceAlarmcount:0,
        devicecount:0,
        statusStatus: props.statusStatus
    }
    departmentId = DepartmentUtil.changeDepartment();
  }
  changeDepartment =() =>{ 
    let state = Store.getState();
    departmentId = state.departmentId;
    this.getDepartment(departmentId);
    
   
}
getDepartment = (val) => { //获取到部门信息  
  this.setState({
      department: val,
  },()=>{
   let d = departmentId.split('_');
    this.value = d[d.length -1];
    this.fn();
  })
}
  parse(v){
    return v?v:0;
  }

  fn = function(map){
    // let map = await DeviceMonitorUtil.load();
    // DeviceMonitorUtil.init();
    // fn(rs);
    if (!map || map.size <= 0)return;
    let _status = map.get(this.value);
    if(!_status){
        workcount = 0,
        idlecount = 0,
        disconnectcount = 0,
        WaitingMaterialcount = 0,
        UpAndDownMaterialcount = 0,
        ToolChangerAlarmcount = 0,
        FirstPieceAlarmcount = 0,
        alarmcount = 0,
        debugcount = 0,
        devicecount = 0;
    } else {
        idlecount = this.parse(_status['' + status.IdleV]);
        workcount = this.parse(_status['' + status.RunningV]);
        alarmcount = this.parse(_status['' + status.AlarmV]);
        debugcount = this.parse(_status['' + status.DebugV]);
        disconnectcount = this.parse(_status['' + status.UnConnectedV]);
        WaitingMaterialcount = this.parse(_status['' + status.WaitingMaterialV]);
        UpAndDownMaterialcount = this.parse(_status['' + status.UpAndDownMaterialV]);
        ToolChangerAlarmcount = this.parse(_status['' + status.ToolChangerAlarmV]);
        FirstPieceAlarmcount = this.parse(_status['' + status.FirstPieceAlarmV]);
        devicecount = idlecount + workcount + alarmcount + debugcount + disconnectcount + WaitingMaterialcount + UpAndDownMaterialcount + ToolChangerAlarmcount + FirstPieceAlarmcount;
    }
    this.setState({
        idlecount:idlecount,
        workcount: workcount,
        alarmcount: alarmcount,
        debugcount: debugcount,
        disconnectcount: disconnectcount,
        WaitingMaterialcount: WaitingMaterialcount,
        UpAndDownMaterialcount: UpAndDownMaterialcount,
        ToolChangerAlarmcount: ToolChangerAlarmcount,
        FirstPieceAlarmcount: FirstPieceAlarmcount,
        devicecount: devicecount
    });
}.bind(this);
  componentDidMount(){
    this.getDepartment(departmentId);
    listener = Store.subscribe(this.changeDepartment.bind(this));
  
    // timer = setInterval(async function () {
    //   this.fn();
    // }.bind(this), 5000);
    //this.fn();
  }
  componentWillUnmount(){
   // clearInterval(timer)
  }
  handledevStatus = function() {
    //DeviceMonitorUtil.init();
  }.bind(this);

  componentWillUnmount() {
    // sessionStorage.removeItem('flag');
  }

  sortDevice(type) {
    this.setState({
      type
    })
    this.props.handleDataSource(type);
  }

  componentWillReceiveProps(newProps, oldProps){
    this.setState({
        statusStatistic: newProps.statusStatistic
    });
    this.fn(newProps.statusStatistic);
  }

  render() {
    if (!_.isEmpty(this.props.dataSource)) {
      devicecount = this.props.dataSource.length;
    }
    return (
      <div className="total-view real-time-head main-con-head ">
        <div onClick={this.sortDevice.bind(this, "all")} className={this.props.devtype === 'all'?"data-top active":"data-top"}>
          <span>设备总数</span>
          <h2>{this.state.devicecount}</h2>
        </div>
        <div
          onClick={this.sortDevice.bind(this,"run")}
          className={this.props.devtype === 'run'?"data-top active":"data-top"}
        >
          <span>运行中</span>
          <h2 className="green">{this.state.workcount}</h2>
        </div>
        {/*<div*/}
          {/*onClick={this.sortDevice.bind(this, "idle")}*/}
          {/*className={this.props.devtype === 'idle'?"data-top active":"data-top"}*/}
        {/*>*/}
          {/*<span>空闲</span>*/}
          {/*<h2 className="yellow">{this.state.idlecount}</h2>*/}
        {/*</div>*/}
        <div
          onClick={this.sortDevice.bind(this, "WaitingMaterial")}
          className={this.props.devtype === 'WaitingMaterial'?"data-top active":"data-top"}
        >
          <span>待料</span>
          <h2 className="yellow">{this.state.WaitingMaterialcount}</h2>
        </div>
        <div
          onClick={this.sortDevice.bind(this, "UpAndDownMaterial")}
          className={this.props.devtype === 'UpAndDownMaterial'?"data-top active":"data-top"}
        >
          <span>上下料</span>
          <h2 className="orange">{this.state.UpAndDownMaterialcount}</h2>
        </div>
         <div
          onClick={this.sortDevice.bind(this, "debug")}
          className={this.props.devtype === 'debug'?"data-top active":"data-top"}
        >
          <span>调机中</span>
          <h2 className="blue">{this.state.debugcount}</h2>
        </div>
        <div
          onClick={this.sortDevice.bind(this, "alarm")}
          className={this.props.devtype === 'alarm'?"data-top active":"data-top"}
        >
          <span>报警</span>
          <h2 className="red">{this.state.alarmcount}</h2>
        </div>
        <div
          onClick={this.sortDevice.bind(this, "ToolChangerAlarm")}
          className={this.props.devtype === 'ToolChangerAlarm'?"data-top active":"data-top"}
        >
          <span>换刀报警</span>
          <h2 className="pink">{this.state.ToolChangerAlarmcount}</h2>
        </div>
        <div
          onClick={this.sortDevice.bind(this, "FirstPieceAlarm")}
          className={this.props.devtype === 'FirstPieceAlarm'?"data-top active":"data-top"}
        >
          <span>首件报警</span>
          <h2 className="rose">{this.state.FirstPieceAlarmcount}</h2>
        </div>
        <div
          onClick={this.sortDevice.bind(
            this, "disconnect"
          )}
          className={this.props.devtype === 'disconnect'?"data-top active":"data-top"}
        >
          <span>离线</span>
          <h2 className="rgay">{this.state.disconnectcount}</h2>
        </div>
      </div>
    );
  }
}
