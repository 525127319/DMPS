import React, {Component} from "react";
import IceContainer from "@icedesign/container";
import {
  DatePicker,
  Pagination,
  Button,
  Icon,
  Field,
  Table,
  moment
} from "@icedesign/base";
import Navigationhead from "./components/Navigationhead";
import AxiosHttp from '../../../../utils/AxiosHttp'
import DevicetypeUtils from "@/utils/DevicetypeUtil";
import DeviceinfoUtils from "@/utils/DeviceinfoUtil";
import PeopleUtils from "@/utils/PeopleUtil";
 
import Loadings from '@/components/Loadings/Loadings' 
 
import EquipmentUtil from "@/utils/EquipmentUtil"
export default class TabTable extends Component {
  static displayName = "TabTable";
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      pageSize: 10,
      dataSource: [],
      lang: "zh-cn",
      hadSearch: true,
      data: {
        current: 1,
        startTime:'',
        endTime:'',
        dev_id:'',
        alarmCoded:''
      },
      show : true
    };
  }
  handleChange = (current) => { //分页
    this.setState({
      data: {...this.state.data, current: current}
    }, () => {
      this.getdata()
    });

  }
  
  getdata = () => {// 发送请求的
    AxiosHttp
      .post('/alarminfo/searchdeal', this.state.data)
      .then(this.handleResponse)
      .catch(error => {
        console.log(error);
      })
  }


  handelSearch = (postval) => { //条件搜索
    this.setState({data: postval},()=>{ this.getdata()})
  }
  handleResponse = (response) => {
    let resData = response.value.rs;
    this.setState({total:response.total})
    let deviceInfo = JSON.parse(window.localStorage.getItem('deviceinfo'))
    resData.forEach(item => {
      deviceInfo.find(n => {
        if (n.dev_id == item.dev_id) {
          item.name = n.name
          item.device_type = n.type
          item.responsibility_by = n.responsibility_by
        }
      })
    })
    this.setState({dataSource: resData, total: response.value.total});
  };
  componentWillMount() {
    this.getdata()
  }
  render() {
    moment.locale(this.state.lang);
    const formTime = (value, index, record) => {
      return (
        <span>{moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
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
        {/* <Navigationhead searchField={this.state.searchField} handleResponse={(res)=>this.handleResponse(res)} /> */}
        <Navigationhead
          searchField={this.state.searchField}
          handelSearch={(data) => this.handelSearch(data)}/>
        <IceContainer className='main-con-body'>
                    {/* 加载的loading */}
                    {/* <Loadings  show={this.state.show}/>  */}
          <Table dataSource={this.state.dataSource}>
            <Table.Column title={'设备名称'} dataIndex='name'/>
            {/* <Table.Column title={'设备类型'} dataIndex='device_type' cell={formatDevicetype}/> */}
            <Table.Column title={'责任人'} dataIndex='responsibility_by' cell={formatResponsibilityBy}/>
            <Table.Column title={'报警时间'} dataIndex='time' cell={formTime}/>
            <Table.Column title={'报警码'} dataIndex='data.alarm_code'/>
            <Table.Column title={'报警程序'} dataIndex='data.prog_name'/>
            <Table.Column title={'报警描述'} dataIndex='data.alarm_msg'/>
            <Table.Column title={'处理描述'} dataIndex='desc'/>
            <Table.Column title={'报警处理时间'} dataIndex='fix_time' cell={formTime}/>
            <Table.Column title={'处理人'} dataIndex='fix_man' cell={formatResponsibilityBy}/>
          </Table>
          <div className='pagination'>
            <span  className='total'>共 {this.state.total} 条</span>
            <Pagination
              total={this.state.total}
              current={this.state.data.current}
              onChange={this.handleChange}
              pageSize={this.state.pageSize}/>
          </div>
        </IceContainer>
      </div>
    );
  }
}

 
