import React, { Component } from "react";
import PropTypes from "prop-types";
import { Table, Pagination } from "@icedesign/base";
import Equipment from "./Equipment";
import HistoricalProcedure from "./HistoricalProcedure";
import AbnormalityTimes from "./AbnormalityTimes";

export default class CustomTable extends Component {
  static displayName = "CustomTable";
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderColumns = () => {
    const { columns } = this.props;
    return columns.map(item => {
      if (typeof item.render === "function") {
        return (
          <Table.Column
            key={item.key}
            title={item.title}
            cell={item.render}
            width={item.width}
          />
        );
      }
      return (
        <Table.Column
          key={item.key}
          title={item.title}
          dataIndex={item.dataIndex}
          width={item.width}
        />
      );
    });
  };
  // 注册子组件回调
  onEquipment = ref => {
    this.equipment = ref;
  };
  onHistorical = ref => {
    this.historical = ref;
  };
  onAbnormalityTimes = ref => {
    this.abnormalityTimes = ref;
  };

  clickDeviceName = (value, index, resdata) => {
    console.log("点击 clickDeviceName ");
    this.equipment.onOpen(resdata);
  };
  clickHistoricalProcedure = (value, index, resdata) => {
    console.log("点击 clicHistoricalProcedure ");
    this.historical.onOpen(resdata);
  };
  clickAbnormalityTimes = (value, index, resdata) => {
    console.log("点击 clicAbnormalityTimes ");
    this.abnormalityTimes.onOpen(resdata);
  };
  render(value, index, resdata) {
    const deviceName = (value, index, resdata) => {
      return (
        <span onClick={() => this.clickDeviceName(value, index, resdata)}>
          {value}
        </span>
      );
    };
    const historicalProcedure = (value, index, resdata) => {
      return (
        <span
          onClick={() => this.clickHistoricalProcedure(value, index, resdata)}
        >
          {value}
        </span>
      );
    };
    const abnormalityTimes = (value, index, resdata) => {
      return (
        <span onClick={() => this.clickAbnormalityTimes(value, index, resdata)}>
          {value}
        </span>
      );
    };
    return (
      <div>
        <Table hasBorder={false} dataSource={this.props.dataSource}>
          <Table.Column
            title="设备名称"
            dataIndex="deviceName"
            cell={deviceName}
          />
          <Table.Column title="设备类型" dataIndex="deviceType" />
          <Table.Column title="开机时长" dataIndex="runningTime" />
          <Table.Column title="工作时间" dataIndex="workingHours" />
          <Table.Column title="生产数量" dataIndex="productionQuantity" />
          <Table.Column title="移动率" dataIndex="mobility" />
          <Table.Column
            title="历史程序"
            dataIndex="historicalProcedure"
            cell={historicalProcedure}
          />
          <Table.Column
            title="异常次数"
            dataIndex="abnormalityTimes"
            cell={abnormalityTimes}
          />
        </Table>
        <Equipment onEquipment={this.onEquipment} />
        <HistoricalProcedure onHistorical={this.onHistorical} />
        <AbnormalityTimes onAbnormalityTimes={this.onAbnormalityTimes} />
      </div>
    );
  }
}
