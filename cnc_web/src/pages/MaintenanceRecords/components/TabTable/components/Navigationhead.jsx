import React, { Component } from "react";
import IceContainer from "@icedesign/container";

import { Select, Pagination, Button, Icon, Input } from "@icedesign/base";
const dataSource = [
  { label: "option1", value: "ab13" },
  { label: "option2", value: "ab14" }
];

export default class Navigationhead extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onSelectDepartment(values) {
    // console.log(values, 11);
  }
  onSelectEquipment(values) {
    // console.log(values, 22);
  }
  queryEvent() {
    // console.log(111);
  }
  render() {
    return (
      <div   className='main-con-head'>
        <IceContainer style={styles.content}>
          <Select
            style={styles.SelectDepartment}
            size={"large"}
            dataSource={dataSource}
            placeholder="查看部门"
            onChange={this.onSelectDepartment.bind(this)}
          />
          <Select
            style={styles.SelectEquipment}
            size={"large"}
            dataSource={dataSource}
            placeholder="查看设备"
            onChange={this.onSelectEquipment.bind(this)}
          />
          <Button type="normal" size={"large"} onClick={this.queryEvent} style={styles.query}>
            查询
          </Button>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  content:{
    display:'flex',
    alignItems:'center'
  },
  query: {
    marginLeft: "40px"
  },
  SelectEquipment: {
    marginLeft: "40px",
    width: "200px"
  },
  SelectDepartment: {
    width: "180px"
  }
};
