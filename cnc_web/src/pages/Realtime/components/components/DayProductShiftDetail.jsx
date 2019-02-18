import React, { Component } from "react";
import {
  Button,
  Table,
  Dialog
} from "@icedesign/base";
import AxiosHttp from "../../../../utils/AxiosHttp";

export default class DayProductDetail extends Component {
  static displayName = "DayProductDetail";
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dayProductDetailData: []
    };
  }

  //发请求获取日产量详情数据
  getList() {
    AxiosHttp.get("/dayStatistic/getSingletDayProductDetail/" + this.props.id+'/'+this.props.time)
      .then(this.handleResponse)
      .catch(error => {
        console.log(error);
      });
  }

  handleResponse = res => {
    this.setState({
      dayProductDetailData: res.value[0].data.children
    });
  };

  componentDidMount() {
  }

  //打开弹窗
  onOpen = () => {
    this.getList();
    this.setState({
      visible: true
    });
  };

  // 关闭弹窗
  onClose = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    
    const formatHour = (value) => {
      return <span>{value}</span>;
    };
    const formatWt = value => {
      return <span>{(value / 3600).toFixed(2)}</span>;
    };
    const formatRt = value => {
      return <span>{(value / 3600).toFixed(2)}</span>;
    };
    const formatEfy = value => {
      return <span>{Math.round(value)}</span>;
    };
    return (
      <div>
        <Button size="small" type="primary" onClick={() => this.onOpen()}>
          查看每天详情
        </Button>
        <Dialog
          style={{ width: 700 }}
          visible={this.state.visible}
          onClose={this.onClose}
          footer={false}
          title="每天详情"
        >
          <Table dataSource={this.state.dayProductDetailData} fixedHeader>
            <Table.Column title="班次" dataIndex="name" style={styles.public}/>
            <Table.Column title="开机时长(h)" dataIndex="rt" cell={formatRt} style={styles.public}/>
            <Table.Column title="工作时长(h)" dataIndex="wt" cell={formatWt} />
            <Table.Column title="稼动率(%)" dataIndex="efficiency" cell={formatEfy}/>
          </Table>
        </Dialog>
      </div>
    );
  }
}
const styles = {
  pagination: {
    float: "right",
    paddingTop: "20px"
  },
  public:{
    cursor:"auto",
  }
};
