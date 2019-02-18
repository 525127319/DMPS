import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import Status from './DeviceBasisInfo';
import { Button, Icon,Table ,Pagination,Moment} from "@icedesign/base";
import {evn} from '../../../../utils/Config';
import AxiosHttp from "../../../../utils/AxiosHttp";
import HandlingAbnormality from "./HandlingAbnormality";
import PeopleUtils from "@/utils/PeopleUtil";
import ShiftUtil from "@/utils/ShiftUtil";
import TimeUtil from '../../../../utils/TimeUtil';

export default class HistoryAlarms extends Component {
    static displayName = 'HistoryAlarms';
    static defaultProps = {
        //本界面的默认配置，会合并到props里，但这里的属性为只读
        pageSize: 10
    };
    constructor(props) {
        super(props);
        this.param = {pageIndex: 1}//当前页
        this.state = {
            historyAlarmsData:[],
            total:0,//总条数
            num:1,
        }
    }

     //发请求获取历史警报数据
      getHistoryAlarms(){
        AxiosHttp.get("/alarmInfo/getHistoryAlarms/"+this.props.devID+"/"+this.param.pageIndex)
        .then(this.handleResponse)
        .catch(error => {
          console.log(error);
        }); 
      }

      handleResponse =(res)=>{
        this.setState({
            //更主狀態，必須通這此方法，這樣react才能監聽到，重新調用render方法。
            historyAlarmsData: res.value.rs,
            total: res.value.total
        });
      }

      //分页
      handleChange =(pageIndex)=>{
        this.param.pageIndex = pageIndex;
        this.getHistoryAlarms();
      }
      
    componentDidMount() {
        this.getHistoryAlarms();
     }
    
    getFormValues = (dataIndex, values) => {
        const {historyAlarmsData} = this.state;
        historyAlarmsData[dataIndex] = values;
        this.setState({historyAlarmsData});
        // console.log(values)
    };
    
    handelUpdate() {
        this.getHistoryAlarms()
    }

    componentWillMount(){
        ShiftUtil.getShift().then(res=>{
        })
    }

     
    render(){
        //处理状态渲染界面
        // const formatStatus =(value) =>{
        //     if(value === 0){
        //         return(
        //             <span>未处理</span>
        //         )
        //     }else{
        //         return (
        //             <span>已处理</span>
        //         )
        //     }
        // }

        const formatFixMan =(value,index,record) =>{
            if(value){
                return(
                    <span>{PeopleUtils.getPeopleById(value)}</span>
                )
            }else{
                return (
                    <span>无</span>
                )
            }
        }

        const formatDesc =(value) =>{
            if(value){
                return(
                    <span>{value}</span>
                )
            }else{
                return (
                    <span>无</span>
                )
            }
        }

        const formatFixTime =(value) =>{
            if(value){
                return(
                    <span>{Moment(value*1000).format('YYYY-MM-DD HH:mm:ss')}</span>
                )
            }else{
                return (
                    <span>无</span>
                )
            }
        }

        //格式化时间
        const formatTime = (value) => {
            return (
                // <span>{Moment(value*1000).format('YYYY-MM-DD HH:mm:ss')}</span>
                //<span>{ShiftUtil.updateDate2ShiftDateTime(value)}</span>      
                <span>{TimeUtil.format(value)}</span>             
            )
            
            
        }

        const HandelAlarm = (value, index, record) => {
            if(value==0){
                return (
                    <span>
                      <HandlingAbnormality
                        handelUpdate={(response) => this.handelUpdate(response)}
                        index={index}
                        record={record}
                        getFormValues={this.getFormValues}/>
                    </span>
                  )
            }else{
                return <span>已处理</span>
            }
  
        }
        return(
            <div>
                <IceContainer>
                    <p>历史报警</p>
                    <Table dataSource={this.state.historyAlarmsData}  maxBodyHeight={100} >
                        {/* <Table.Column title="序号"  cell={formatType}/> */}
                        <Table.Column title="报警码" dataIndex="data.alarm_code" style={styles.public}/>
                        <Table.Column title="报警时间" dataIndex="time" cell={formatTime} style={styles.public}/>
                        <Table.Column title="报警内容描述" dataIndex="data.alarm_msg"/>
                        <Table.Column title="报警程序" dataIndex="data.prog_name"/>
                        {/* <Table.Column title="状态" dataIndex="status" cell={formatStatus}/> */}
                        {/* <Table.Column title="处理人" dataIndex="fix_man" cell={formatFixMan}/> */}
                        {/* <Table.Column title="处理描述" dataIndex="desc" cell={formatDesc}/> */}
                        {/* <Table.Column title="报警处理时间" dataIndex="fix_time" cell={formatFixTime}/> */}
                        {/* <Table.Column title="操作" dataIndex="status" cell={HandelAlarm}/> */}
                    </Table>
                    <div className='pagination'>
                            <span  className='total'>共 {this.state.total} 条</span>
                        <Pagination
                            size="small"
                            total={this.state.total}
                            pageSize={this.props.pageSize}
                            onChange={this.handleChange}
                            />
                     </div>
                </IceContainer>
            </div>
        )
    }
}
const styles = {
 
    public:{
        cursor:"auto",
    }
}