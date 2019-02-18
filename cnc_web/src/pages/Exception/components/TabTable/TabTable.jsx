import React, { Component } from "react";
import {hashHistory } from 'react-router';
import IceContainer from "@icedesign/container";
import {Pagination,Table,moment,Loading,Feedback} from "@icedesign/base";
import Navigationhead from "./components/Navigationhead";
import HandlingAbnormality from "./components/HandlingAbnormality";
import AxiosHttp from "../../../../utils/AxiosHttp.js";
import EquipmentUtil from "@/utils/EquipmentUtil"
import PeopleUtils from "@/utils/PeopleUtil";
import TimeUtils from "@/utils/TimeUtil";
import ShiftUtil from "@/utils/ShiftUtil";
import DepartmentUtil from '@/utils/DepartmentUtil.js';
import Store from '@/redux/Store';
import DeviceinfoUtil from '@/utils/DeviceinfoUtil';

let departmentId = 'root';
let listener = null, isLestener = false;
const Toast = Feedback.toast;
if (!isLestener)
  listener = Store.subscribe(DepartmentUtil.changeDepartment);
export default class TabTable extends Component {
  static displayName = "TabTable";
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      dataSource: [],
      devices: [],
      devicesId: [],
      lang: "zh-cn",
      total: 0,//数据总条数
      data: {
        current: 1,
        startTime: '',
        endTime: '',
        dev_id: '',
        alarmCode: '',
        alarmCodes: '',
        ctype:"",
      },
      show: false,
      flag: true, // 加载
    };

    this.handleChange = this.handleChange.bind(this);
    departmentId = DepartmentUtil.changeDepartment();
  }

  getDepartment = (val) => { //获取到部门信息  
    this.setState({
      department: val,
    }, () => {
      this.getDptData()
    })
  }

  //根据部门，获取设备信息
  getDptData = () => {
    this.setState({
      flag: true, // 加载
  })
    AxiosHttp
      .post('/getDepartmentDevice/getDptData', { 'department': this.state.department })
      .then(this.handleData.bind(this))
      .catch(error => {
        console.log(error)
      })
  }

  handleData = (response) => {
    let devices = [] //所有设备ID
    let deviceName = []  //所有设备ID
    if (response.value.length > 0) {
      response
        .value
        .forEach(item => {
          devices.push(item.dev_id.toString());
          deviceName.push(item.dev_id.toString());
        })
      this.setState({
        devices: devices,
        devicesId: deviceName,
        
      }, () => {

        if (this.props.alaCode) {
          this.getCodeList();
        } else {
          this.getdata();
        }
      })
    }
    if(response.ok == 0){
      this.setState({
          flag:false
      })
    }
  }

  getCodeList() {
    this.setState({
      data: {
        current: 1,
        startTime: '',
        endTime: '',
        dev_id: this.state.devices,
        alarmCode: this.props.alaCode,
        // department:departmentId
      }
    }, () => {
      this.getdata();
    })
  }

  // 接受子组件 修改的通知  更新数据  render
  getFormValues = (dataIndex, values) => {
    const { dataSource } = this.state;
    dataSource[dataIndex] = values;
    this.setState({ dataSource });
  };
  getSearchFile = (file) => {
    this.setState({ searchFiel: file })
  }
  getdata = () => {
  //   this.setState({
  //     flag:true
  // })
  if(this.state.data.ctype=='export'){
    this.setState({
      show: true,
  })
    AxiosHttp
    .exportExcel('/alarminfo/search', this.state.data, TimeUtils.formatDateByFormat(this.state.data.startTime,TimeUtils.format3) + '至' +  TimeUtils.formatDateByFormat(this.state.data.endTime,TimeUtils.format3) + '异常信息')
    .then(res=>{
      if(res == 0){
        Toast.error('导出数据量太大，请过滤条件后重试')
        this.setState({
          show: false,
      })
      }else{
        Toast.success('下载成功' )
        this.setState({
          show: false,
      })
      }
      this.setState({ flag:false})
      
    })
    .catch(error => {
      this.setState({ flag:false})
      Toast.error('导出数据量太大，请过滤条件后重试')
      console.log(error);
    })
  
  }else{
    AxiosHttp
    .post('/alarminfo/search', this.state.data)
    .then(this.handleResponse)
    .catch(error => {
      console.log(error);
    })
  }
  
  }

  handleChange = (current) => { //分页当前页面
    this.state.data.ctype=null;
    this.setState({
      data: {
        ...this.state.data,
        current: current
      },
      flag:true
    }, () => {
      this.getdata()
    });

  };

  handleResponse = (response) => {
    let resData = response.value.rs;
    this.setState({ total: response.total, })
    let deviceInfo = JSON.parse(window.localStorage.getItem('deviceinfo'))

    let alarmCode = []; //所有的报警码
    resData.forEach(item => {
      alarmCode.push(item.data.alarm_code)
      deviceInfo.find(n => {
        if (n.dev_id == item.dev_id) {
          item.name = n.name
          item.device_type = n.type
          item.responsibility_by = n.responsibility_by
          item.conn = n.conn
        }
      })
    })
    this.setState({ dataSource: resData, total: response.value.total,alarmCodes: alarmCode });
    if(this.state.dataSource.length>0){
      this.setState({
        flag:false
      })
    }
    if(response.ok == 0){
      this.setState({
        flag:false
      }) 
    }

  };

  handelSearch = (postval) => { //条件搜索
    this.setState({
      flag:true
    }) 
    if (postval.dev_id === '' || postval.dev_id == null) {
      postval.dev_id = this.state.devicesId;
    } else if (postval.dev_id !== '') {
      postval.dev_id = postval.dev_id
    }
    this.setState({
      data: postval
    }, () => {
      this.getdata()
    })
   
  }

  handelUpdate() {
    this.getdata()
  }
  //瀉染完後，在後臺整合數據
  componentDidMount() {
    this.getDepartment(departmentId);
    listener = Store.subscribe(this.changeDepartment.bind(this));
  }
  changeDepartment = () => {
    let state = Store.getState();
    departmentId = state.departmentId
    this.getDepartment(departmentId);
  }
  componentWillUnmount() {
    if (listener) {
      listener()
    }
  }
  devicename = (value, index, record) => {
    return <span
      style={styles.devicecollor}
      onClick={this
        .toDetail
        .bind(this, record)}>{value}</span>;
  };

  toDetail = function (record) {
    hashHistory.push({
      pathname: 'realtime/deviceList/deviceDetail/' + record.dev_id,
      state: {
        item: record,
        moduleId: 'exceptionList'
      }
    })
  }.bind(this);

 

  render() {
    moment.locale(this.state.lang);
    const HandelAlarm = (value, index, record) => {
      return (
        <span>
          <HandlingAbnormality
            handelUpdate={(response) => this.handelUpdate(response)}
            index={index}
            record={record}
            getFormValues={this.getFormValues} />
        </span>
      );
    }
    const formTime = (value, index, record) => {
      return (
        //<span>{ShiftUtil.updateDate2ShiftDateTime(value)}</span>  
        <span>{TimeUtils.format(value)}</span> 
      )
    }

    const formatDevicetype = (value, index, record) => {
      return (
        <span>{EquipmentUtil.getEquipmentUtilLabelById(value)}</span>
      )
    }
    const formatResponsibilityBy = (value, index, record) => {
      return (
        <span>{PeopleUtils.getPeopleById(value)}</span>
      )
    }
    return (
      <div className="tab-table main-container">
        <Navigationhead
          alarmCodes={this.state.alarmCodes}
          devicesId={this.state.devicesId}
          handelSearch={(data) => this.handelSearch(data)} />
        <IceContainer className='main-con-body'>
        <Loading 
            color="#ccc"
            shape="fusion-reactor"
            visible = {this.state.flag}
          >
          <Table dataSource={this.state.dataSource}>
            <Table.Column title={'设备名称'} dataIndex='name' cell={this.devicename} />
            {/* <Table.Column title={'设备类型'} dataIndex='device_type' cell={formatDevicetype}/> */}
            {/* <Table.Column
              title={'责任人'}
              dataIndex='responsibility_by'
              cell={formatResponsibilityBy}/> */}
            <Table.Column title={'报警时间'} dataIndex='time' cell={formTime} />
            <Table.Column title={'报警码'} dataIndex='data.alarm_code' />
            <Table.Column title={'报警程序'} dataIndex='data.prog_name' />
            <Table.Column title={'报警描述'} dataIndex='data.alarm_msg' />
            {/* <Table.Column title={'操作'} cell={HandelAlarm} style={{display:"none"}}/> */}
          </Table>
          <div className='pagination'>
            <span className='total'>共 {this.state.total} 条</span>
            <Pagination
              style={styles.pagination}
              total={this.state.total}
              current={this.state.data.current}
              onChange={this.handleChange}
              pageSize={this.state.pageSize} />
          </div>
        </Loading>
        <div className="load" style={{display: this.state.show ? "block" : "none"}}>
                        导出中,请稍等<i>...</i>
                    </div>
        </IceContainer>
      </div>
    );
  }
}

const styles = {

  batchBtn: {
    marginRight: "10px"
  },
  addbtn: {
    float: "right"
  },
  devicecollor: {
    color: "rgb(42, 100, 232)",
    cursor: "pointer",
  }
};
