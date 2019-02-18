import React, { Component } from "react";
import { Table, Button, Icon, Pagination, Dialog } from "@icedesign/base";
import EquipmentUtil from "@/utils/EquipmentUtil";
import AxiosHttp from "@/utils/AxiosHttp";

export default class writeDiary extends Component {
  static displayName = "writeDiary";
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      current: 1,
      pageSize: 10,
      dev_id: "",
      writingDetails: [],
      visible: false //程序写入详情弹框
    };
  }

  //程序写入详情按钮
  showLog = record => {
    this.setState(
      {
        equipmentName: record.name,
        dev_id: record.dev_id,
        equipmentType: EquipmentUtil.getEquipmentUtilLabelById(record.type),
        visible: true
      },
      () => {
        this.getProgramRecordList();
      }
    );
  };

  // 发起获取数据的请求
  getProgramRecordList() {
    AxiosHttp.get(
      "/deviceProgramRecord/list/" +
        this.state.current +
        "/" +
        this.state.dev_id
    ).then(res => {
      let { ok, value } = res;
      if (ok) {
        this.setState({
          writingDetails: value.rs,
          total: value.total
        });
      }
    });
  }

  handleChange = current => {
    // react 中必须通过 setstate 更新 render才会更新渲染
    this.setState(
      {
        current
      },
      () => {
        this.getProgramRecordList();
      }
    );
  };

  onCancel = () => {
    //关闭写入详情弹框
    this.setState({ visible: false });
  };
  onOk = () => {
    //关闭写入详情弹框
    this.setState({ visible: false });
  };
  onClose = () => {
    //关闭写入详情弹框
    this.setState({ visible: false });
  };

  render() {
 
    return (
      <div>
        {this.state.total>0 &&  <Button type="primary" size='small' onClick={() => this.showLog(this.props.record)}>
          查看写入日志
        </Button>}
       
        {this.state.total==0 &&  <span>无写入记录</span>}
        <Dialog
          visible={this.state.visible}
          onOk={this.onClose}
          onClose={this.onClose}
          onCancel={this.onClose}
          title="程序写入详情"
          style={{ width: 1000 }}
          className='no-footer'
        >
          <div className="detial">
            <p>
              <span>设备名称：</span>
              <span>{this.state.equipmentName}</span>
              <span style={{ marginLeft: 40 }}>设备类型：</span>
              <span>{this.state.equipmentType}</span>
            </p>
          </div>
          <Table dataSource={this.state.writingDetails}>
            <Table.Column title="程序名称" dataIndex="programName" />
            <Table.Column title="开发者" dataIndex="developer" />
            <Table.Column title="版本" dataIndex="edition" />
            <Table.Column title="上传时间" dataIndex="writeTime" />
            <Table.Column title="写入时间" dataIndex="writeInTime" />
            <Table.Column title="程序描述" dataIndex="describe" />
          </Table>
          <div className='pagination'>
              <span className='total'>共 {this.state.total} 条</span>
              <Pagination
                size="small"
                total={this.state.total}
                current={this.state.current}
                onChange={this.handleChange}
                pageSize={this.state.pageSize}
              />
          </div>
        </Dialog>
      </div>
    );
  }
}
