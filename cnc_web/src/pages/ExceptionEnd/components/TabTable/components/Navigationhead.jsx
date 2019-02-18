import React, { Component } from "react";
import IceContainer from "@icedesign/container";
import { Search } from "@icedesign/base";
import {
  DatePicker,
  Pagination,
  Button,
  Icon,
  Field,
  moment,
  Input,
  TreeSelect,
  Select
} from "@icedesign/base";
import DepartmentUtils from '@/utils/DepartmentUtil';
import AxiosHttp from '@/utils/AxiosHttp'
import Devicename from '@/components/Devicename/Devicename'
const { RangePicker } = DatePicker;

export default class Navigationhead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData:[],
      deviceID:"",
      alarmCodes:[],//获取所有的报警码
      alarmCode:''//搜索报警码
    };
    this.field = new Field(this);
  }

  normRange(date, dateStr) {//时间控件
    return date;
  }
  onChange(value) {//部门
    console.log(value );
  }

  handleChange(value, data) {
    // console.log(value, data);
  }
  getAlarmCode=(res)=>{//报警码
    // console.log(res)
    this.setState({alarmCode:res})
  }
  handleSearch(keyword) {
    // console.log(keyword);
  }
  onSearch=( )=>{ //条件搜索
    let val=this.field.getValues()
    let startTime=new Date(val.rangepicker[0]).toLocaleDateString()
    let endtTime=new Date(val.rangepicker[1]).toLocaleDateString()
    endtTime=new Date(endtTime).getTime()+86400000
    startTime=new Date(startTime).getTime() 
    let postVal={
      dev_id:Number(this.refs.myDepartment.getValue()),
      startTime:new Date(startTime).getTime()/1000,
      endTime:new Date(endtTime).getTime()/1000,
      alarmCode:this.state.alarmCode,
      current:1
    }
    this.props.handelSearch(postVal)
  }
  handleSearchCondition=(res)=>{//获取设备id
    this.setState({deviceID:res.dev_id})
  }
  componentWillMount(){
    let department=DepartmentUtils.getDepartmentTree().then((res)=>{//获取部门结构
      this.setState({treeData:res})
    });
    AxiosHttp.get('/alarminfo/alarmcode') //获取所有报警码
    .then(   res=>{
        let codes=['全部'];
        let val=res.value;
        if(val.length){
          for(let i=0;i<val.length;i++){
           let childCode= val[i].data.alarm_code.split(' ');
          childCode.forEach(item=>{
            if(item&&codes.indexOf(item)==-1){
              codes.push(item)
            }
          })
          }
          this.setState({alarmCodes:codes})
        }
      }
    )
    .catch(error => {
    console.log(error);
  });  
  }
  render() {
    const init = this.field.init;

    const now = moment();
    const start = moment().subtract(1, "weeks");
    const quickRanges = {
      今天: [now, now],
      "上一周": [start, now]
    };
    return <div   className='main-con-head'>
          <div style={styles.con}>
            {/* 暂时不做部门查询 */}
            {/* <div style={styles.addbtn}>
              <TreeSelect autoWidth showSearch dataSource={this.state.treeData} onChange={this.handleChange} onSearch={this.handleSearch} style={{ width: 200 }} placeholder="请选择查看部门" />
            </div> */}
            <RangePicker hasClear={false} valueFormatter={(date, str) => { return str; }} onStartChange={(val, str) => console.log(val, str)}  onChange={(val, str) => console.log(val, str)} ranges={quickRanges} {...init("rangepicker", {
                getValueFromEvent: this.normRange,
                initValue: [
                  moment()
                    .subtract(1, "months")
                    .format("YYYY-MM-DD"),
                  moment().format("YYYY-MM-DD")
                ]
              })} />
            <span style={styles.searchBtn}>
              {/* <Search size="medium"  onSearch={this.onSearch} {...init("name", { })}  searchText="搜索"  inputWidth={180} placeholder="设备名称" /> */}
              <Devicename ref='myDepartment'/>
            </span>
            <Select showSearch  dataSource={this.state.alarmCodes} onChange={this.getAlarmCode} style={styles.error} placeholder="请选择报警码" hasClear={true}></Select>
            <Button onClick={this.onSearch}>查询</Button>
          </div>
      </div>;
  }
}

const styles = {
  con:{
    display:'flex',
    alignItems: 'center',
  },
  searchBtn: {
    marginLeft: "40px",
    float:'right'
  },
  addbtn: {
    float: "left",
    marginRight: "40px"
  },
  error:{
    width:'200px',
    marginRight:'30px'
  }
};
