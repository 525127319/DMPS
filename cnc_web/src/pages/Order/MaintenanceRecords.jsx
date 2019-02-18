import React, { Component } from "react";
import TabTable from "./components/TabTable";

import "./MaintenanceRecords.scss";

export default class MaintenanceRecords extends Component {
  static displayName = "MaintenanceRecords";

  constructor(props) {
    super(props);
    this.state = {};
  }
 
  render() {
    return (
      <div className="cate-list-page">
        <TabTable />
      </div>
    );
  }
}

