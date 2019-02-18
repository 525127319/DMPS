import React, { Component } from "react";
import { Table, Button, Icon, Pagination, Dialog } from "@icedesign/base";

import DevicetypeUtils from "@/utils/DevicetypeUtil";
import WriteDiary from "./writeDiary";
import EquipmentUtil from "@/utils/EquipmentUtil";
export default class ContentBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      equipmentName: "",
      equipmentType: "",
      rowSelection: {
        onChange: this.onChange.bind(this),
        onSelect: function(selected, record, records) {},
        onSelectAll: function(selected, records) {},
        selectedRowKeys: []
      }
    };
  }
  onChange(ids, records) {
    let { rowSelection } = this.state;
    rowSelection.selectedRowKeys = ids;
    this.props.onSelect(records);
    this.setState({ rowSelection });
  }

  render() {
    const formatDevicetype = (value, index, record) => {
      return <span>{EquipmentUtil.getEquipmentUtilLabelById(value)}</span>;
    };
    const render = (value, index, record) => {
      return (
        <span>
          <WriteDiary record={record} />
        </span>
      );
    };
    const writeState = (value, index, record) => {
      if (record.writeState === 1) {
        return <span>读取完毕</span>;
      } else if (record.writeState === 0) {
        return <span>正在读取...</span>;
      }
    };
    return (
      <div className="main-body  "  >
        {/* 设备列表 */}
        <Table
          dataSource={this.props.dataSource}
          rowSelection={this.state.rowSelection}
          primaryKey="dev_id"
        >
          <Table.Column title="设备名称" dataIndex="name" />
          <Table.Column
            title="设备类型"
            dataIndex="type"
            cell={formatDevicetype}
          />
          <Table.Column title="现有程序" dataIndex="prog_name" />
          {/* <Table.Column title="写入时间" dataIndex="writeTime" />
          <Table.Column title="开发者" dataIndex="author" />
          <Table.Column title="版本" dataIndex="beta" />
          <Table.Column title="上传时间" dataIndex="upLoadTime" /> */}
          <Table.Column title="写入状态" cell={writeState} />
          <Table.Column title="操作" cell={render} width={200} />
        </Table>
      </div>
    );
  }
}
 
