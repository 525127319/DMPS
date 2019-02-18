import React , { Component} from 'react'
import ContentBody from './component/ContentBody.jsx'
import {Pagination,Input,Moment,Feedback} from "@icedesign/base"
import ContentHead from './component/ContentHead.jsx'
import AxiosHttp from "@/utils/AxiosHttp";
import IceContainer from '@icedesign/container';
import { Loading } from "@icedesign/base";
import TimeUtil from '@/utils/TimeUtil';
const Toast = Feedback.toast;
let defaultDay = TimeUtil.getCurDate('YYYY-MM-DD')

import DepartmentUtil from '@/utils/DepartmentUtil.js';
import Store from '@/redux/Store';
let departmentId = 'root';
let listener = null, isLestener = false;

if (!isLestener)
  listener = Store.subscribe(DepartmentUtil.changeDepartment);

export default class ProgramUseDetail extends Component{
    static defaultProps = {
        pageSize: 10
    };
    constructor(props) {
        super(props);
        // this.param = {pageIndex: 1};//当前页
        this.state = {
            dayProgramData:[],
            total: 0,//总条数
            keyWords:"",
            current: 1,
            day:defaultDay,
            department:"",
            flag: true,  //加载
        } 
    }
  
    //发请求获取当天历史程序数据
    getDayHistoryProgram(){
         console.log(this.state.day,'this.state.day');
        if (this.state.day =="" && this.state.keyWords=="") {
            Toast.error("请输入日期或程序名称");
            return;  
        }
        let data ={
            // day:this.state.day==""?this.state.day:(new Date(this.state.day).getTime()/1000-28800),
            day:this.state.day,
            pageIndex:this.state.current,
            keyWords:this.state.keyWords,
            department: departmentId
        }
        AxiosHttp.post("/alldevprogct/getDayHistoryProgram",data)
        .then(this.handleResponse)
        .catch(error => {
          console.log(error);
        });  
    }
  
    handleResponse = (res)=> {

        this.setState({
            dayProgramData: res.value.rs,
            total: res.value.total
        });
    };

     //分页
     handleChange=(pageIndex) =>{
       // react 中必须通过 setstate 更新 render才会更新渲染
       this.setState({
            current:pageIndex
       },()=>{
        this.getDayHistoryProgram();
       })
       
   }
  
    componentDidMount() {
        this.getDayHistoryProgram();
    }

    getSearchValue = (resData,day) => {
        console.log(resData,day,'resData')
        let newDay ="";
        if(day){
            newDay =day;
        }else{
            newDay =newDay;
        }
        let keyWord="";
        if(resData){
            keyWord=resData
        }else{
            keyWord=keyWord
        }
        this.setState(
            {
                day:newDay,
                keyWords: keyWord,
                current:1
            }, 
        () => {
            this.getDayHistoryProgram();
            //this.getDptData()
        });
    };

    getDepartment = (val) => { //获取到部门信息  
        this.setState({
          department: val
        }, () => {
          this.getDptData()
        })
      }
    
      //根据部门，获取设备信息
      getDptData = () => {
        this.setState({
            flag:true
        })
        AxiosHttp
          .post('/getDepartmentDevice/getDptData', { 'department': this.state.department })
          .then(this.handleData.bind(this))
          .catch(error => {
            console.log(error)
          })
      }
    
      handleData = (response) => {
        let department = [] //所有设备ID
        if (response.value.length > 0) {
          response
            .value
            .forEach(item => {
                department.push(item.department);
            })
          this.setState({
            department: department,
            flag:false
          }, () => {
              this.getDayHistoryProgram();
            
            //   this.getdata();
    
          })
        } else {
        }
      }

       //瀉染完後，在後臺整合數據
  componentDidMount() {
    this.getDepartment(departmentId);
    listener = Store.subscribe(this.changeDepartment.bind(this));
  }

//   componentWillMount(){
//     sessionStorage.removeItem('flag');
//     sessionStorage.removeItem('deviceList');
//     sessionStorage.removeItem('day');
//     sessionStorage.removeItem('week')
//     sessionStorage.removeItem('month')
//     sessionStorage.removeItem('quarter');
//     sessionStorage.removeItem('year');
//     sessionStorage.removeItem('alarm');
//   }

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

    render(){
        return (
            <div className="main-content main-container">
                <ContentHead  getSearchValue={this.getSearchValue} />
                <IceContainer className='main-con-body'>
                <Loading 
                    shape="fusion-reactor"
                    color="#ccc"
                    visible = {this.state.flag}
                     >
                    <ContentBody _dayProgramData={this.state.dayProgramData} searchDay ={this.state.day} />
                    <div className='pagination'>
                         <span className='total'>共 {this.state.total} 条</span>
                        <Pagination   
                        current={this.state.current}
                        total={this.state.total}
                        pageSize={this.props.pageSize}
                        onChange={this.handleChange} />
                    </div>
                    </Loading>
               </IceContainer>
            </div>
        )
    }
}

 