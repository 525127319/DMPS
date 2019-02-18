import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import {Table ,Pagination,Moment} from "@icedesign/base";
import AxiosHttp from "@/utils/AxiosHttp";
import TimeUtil from "@/utils/TimeUtil";
import ShiftUtil from "@/utils/ShiftUtil";
import DayProductShiftDetail from './DayProductShiftDetail';

export default class DayProduct extends Component {
    static displayName = 'DayProduct';
    static defaultProps = {
        //本界面的默认配置，会合并到props里，但这里的属性为只读
        pageSize: 10
    };
    constructor(props) {

        super(props);
        this.param = {pageIndex: 1}//当前页
        this.state = {
            dayProductData:[],//日产量
            total:0,//总条数
        }
    }
    componentWillMount(){
        ShiftUtil.getShift().then(res=>{
        })
    }

     //发请求获取日产量数据
     getDataList(){
        AxiosHttp.get("/dayStatistic/getDayProduct/"+this.props.devID+"/"+this.param.pageIndex)
        .then(this.handleResponse)
        .catch(error => {
          console.log(error);
        });
      }

      handleResponse=(res)=>{
        this.setState({
            dayProductData: res.value.rs,
            total: res.value.total
        });
      }
      //日产量分页
      handleChange=(pageIndex)=>{
        this.param.pageIndex = pageIndex;
        this.getDataList();
      }
      
      componentDidMount() {
        this.getDataList(); 
     }

     updateDate(){
        Moment(value*1000).format('YYYY-MM-DD')
     }

     renderOperator = (value, index, record) => {
        return (
            <div>
                {/* <DayProductDetail id={record._id}/> */}
                <DayProductShiftDetail id={record.dev_id} time={record.time}/>
            </div>   
        );
    };
 
    render(){
        const formatDatetime = (value) => {
            return (
                <span>{//Moment(value*1000).format('YYYY-MM-DD')
                   
                    ShiftUtil.updateDate2ShiftDate(value)
                    
                }</span>
            )
        }
         const formatWt = (value) => {
            return (
                <span>{TimeUtil.hour2Minute(value)}</span>
            )
        }
        const formatRt = (value) => {
            return (
                <span>{TimeUtil.hour2Minute(value)}</span>
            )
        }
        return(
            <div>
                <IceContainer>
                    <p>每日运行情况</p>
                    <Table dataSource={this.state.dayProductData}   maxBodyHeight={100}>
                        <Table.Column title="日期" dataIndex="time" cell={formatDatetime} style={styles.public}/>
                        <Table.Column title="工作时长(h)" dataIndex="data.wt"  cell={formatWt} style={styles.public}/>
                        <Table.Column title="开机时长(h)" dataIndex="data.rt" cell={formatRt}/>
                        <Table.Column title=" 稼动率(%)" dataIndex="data.efficiency" />
                        <Table.Column title="操作"  cell={this.renderOperator}/>
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