import React, { Component } from "react";
import IceContainer from "@icedesign/container";
import CustomTable from "./components/CustomTable";
import { DatePicker, Pagination, Button, Icon, Field } from "@icedesign/base";
import Navigationhead from "./components/Navigationhead";

export default class TabTable extends Component {
  static displayName = "TabTable";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      current: 1,
      pageSize: 10,
      dataSource: [
        {
          deviceName: "AST00-13",
          deviceType: "铣床",
          personliable: "Andy",
          maintenanceOrders:'BY-001',
          maintenanceDate:'2018-5-7 10:50:00',
          maintenanceContent:'更换机油',
          maintenanceResults:'ok',
          maintenanceDescription:'xx',
          equipmentPosition:'cw-01'
        }
      ]
    };
    this.params = {
      current: 0
    };
    this.columns = [
      {
        title: "设备名称",
        dataIndex: "deviceName",
        key: "deviceName",
        width: 110
      },
      {
        title: "设备类型",
        dataIndex: "deviceType",
        key: "deviceType",
        width: 100
      },
      {
        title: "保养订单",
        dataIndex: "maintenanceOrders",
        key: "maintenanceOrders",
        width: 100
      },
      {
        title: "保养人",
        dataIndex: "personliable",
        key: "personliable",
        width: 80
      },
      {
        title: "保养日期",
        dataIndex: "maintenanceDate",
        key: "maintenanceDate",
        width: 80
      },
      {
        title: "保养内容",
        dataIndex: "maintenanceContent",
        key: "maintenanceContent",
        width: 80
      },
      {
        title: "保养结果",
        dataIndex: "maintenanceResults",
        key: "maintenanceResults",
        width: 80
      },
      {
        title: "保养描述",
        dataIndex: "maintenanceDescription",
        key: "maintenanceDescription",
        width: 80
      },
      {
        title: "设备位置",
        dataIndex: "equipmentPosition",
        key: "equipmentPosition",
        width: 80
      },
    ];
  }

  render() {
    return (
      <div className="tab-table main-container">
        <Navigationhead />
        <IceContainer   className='main-con-body'>
          <CustomTable
            dataSource={this.state.dataSource}
            columns={this.columns}
            hasBorder={false}
          />
          <Pagination
            style={styles.pagination}
            total={this.state.total}
            current={this.state.current}
            onChange={this.handleChange}
            pageSize={this.state.pageSize}
          />
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  pagination: {
    textAlign: "right",
    paddingTop: "26px"
  }
};
