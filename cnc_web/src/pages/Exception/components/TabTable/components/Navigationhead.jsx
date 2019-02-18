import React, { Component } from "react";
import {
  DatePicker,
  Button,
  Field,
  moment,
  Select,
  Icon,
  Breadcrumb
} from "@icedesign/base";
import DeviceinfoUtil from "@/utils/DeviceinfoUtil";
const { RangePicker } = DatePicker;
let devicesId = null;
export default class Navigationhead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      department: '',
      deviceID: "",
      alarmCodes: [],//所有报警码
      alarmCode: '',//搜索单个报警码
      devices: [], //所有设备名称
      device: '',  //搜索单个设备名称
      deviceInfo: [],
    };
    this.field = new Field(this);
  }
  // RangePicker 组件
  normRange = (date, dateStr) => {
    return date
  }

  // 选择部门设备触发搜索
  onOpen = () => {
    // this.onSearch()
    this.get()
  }

  onExport = (value) => {
    this.onSearch('export');
  };

  onSearch = (ctype) => { //搜索
    if ('export' != ctype) ctype = null;
    let val = this.field.getValues()
    let startTime = val.rangepicker[0];
    let endtTime = val.rangepicker[1];
    let postVal = {
      startTime: startTime,
      endTime: endtTime,
      alarmCode: this.state.alarmCode,
      dev_id: this.state.device,
      ctype: ctype,
      current: 1
    }
    this.props.handelSearch(postVal);
    this.get()
  }

  // 查询报警码
  getAlarmCode = (res) => {
    this.setState(
      { alarmCode: res }
    )
  }

  // 查询设备名称
  getdevicename = (res) => {
    // this.get()
    this.setState(
      { device: res }
    )
  }

  componentDidMount() {
    this.get()
  }

  get() {
    // this.props.devicesId 所有的设备名称
    let devicesId = this.props.devicesId;
    DeviceinfoUtil
      .getAllDevice()
      .then(department => {
        let devicesname = []; //设备名称
        let devices_Id = [];  //设备ID
        if (devicesId == 0 && department.size > 0) {
          department.forEach((val, key) => {
            let id = {};
            id.label = val.name;
            id.value = key.toString();
            devicesname.push(id)
          });
          this.setState({
            devices: devicesname
          })
        }
        else if (devicesId && devicesId.length > 0) {
          department.forEach((value, key) => {
            devicesId.forEach((item) => {
              if (item == value.dev_id) {
                let _id = {};
                _id.label = value.name;
                _id.value = key.toString();
                devices_Id.push(_id)
              }
            });
          })
          this.setState({
            devices: devices_Id
          })
        }
      });

    // this.props.alarmCodes 所有的设备报警码
    let Arraytoheavy = this.props.alarmCodes;
    let Thenewarray = []
    if (Arraytoheavy && Arraytoheavy.length !== undefined) {
      for (let i = 0; i < Arraytoheavy.length; i++) {
        for (let j = i + 1; j < Arraytoheavy.length; j++) {
          if (Arraytoheavy[i] === Arraytoheavy[j]) {
            j = ++i;
          }
        }
        Thenewarray.push(Arraytoheavy[i]);
      }
      console.log(Thenewarray, 'Thenewarray');
      this.setState({
        alarmCodes: Thenewarray
      })
    }
  }

  render() {
    const init = this.field.init;
    const now = moment();
    const start = moment().subtract(1, "weeks");
    const quickRanges = {
      今天: [now, now],
      "上一周": [start, now]
    };
    return <div
      className='main-con-head'
    >
      {/* 面包屑↓ */}
      <div className="head-title">
        <Breadcrumb separator="/">
          <Breadcrumb.Item >报警统计</Breadcrumb.Item>
          <Breadcrumb.Item >报警详情</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div style={styles.con}>
        {/* 暂时不做部门查询 */}
        {/* <div style={styles.addbtn} >
              <TreeSelect autoWidth showSearch dataSource={this.state.treeData} onChange={this.handleChange} onSearch={this.handleSearch} style={{ width: 200 }} placeholder="请选择查看部门" />
            </div> */}
        <RangePicker hasClear={false} ranges={quickRanges} {...init("rangepicker", {
          getValueFromEvent: this.normRange,
          initValue: [
            moment()
              .subtract(1, "months")
              .format("YYYY-MM-DD"),
            moment().format("YYYY-MM-DD")
          ]
        })} />
        <span style={styles.searchBtn}>
          {/* <Devicename ref="myDepartment"/> */}
        </span>
        <Select showSearch hasClear dataSource={this.state.devices} onChange={this.getdevicename} onOpen={this.onOpen} style={styles.error} placeholder="请选择设备"></Select>
        <Select showSearch hasClear dataSource={this.state.alarmCodes} onChange={this.getAlarmCode} onOpen={this.onOpen} style={styles.error} placeholder="请选择报警码"  ></Select>
        <Button onClick={this.onSearch}>查询</Button>
        <Button style={styles.btn} onClick={this.onExport.bind(this)}>导出</Button>
      </div>

    </div>;
  }
}

const styles = {
  con: {
    display: 'flex',
    alignItems: 'center',
  },
  searchBtn: {
    marginLeft: "40px",
    float: 'right'
  },
  addbtn: {
    float: "left",
    marginRight: "40px"
  },
  error: {
    width: '200px',
    marginRight: '30px'
  },
  btn: {
    marginLeft: '40px'
  },

};
