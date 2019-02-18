import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import Status from './DeviceBasisInfo';
import { Button, Icon,Table ,Pagination,Moment} from "@icedesign/base";
import {evn} from '../../../../utils/Config';
import AxiosHttp from "../../../../utils/AxiosHttp";

export default class HistoryProgram extends Component {
    static displayName = 'HistoryProgram';
    static defaultProps = {
        //本界面的默认配置，会合并到props里，但这里的属性为只读
        pageSize: 10
    };
    constructor(props) {
        super(props);
        this.param = {pageIndex: 1};//班别当前页
        this.state = {
            dataSource:[],//班别  
            total: 0,//总条数
        }
    }

      componentDidMount() {
       
     }

    render(){
        return(
            <div>
                <IceContainer>
                    <p>班别</p>
                    <Table dataSource={this.state.dataSource}  maxBodyHeight={100}>
                        <Table.Column title="日期" dataIndex="programName" align="center"/>
                        <Table.ColumnGroup title="早班" key="name-group" align="center">
                            <Table.Column title="开机时间" dataIndex="Edition" />
                            <Table.Column title="运行时间" dataIndex="applicationTime" />
                            <Table.Column title="稼动率" dataIndex="applicationTime" />
                        </Table.ColumnGroup>
                        <Table.ColumnGroup title="中班" key="name-group" align="center">
                            <Table.Column title="开机时间" dataIndex="Edition" />
                            <Table.Column title="运行时间" dataIndex="applicationTime" />
                            <Table.Column title="稼动率" dataIndex="applicationTime" />
                        </Table.ColumnGroup>
                        <Table.ColumnGroup title="晚班" key="name-group" align="center">
                            <Table.Column title="开机时间" dataIndex="Edition" />
                            <Table.Column title="运行时间" dataIndex="applicationTime" />
                            <Table.Column title="稼动率" dataIndex="applicationTime" />
                        </Table.ColumnGroup>
                    </Table>
                    <div style={styles.pagination}>
                        <Pagination
                        size="small"
                        total={this.state.total}
                        // current={this.state.current}
                        // onChange={this.handleChange}
                        pageSize={this.state.pageSize}
                        />
                    </div>
                </IceContainer>
            </div>
        )
    }
}
const styles = {
    pagination: {
        float: "right",
        paddingTop: "26px"
    },
}