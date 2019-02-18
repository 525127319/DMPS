import React, { Component } from "react";
import TabTable from "./components/TabTable";

import "./DownloadList.scss";

export default class DownloadList extends Component {
  static displayName = "DownloadList";

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
        <TabTable />
    );
  }
}

