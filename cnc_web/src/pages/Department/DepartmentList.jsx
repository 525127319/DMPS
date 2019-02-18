import React, { Component } from "react";
import EditorTree from "@/components/editortree";
export default class DepartmentList extends Component {
  static displayName = "Department";
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
        <EditorTree name='部门管理' type='department'/>
    );
  }
}
