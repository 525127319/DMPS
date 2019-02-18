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
  Pagination
} from "@icedesign/base";
const FormItem = Form.Item;
const getData = () => {
  //程序列表数据模拟数据
  let result = [];
  for (let i = 0; i < 5; i++) {
    result.push({
      dailyRecord: `第${i}次`,
      abnormityCode: `ATS-abs${i}`,
      describe: `点击功率${i}H`,
      time: `2018-04${(29 * Math.random() + 1).toFixed(0)}`
    });
  }
  return result;
};
export default class ProgramWriteDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      current: 1,
      pageSize: 10,
      visible: false,
      dataSource: getData(0, 5)
    };
    this.field = new Field(this);
    this.title = "异常信息列表";
  }
  handleChange = current => {
    //dialog分页
    this.setState({
      current
    });
  };

  componentDidMount() {
    this.props.onAbnormalityTimes(this);
  }

  onOpen = value => {
    if (value && value.deviceName) {
      this.title = `设备${value.deviceName}的异常信息列表`;
    }
    this.setState({
      visible: true,
      title: this.title
    });
  };

  onOk = () => {
    //关闭弹框
    this.setState({ visible: true });
  };
  onCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const init = this.field.init;
    const footer = <Button onClick={this.onCancel}>关闭</Button>;
    return (
      <Dialog
        footer={footer}
        visible={this.state.visible}
        onOk={this.onOk}
        onOpen={this.onOpen}
        onCancel={this.onCancel}
        onClose={this.onCancel}
        title={this.state.title}
      >
        <div className="program-table">
          <Table dataSource={this.state.dataSource} hasBorder={false}>
            <Table.Column title="异常次数" dataIndex="dailyRecord" />
            <Table.Column title="异常码" dataIndex="abnormityCode" />
            <Table.Column title="异常内容描述" dataIndex="describe" />
            <Table.Column title="时间" dataIndex="time" />
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
