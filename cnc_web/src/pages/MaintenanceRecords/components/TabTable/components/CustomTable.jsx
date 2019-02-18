import React, { Component } from "react";
import PropTypes from "prop-types";
import { Table, Pagination } from "@icedesign/base";
import MaintainDetails from "./MaintainDetails";

export default class CustomTable extends Component {
  static displayName = "CustomTable";
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 注册子组件回调
  onRef = ref => {
    this.child = ref;
  };

  onRowClick = (record, index, Event) => {
    this.child.onOpen(record);
  };

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

  render() {
    return (
      <div>
        <Table {...this.props} onRowClick={this.onRowClick}>
          {this.renderColumns()}
        </Table>
        <MaintainDetails onRef={this.onRef} />
      </div>
    );
  }
}
