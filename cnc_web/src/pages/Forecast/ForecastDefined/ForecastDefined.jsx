import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Select, Button, Input, Icon, Table, Pagination, Switch } from "@icedesign/base";
import DetailForecast from './DetailForecast';


export default class ForecastDefined extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [{
                facilityName: '西门子',
                facilityType: '诊断设备',
                lastMaintainDate: '2018-8-14 ',
                lastMaintainTime: 5,
                nextMaintainTime: 16,
                maintainContent: '零件1',
            },
            {
                facilityName: '基迈斯',
                facilityType: '分析设备',
                lastMaintainDate: '2018-7-3 ',
                lastMaintainTime: 5,
                nextMaintainTime: 16,
                maintainContent: '零件2',
            },
            {
                facilityName: '西门子',
                facilityType: '诊断设备',
                lastMaintainDate: '2017-5-4 ',
                lastMaintainTime: 3,
                nextMaintainTime: 20,
                maintainContent: '零件3',
            }],   
            current:1,
            pageSize:5,
            total: 0,
        };
    }
    // 下拉框选择
    onSelect(type, value) {
        // console.log(type,value);
    }
   
    // 分页改变触发
    handleChange(value) {
        // console.log(value);
    }
    
    renderOperator = (value, index, record) => {
        return (
            <div>
                <DetailForecast
                    index={index}
                    record={record}
                />
            </div>
        );
    };

    render() {
        return (
            <div>
                <IceContainer style={styles.IceContainer}>
                    <div style={styles.search}>
                        <Select
                            placeholder="请选择部门"
                            size='large'
                            onChange={this.onSelect.bind(this)}
                            style={{ width: '180px' }}
                        >
                            <Option value="one">艾利美特</Option>
                            <Option value="two">基迈斯</Option>
                            <Option value="three">策维科技</Option>
                        </Select>
                        <Select
                            placeholder="请选择设备类型"
                            size='large'
                            onChange={this.onSelect.bind(this)}
                            style={{ width: '180px' }}
                        >
                            <Option value="one">诊断设备</Option>
                            <Option value="two">分析设备</Option>
                            <Option value="three">自动化设备</Option>
                        </Select>
                    </div>
                </IceContainer>
                <IceContainer>
                    <Table
                        dataSource={this.state.dataSource}
                    >
                        <Table.Column title="设备名称" dataIndex="facilityName" />
                        <Table.Column title="设备类型" dataIndex="facilityType" />
                        <Table.Column title="上次保养日期" dataIndex="lastMaintainDate" />
                        <Table.Column title="上次保养时间(小时)" dataIndex="lastMaintainTime" />
                        <Table.Column title="预计要下次保养还剩(小时)" dataIndex="nextMaintainTime" />
                        <Table.Column title="保养内容" dataIndex="maintainContent" />
                        <Table.Column
                            title="操作"
                            cell={this.renderOperator}
                            lock="right"
                            width={140}
                        />

                    </Table>
                    <div style={styles.pagination}>
                        <Pagination
                            total={this.state.total}
                            pageSize={this.state.pageSize}
                            onChange={this.handleChange}
                        />
                    </div>
                </IceContainer>
            </div>
        )
    }
}

const styles = {

    IceContainer: {
        marginBottom: "20px",
        minHeight: "auto",
        display: "flex",
        justifyContent: "space-between"
    },
    pagination: {
        textAlign: "right",
        paddingTop: "26px"
    },
    search: {
        width: '400px',
        float: 'left',
        display: 'flex',
        justifyContent: 'space-between'
    }

};
