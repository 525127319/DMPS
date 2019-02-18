import React, { Component } from "react";
import TabTable from "./components/TabTable";

import "./HistoricalData.scss";

export default class HistoricalData extends Component {
  static displayName = "HistoricalData";

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

