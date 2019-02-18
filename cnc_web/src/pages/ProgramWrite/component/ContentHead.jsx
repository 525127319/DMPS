import React, { Component } from "react";
import {
  Input,
  Select,
  Field,
  Button,
  Icon,
  Dialog,
  Table,
  Pagination,
  Search,
  TreeSelect,
  Feedback
} from "@icedesign/base";
import "./ContentHead.scss";
import ProgramWriteDialog from "./ProgramWriteDialog";

import AxiosHttp from "@/utils/AxiosHttp";
const Toast = Feedback.toast;

export default class ContentHead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      dataSource: [],
      visible: false, //写入状态
      ensureVisible: false //写入弹框
    };
    this.queryInfo = {};
    this.field = new Field(this);
  }

  componentWillMount() {
    // 获取部门
    this.getDepartmentInfo();
    //
  }
  getDepartmentInfo = () => {
    AxiosHttp.get("/department/get")
      .then(res => {
        let { ok, value } = res;
        if (ok) {
          this.setState({
            dataSource: value[0].data.children
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  writeIn = () => {
    if (this.props && this.props.selectInfo.length == 0) {
      Toast.prompt("请先选择需要读入程序的设备");
      return;
    }
    //写入按钮
    this.setState({ ensureVisible: true });
  };

  colseDia = () => {
    //关闭写入弹框
    this.setState({
      ensureVisible: false
    });
    this.props.getSearchValue();
  };

  // 选中部门
  handleChange = (value, data) => {
    this.queryInfo.department = value;
  };

  handleSearch(keyword) {
  }
  // 点击搜索
  onSearch = value => {
    this.queryInfo.prog_name = value.key;
    this.props.getSearchValue(this.queryInfo);
  };


  render() {
    const init = this.field.init;
    return (
      <div className="control-bar main-con-head ">
        <div className="search-group">
          <TreeSelect
            autoWidth
            // showSearch
            treeDefaultExpandAll
            hasClear={true}
            dataSource={this.state.dataSource}
            onChange={this.handleChange}
            onSearch={this.handleSearch}
            style={{ width: 200, marginRight: 20 }}
            placeholder="请选择查看部门"
          />
          <div style={styles.search}>
            {/* <Input
              placeholder="输入查询的程序名"
              onChange={this.onChange.bind(this)}
              trim
              value={this.state.value}
              style={{ width: 200 }}
            /> */}
            <Button onClick={this.onSearch} style={styles.btn}>
              查询
            </Button>
          </div>
        </div>
        {/* <Button className="write-btn" onClick={this.writeIn}>
          写入
        </Button> */}
        <ProgramWriteDialog
          ensureVisible={this.state.ensureVisible}
          dataSource={this.props.selectInfo}
          colseDia={() => this.colseDia()}
        />
      </div>
    );
  }
}
const styles = {
  search: {
    display: "flex"
  },
  btn: {
    marginLeft: "40px"
  }
};
