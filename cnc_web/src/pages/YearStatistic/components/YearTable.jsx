import React, { Component } from 'react'
import { Router, Route, hashHistory } from 'react-router';
import { Table, Pagination } from "@icedesign/base";
import IceContainer from "@icedesign/container";
import DeviceinfoUtil from '@/utils/DeviceinfoUtil';
import DepartmentStatusUtil from "@/utils/DepartmentStatusUtil";
import DepartmentStatisticUtil from "@/utils/DepartmentStatisticUtil";


export default class YearTable extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    // 设备名称转换
    devicename = (value, index, record) => {
        return <span
            style={styles.devicecollor}
            onClick={this
                .toDetail
                .bind(this, record)}>{DeviceinfoUtil.getNameByDevId(value)}</span>;
    };

    // 跳转实时数据详情页
    toDetail = function (record) {
        // sessionStorage.setItem('year',true);
        // sessionStorage.removeItem('flag');
        // sessionStorage.removeItem('day');
        // sessionStorage.removeItem('week')
        // sessionStorage.removeItem('month')
        // sessionStorage.removeItem('quarter');
        // sessionStorage.removeItem('deviceList');
        // sessionStorage.removeItem('alarm');
        hashHistory.push({
            pathname: 'realtime/deviceList/deviceDetail/' + record.dev_id,
            state: {
                item: record,
                moduleId: 'yearStatistic'

            }
        })
       
    }.bind(this);

    // 时长转换
    formTime = (value, index, record) => {
        return (
            <span>{(value / 3600).toFixed(2)}</span>
        )
    }

    // componentWillMount(){
    //     sessionStorage.removeItem('flag');
    //     sessionStorage.removeItem('deviceList');
    //     sessionStorage.removeItem('day');
    //     sessionStorage.removeItem('week')
    //     sessionStorage.removeItem('month')
    //     sessionStorage.removeItem('quarter');
    //     sessionStorage.removeItem('year');
    //     sessionStorage.removeItem('alarm');
    // }

    render() {
        let { yearpartmentdata } = this.props;
        let { shift } = this.props;

        if (yearpartmentdata && yearpartmentdata.children) {
            yearpartmentdata = DepartmentStatusUtil.matchByShiftId(yearpartmentdata, shift);
        }

        return (
            <div className='dev-table'>
                <ul className='data-list'>
                    <li>
                        <span>工作时长(h)</span>
                        <p>{DepartmentStatisticUtil.parseTime(yearpartmentdata.wt)}</p>
                    </li>
                    <li>
                        <span>开机时长(h)</span>
                        <p>{DepartmentStatisticUtil.parseTime(yearpartmentdata.rt)}</p>
                    </li>
                    <li>
                        <span>稼动率(%)</span>
                        <p>{yearpartmentdata.efficiency || 0}</p>
                    </li>
                    <li>
                        <span>报警总数</span>
                        <p>{yearpartmentdata.alarm_count || 0}</p>
                    </li>
                    <li>
                        <span>报警总时长(h)</span>
                        <p>{DepartmentStatisticUtil.parseTime(yearpartmentdata.alarm_duration)}</p>
                    </li>
                    <li>
                        <span>异常加工次数</span>
                        <p style={styles.red}>{yearpartmentdata.invalid_count || 0}</p>
                    </li>
                    <li>
                        <span>总加工次数</span>
                        <p style={styles.blue}>{yearpartmentdata.count || 0}</p>

                    </li>

                </ul>
                <IceContainer>
                    <Table dataSource={this.props.dataSource}>
                        <Table.Column title={'设备名称'} dataIndex='dev_id' cell={this.devicename} />
                        <Table.Column title={'工作时长(h)'} dataIndex='wt' cell={this.formTime} />
                        <Table.Column title={'开机时长(h)'} dataIndex='rt' cell={this.formTime} />
                        <Table.Column title={'稼动率(%)'} dataIndex='efficiency' />
                        <Table.Column title={'报警总数'} dataIndex='alarm_count' />
                        <Table.Column title={'报警总时长(h)'} dataIndex='alarm_duration' cell={this.formTime} />
                        <Table.Column title="异常加工次数" dataIndex="invalid_count" />
                        <Table.Column title="总加工次数" dataIndex="count" />
                    </Table>

                    <div className='pagination'>
                        <span className='total'>共 {this.props.total} 条</span>
                        <Pagination
                            current={this.props.current}
                            onChange={this.props.handleChange}
                            total={this.props.total}
                        />
                    </div>
                </IceContainer>
            </div>
        )
    }
}
const styles = {
    devicecollor: {
        color: "rgb(42, 100, 232)",
        cursor: "pointer",
    },
    blue: {
        color: '#0089ff'
    },
    red: {
        color: '#ff4858'
    }
};




