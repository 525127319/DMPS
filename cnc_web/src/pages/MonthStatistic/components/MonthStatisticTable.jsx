import React, {Component} from 'react'
import {moment, Table, Pagination} from "@icedesign/base";
import {hashHistory} from 'react-router';
import EquipmentUtil from "@/utils/EquipmentUtil"
import DepartmentStatusUtil from "@/utils/DepartmentStatusUtil"
import DepartmentStatisticUtil from "@/utils/DepartmentStatisticUtil"
import DeviceinfoUtil from '@/utils/DeviceinfoUtil';


export default class DepartmentTable extends Component {
    constructor(props) {
        super(props); 
        this.state = {}

    }
   
    
    onRowClick = (record, index, e) => {

        // console.log(record);
    }

    detiel = (value, index, record) => {
       
        return <span
            className='show-detial'
            onClick={this
            .toDetail
            .bind(this,record)}>{DeviceinfoUtil.getNameByDevId(value)}</span>;
    };

    toDetail = function (record) {
        hashHistory.push({
            pathname: 'realtime/deviceList/deviceDetail/' + record.dev_id,
            state: {
                item: record,
                moduleId: 'monthStatistic'

            }
        })
       
    }.bind(this);

    render() {
        let {departmentData} = this.props;
        let {shift} = this.props;

        const formTime = (value, index, record) => {
            return (
                <span>{(value / 3600).toFixed(2)}</span>
            )
        }
        const formEquimentType=(value, index, record)=>{
            return (
                <span>{EquipmentUtil.getEquipmentUtilLabelById(value)}</span>
            )
        }
        return (
            <div className='dev-table'>
                <ul className='data-list'>
                    <li>
                        <span>工作时长(h)</span>
                        <p>{DepartmentStatisticUtil.parseTime(departmentData.wt)}</p>
                    </li>
                    <li>
                        <span>开机时长(h)</span>
                        <p>{DepartmentStatisticUtil.parseTime(departmentData.rt)}</p>
                    </li>
                    <li>
                        <span>稼动率(%)</span>
                        <p>{departmentData.efficiency||0}</p>
                    </li>
                    <li>
                        <span>报警总数</span>
                        <p>{departmentData.alarm_count||0}</p>
                    </li>
                    <li>
                        <span>报警总时长(h)</span>
                        <p>{DepartmentStatisticUtil.parseTime(departmentData.alarm_duration)}</p>
                    </li>
                     {/* <li>
                        <span>有效产量</span>
                        <p>{departmentData.alarm_count||0}</p>
                    </li>  */}
                    <li>
                        <span>异常加工次数</span>
                        <p style={styles.red}>{departmentData.invalid_count||0}</p>
                    </li>
                    <li>
                        <span>总加工次数</span>
                        <p style={styles.blue}>{departmentData.count||0}</p>

                    </li> 
    
                </ul>
                <Table dataSource={this.props.dataSource} onRowClick={this.onRowClick}>
                    <Table.Column title="设备名称" dataIndex="dev_id" cell={this.detiel}/>
                    {/* <Table.Column title="设备类型" dataIndex="type" cell={formEquimentType}/> */}
                    <Table.Column title="工作时长(h)" dataIndex="wt" cell={formTime}/>
                    <Table.Column title="开机时长(h)" dataIndex="rt" cell={formTime}/>
                    <Table.Column title="稼动率(%)" dataIndex="efficiency"/>
                    <Table.Column title="报警总数" dataIndex="alarm_count"/>
                    <Table.Column title="报警总时长(h)" dataIndex="alarm_duration" cell={formTime}/>
                    <Table.Column title="异常加工次数" dataIndex="invalid_count"/>
                    <Table.Column title="总加工次数" dataIndex="count"/>

                    {/* <Table.Column title="设备详情" cell={this.detiel} /> */}
                </Table>
                <div className='pagination'>
                    <span className='total'>共 {this.props.total} 条</span>
                    <Pagination
                        current={this.props.current}
                        onChange={this.props.handleChange}
                        total={this.props.total}/>
                </div>
            </div>
        )
    }
}


const styles = {
    blue: {
        color: '#0089ff'
    },

    red:{
        color: '#ff4858'
    }
}

