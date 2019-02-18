import React, { Component } from "react";
import TabTable from "./components/TabTable";

import "./ExceptionList.scss";


export default class ExceptionList extends Component {
  static displayName = "ExceptionList";

  constructor(props, context) {
    super(props, context);
    this.state = {
      alarmCode:[],
    };
  }
  componentWillMount() {
    if (this.props.location.state && _.isArray(this.props.location.state)) {
      this.setState(  preState => ({
        alarmCode: preState.alarmCode.concat(this.props.location.state)
      }) 
    )
    }
  }
  render() {
    return (
        <TabTable alaCode={this.state.alarmCode} />
    );
  }
}

