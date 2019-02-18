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
          orderNumber: "BY-007",
          deviceName: "AST00-13",
          deviceType: "铣床",
          lastMaintenanceDate: "2018-5-7 10:50:00",
          lastMaintenanceTime: "8h",
          maintenanceContent: "更换机油,清洗",
          maintenanceType: "日常",
          remindingState: "已提醒"
        },
        {
          orderNumber: "BY-008",
          deviceName: "AST00-14",
          deviceType: "铣床",
          lastMaintenanceDate: "2018-5-9 10:50:00",
          lastMaintenanceTime: "5h",
          maintenanceContent: "更换机油",
          maintenanceType: "日常",
          remindingState: "未提醒"
        }
      ]
    };
    this.params = {
      current: 0
    };
    this.columns = [
      {
        title: "保养订单号",
        dataIndex: "orderNumber",
        key: "orderNumber",
        width: 100
      },
      {
        title: "设备名称",
        dataIndex: "deviceName",
        key: "deviceName",
        width: 100
      },
      {
        title: "设备类型",
        dataIndex: "deviceType",
        key: "deviceType",
        width: 80
      },
      {
        title: "保养类型",
        dataIndex: "maintenanceType",
        key: "maintenanceType",
        width: 80
      },
      {
        title: "保养内容",
        dataIndex: "maintenanceContent",
        key: "maintenanceContent",
        width: 110
      },
      {
        title: "上次保养日期",
        dataIndex: "lastMaintenanceDate",
        key: "lastMaintenanceDate",
        width: 100
      },
      {
        title: "上次保养时间",
        dataIndex: "lastMaintenanceTime",
        key: "lastMaintenanceTime",
        width: 80
      },
      {
        title: "提醒状态",
        dataIndex: "remindingState",
        key: "remindingState",
        width: 80
      },
      {
        title: "操作",
        key: "action",
        width: 80,
        render: (value, index, record) => {
          if (record.remindingState === "已提醒") {
            return (
              <span>
                <Button type="light">提醒</Button>
              </span>
            );
          }
          return (
            <span>
              <Button type="secondary">提醒</Button>
            </span>
          );
        }
      }
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
