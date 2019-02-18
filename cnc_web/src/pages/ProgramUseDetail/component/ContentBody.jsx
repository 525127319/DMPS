import React , { Component} from 'react'
import { Table, Button,Dialog, Icon, Moment} from "@icedesign/base";
import './ContentBody.scss'
import AxiosHttp from "@/utils/AxiosHttp";
import TimeUtil from "@/utils/TimeUtil";
import DayProgramDetail from './DayProgramDetail';


export default class ContentBody extends Component{
  static displayName = 'ContentBody';
    constructor(props){
        super(props)
    }

    renderOperator = (value, index, record) => {
        return (
            <span style={styles.colorstyle}>
                <DayProgramDetail time={record.time} _searchDay={this.props.searchDay} programName={record.prog_name} deviceCount = {value}/>
            </span>   
        );
    };

    render(){
        let {_dayProgramData,_total} = this.props;
        //格式化时间
        const formatTime = (value) => {
            return (
                <span>{TimeUtil.formatDate(value)}</span>
            )   
        }
        return(
          <div className='main-body'>
            <Table dataSource={_dayProgramData}  >
                <Table.Column title="程序名" dataIndex="prog_name" />
                <Table.Column title="当天时间" dataIndex="time" cell={formatTime}/>
                <Table.Column title="最大CT（s）" dataIndex="data.max_ct" />
                <Table.Column title="最小CT（s）" dataIndex="data.min_ct" />
                <Table.Column title="平均CT（s）" dataIndex="data.avg_ct" />
                <Table.Column title="总加工次数" dataIndex="data.count" />
                <Table.Column title="使用设备" cell={this.renderOperator} dataIndex="deviceCount" />
                {/* <Table.Column title="操作"   cell={this.renderOperator}/> */}
            </Table>
          </div>
        )
    }
}
const styles = {
    colorstyle: {
        color: "#2a64e8",
        cursor: 'pointer'
    }
}
