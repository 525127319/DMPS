import React, { Component } from "react";
import TabTable from "./components/TabTable";

import "./ClassList.scss";

export default class ClassList extends Component {
  static displayName = "ClassList";

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

