import React, { Component } from "react";
import IceContainer from "@icedesign/container";
import CustomTable from "./components/CustomTable";
import { Pagination, Button, Icon, Feedback ,Accordion} from "@icedesign/base";
import PropTypes from "prop-types";
import AxiosHttp from "@/utils/AxiosHttp.js";
const { Panel } = Accordion;
const Toast = Feedback.toast;
export default class TabTable extends Component {
  static displayName = "TabTable";
  constructor(props) {
    super(props);
    this.state = {
      cutterName:{center:'总仓',branch:'分仓'},
      CutterAutoReport:{
          center:[    //总仓报表    0
            {
                trigger:'08:00',        //触发时间
                start:'20:00',          //开始时间
                end:'08:00'        //结束时间
            },
            {
                trigger:'20:00',        //触发时间
                start:'08:00',          //开始时间
                end:'20:00'             //结束时间
            }
          ],
        branch:[ //分仓报表     1
          {
              trigger:'03:00',        //触发时间
              start:'09:00',          //开始时间
              end:'15:00'             //结束时间
          },
          {
              trigger:'09:00',        //触发时间
              start:'15:00',          //开始时间
              end:'21:00'             //结束时间
          },
          {
              trigger:'15:00',        //触发时间
              start:'21:00',          //开始时间
              end:'03:00'             //结束时间
          },
          {
              trigger:'21:00',        //触发时间
              start:'03:00',          //开始时间
              end:'09:00'             //结束时间
          }
        ],
       
      }  
     
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
    // this.getClassList();
  }
  // 发起获取数据的请求
  // getClassList() {
  //   AxiosHttp.get("/shift/list/" + this.state.current)
  //     .then(res => {
  //       if (res.ok) {
  //         this.setState({
  //           list: res.value.rs,
  //           // total: res.value.total
  //         });
  //       }
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // }
  getPanelData=()=>{
    // this.getClassList();
  }

  // 接受子组件 修改的通知  更新数据  render
  getFormValues = (dataIndex, values) => {
    // this.getClassList();
  };
 
  addClassValues = () => {
    // 发起获取数据的请求
    // this.getClassList();
  };
 
  addEvent = () => {
    this.AddClass.onOpen();
  };
  
  render() {
    const cutterArr =this.state.CutterAutoReport;
    const cutterName =this.state.cutterName;
    return (
      <div className="class-define main-container">
        <IceContainer className="main-con-head ">
          <span>刀具管理 &gt; 刀具列表</span>
        </IceContainer>

        <IceContainer className='main-con-body'>
              {Object.keys(cutterArr).map(key =>{
                  return (<div key={key}>
                    <CustomTable  cutter={cutterArr[key]} keys={key} cutterName={cutterName} />
                  </div>
                  )
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
