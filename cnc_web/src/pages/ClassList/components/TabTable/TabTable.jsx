import React, { Component } from "react";
import IceContainer from "@icedesign/container";
import CustomTable from "./components/CustomTable";
import { Pagination, Button, Icon, Feedback ,Accordion} from "@icedesign/base";
import EditDialog from "./components/EditDialog";
import AddClass from "./components/AddClass";
import DeletePanel from "./components/DeletePanel";
import PropTypes from "prop-types";
import AxiosHttp from "@/utils/AxiosHttp.js";
const { Panel } = Accordion;
const Toast = Feedback.toast;
export default class TabTable extends Component {
  static displayName = "TabTable";
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      current: 1,
      pageSize: 10,
      list: [], 
      single: false
    };
    
    this.handleChange = this.handleChange.bind(this);
  }
  // 调用子组件的方法
  registerInvokingEvent = ref => {
    this.AddClass = ref;
  };
  handleChange(current) {
    // react 中必须通过 setstate 更新 render才会更新渲染
    this.setState(
      {
        current
      },
      () => {
        // 发起获取数据的请求
        this.getClassList();
      }
    );
  }
  // componentDidMount() {
  //   //当组件挂载时 触发   此生命周期
  //   // 发起获取数据的请求 
  //   this.getClassList(); 
  // }
  
  componentWillMount(){
    this.getClassList();
  }
  // 发起获取数据的请求
  getClassList() {
    AxiosHttp.get("/shift/list/" + this.state.current)
      .then(res => {
        if (res.ok) {
          this.setState({
            list: res.value.rs,
            // total: res.value.total
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  getPanelData=()=>{
    this.getClassList();
  }

  // 接受子组件 修改的通知  更新数据  render
  getFormValues = (dataIndex, values) => {
    this.getClassList();
  };
 
  addClassValues = () => {
    // 发起获取数据的请求
    this.getClassList();
  };
 
  addEvent = () => {
    this.AddClass.onOpen();
  };
 
  render() {
    const shiftArr =this.state.list;
    let items=[];
    return (
      <div className="class-define main-container">
        <IceContainer className="main-con-head ">
          <span>班别管理 &gt; 班别列表</span>
          {/* <span>班别管理</span> > <span>班别列表</span> */}
          <Button style={styles.addbtn} onClick={this.addEvent}>
            <Icon type="add" />添加
          </Button>
          <AddClass
            addClassValues={this.addClassValues}
            registerInvokingEvent={this.registerInvokingEvent}
          />
        </IceContainer>

        <IceContainer className='main-con-body'>
              {shiftArr.map((item,index)=>{
                return (<div key={index}>
                  <CustomTable  shiftArr={item}  getPanelData={this.getPanelData} getFormValues={this.getFormValues}/>
                  </div>
                );
              })}
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  pagination: {
    float: "right",
    marginTop: "26px"
  },
  batchBtn: {
    marginRight: "10px"
  },
  addbtn: {
    float: "right"
  }
};
