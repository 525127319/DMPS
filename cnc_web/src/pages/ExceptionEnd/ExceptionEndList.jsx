import React, { Component } from "react";
import TabTable from "./components/TabTable";

import "./ExceptionEndList.scss";

export default class ExceptionEndList extends Component {
  static displayName = "ExceptionEndList";

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
