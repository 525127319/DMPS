import React, { Component } from "react";
import IceContainer from "@icedesign/container";

import {
  Select,
  Pagination,
  Button,
  Icon,
  Input,
  Search
} from "@icedesign/base";
const dataSource = [
  { label: "未保养", value: "ab13" },
  { label: "已保养", value: "ab14" }
];

export default class Navigationhead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value:""
    };
  }
  onSelectDepartment(values) {
    // console.log(values, 11);
  }
  onSearch= ()=> {
    // console.log(this.state.value);
  }
  onChange(value) {
    // console.log("input is:" + value);
    this.setState({
      value: value
    });
  }
  render() {
    return (
      <div   className='main-con-head'>
        <IceContainer>
          <Select
            style={styles.SelectDepartment}
            defaultValue={{ label: "未保养", value: "ab13" }}
            size={"large"}
            dataSource={dataSource}
            placeholder="查看保养订单类"
            onChange={this.onSelectDepartment.bind(this)}
          />
          {/* <Search
            style={styles.Search}
            size="medium"
            searchText="搜索"
            inputWidth={300}
            placeholder="输入搜索订单号"
          /> */}
          <div style={styles.Search}>
            <Input placeholder="输入查询的程序名" onChange={this.onChange.bind(this)} trim value={this.state.value} style={{ width: 200 }} />
            <Button onClick={this.onSearch} style={styles.btn}>查询</Button>
          </div>
        </IceContainer>
      </div>
    );
  }
}
const styles = {
  SelectDepartment: {
    width: "180px"
  },
  Search: {
    float: "right"
  },
  btn:{
    marginLeft: "40px",
  }
  
};
