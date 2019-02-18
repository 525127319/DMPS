import React, { Component } from "react";
import EditorTree from "../../components/editortree";
export default class LocationList extends Component {
  static displayName = "Location";
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
        <EditorTree name='设备位置' type='location'/>
    );
  }
}
