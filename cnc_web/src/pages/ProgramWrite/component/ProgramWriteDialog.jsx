import React, { Component } from "react";
import {
  Form,
  Input,
  Select,
  Field,
  Button,
  Icon,
  Dialog,
  Table,
  Pagination,
  Search,
  Feedback,
  moment
} from "@icedesign/base";
const FormItem = Form.Item;
const Toast = Feedback.toast;
import AxiosHttp from "@/utils/AxiosHttp";
export default class ProgramWriteDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      current: 1,
      pageSize: 10,
      visible: false,
      searchValue: "",

      rowSelection: {
        onChange: this.onChange.bind(this),
        onSelect: function(selected, record, records) {},
        mode: "single",
        selectedRowKeys: []
      },
      dataSource: [],
      records: []
    };
    this.params = {};
    this.field = new Field(this);
  }

  componentWillMount() {
    this.getProgramlistInfo();
  }
  getProgramlistInfo = () => {
    if (!this.state.searchValue) {
      this.state.searchValue = null;
    }

    this.params = {
      pageIndex: this.state.current,
      programName: this.state.searchValue
    };
    AxiosHttp.post("/programlist/list", this.params)
      .then(res => {
        if (res.ok) {
          this.setState({
            dataSource: res.value.rs,
            total: res.value.total
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  // 搜索
  getSearchValue = resData => {
    this.setState(
      {
        searchValue: resData,
        current: 1
      },
      () => {
        this.getProgramlistInfo();
      }
    );
  };
  onSearch(value) {
    this.setState(
      {
        searchValue: value.key
      },
      () => {
        this.getProgramlistInfo();
      }
    );
  }
  onChangeSearch(value) {
    this.setState({
      value: value
    });
  }

  handleChange = current => {
    //dialog分页
    this.setState(
      {
        current
      },
      () => {
        this.getProgramlistInfo();
      }
    );
  };
  onChange = (ids, records) => {
    //获取选中的值
    let { rowSelection } = this.state;
    rowSelection.selectedRowKeys = ids;

    this.setState({
      records,
      rowSelection
    });
  };
  onOk = () => {
    if (this.state.records.length === 0) {
      Toast.prompt("请选择需要读入的程序");
      return;
    }
    for (let item of this.props.dataSource) {
      Object.assign(item, this.state.records[0], { writeState: 0 });
      delete item._id;
      // 获取的当前时间
      item.writeInTime = moment().format("YYYY-MM-DD H:mm:ss");
    }

    // writeState = 0; //初始化状态 正在读入 1读入完毕

    AxiosHttp.post(
      "/deviceProgramRecord/saveDeviceProgram",
      this.props.dataSource
    ).then(res => {
      let { ok, value } = res;
      if (ok) {
        Toast.success("读取成功，正在写入...");
        //  开启websockt
        // this.websockt(value);
        this.props.colseDia();
      }
    });
  };
  onCancel = () => {
    this.setState({ visible: false });
  };

  // websockt = values => {
  //   let data = {};
  //   values.forEach(element => {

  //   });
  //   console.log("返回回来的值");
  //   console.log(values);
  // };

  render() {
    const init = this.field.init;
    return (
      <Dialog
        visible={this.props.ensureVisible}
        onOk={this.onOk}
        onCancel={this.props.colseDia}
        onClose={this.props.colseDia}
        title="程序列表"
      >
        <div className="search  dia-search">
          <Form field={this.field}>
            {/* <Input
                {...init("programName")}
                htmlType="text"
                placeholder="程序名"
                id=" "
                name="program_name"
              /> */}
            {/* <FormItem>
              <Input
                {...init("programAuthor")}
                htmlType="text"
                placeholder="开发者"
                id=" "
                name="author_name"
              />
            </FormItem> */}

            <FormItem>
              <Search
                onChange={this.onChangeSearch.bind(this)}
                onSearch={this.onSearch.bind(this)}
                placeholder="输入查询的程序名"
                searchText="搜索"
              />
            </FormItem>
          </Form>
        </div>
        <div className="program-table">
          <Table
            dataSource={this.state.dataSource}
            rowSelection={this.state.rowSelection}
            primaryKey="_id"
          >
            <Table.Column title="程序名" dataIndex="programName" />
            <Table.Column title="版本" dataIndex="edition" />
            <Table.Column title="开发者" dataIndex="developer" />
            <Table.Column title="描叙" dataIndex="describe" />
            <Table.Column title="时间" dataIndex="writeTime" />
          </Table>
        </div>
        <Pagination
          size="small"
          total={this.state.total}
          current={this.state.current}
          onChange={this.handleChange}
          pageSize={this.state.pageSize}
        />
      </Dialog>
    );
  }
}
