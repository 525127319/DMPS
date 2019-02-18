import React, { Component } from "react";
import PropTypes from "prop-types";
import { Table, Pagination } from "@icedesign/base";

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

  render() {
    return (
      <div>
        <Table {...this.props}>{this.renderColumns()}</Table>
      </div>
    );
  }
}
