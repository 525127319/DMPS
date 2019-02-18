import React, { Component } from "react";
import { Table, Accordion, Feedback } from "@icedesign/base";
import EditDialog from "./EditDialog";
import DeleteBalloon from "./DeleteBalloon";
import DeletePanel from "./DeletePanel";
import EditPanel from "./EditPanel";
import AddShift from "./AddShift";
import AxiosHttp from "@/utils/AxiosHttp.js";
const Toast = Feedback.toast;
const { Panel } = Accordion;
const uuidV4 = require('uuid/v4');

export default class CustomTable extends Component {
  static displayName = "CustomTable";
  // static propTypes = {
  //   getPanelData: PropTypes.func
  // };

  // static defaultProps = {
  //   getPanelData: () => {}
  // };
  constructor(props) {
    super(props);
    this.state = {
      shiftData: [],
      restData: [],
    };
  }

  componentWillMount() {
    this.getList();
  }

  getList() {
    AxiosHttp.get("/shift/findById/" + this.props.shiftArr.shift_id)
      .then(res => {
        console.log(res, 'res')
        if (res.ok) {
          this.setState({
            shiftData: res.value.shift,
            restData: res.value.rest_time,
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  getFormValues = () => {
    this.getList();
  };

  getEditValues = (val) => {
    this.getList();
  };

  handleRemove = () => {
    this.getList();
  };

  remove = () => {
    // this.props.getPanelData();
    const { shiftArr } = this.props;
    let shift_id = shiftArr.shift_id
    let params = { shift_id }
    AxiosHttp.post("/shift/deleteById", params)
      .then(res => {
        let { ok } = res;
        if (ok === 1) {
          Toast.success("删除成功");
          this.props.getPanelData();
        }
      })
      .catch(error => {
        console.log(error);
      });
  }


  render() {
    const { shiftArr } = this.props;
    const render = (value, index, record) => {
      return (
        <span>
          <EditDialog
            record={record}
            shiftArr={shiftArr}
            getFormValues={this.getFormValues}
          />
          <DeleteBalloon
            record={record}
            shiftArr={shiftArr}
            handleRemove={this.handleRemove}
          />
        </span>
      );
    }

    const renderRest = (value, index, record) => {
      return (
        <span>
          <EditDialog
            id={uuidV4()}
            record={record}
            shiftArr={shiftArr}
            getFormValues={this.getFormValues}
          />
          <DeleteBalloon
            id={uuidV4()}
            record={record}
            shiftArr={shiftArr}
            handleRemove={this.handleRemove}
          />
        </span>
      );
    }

    return (<div>
      <Accordion >
        <Panel multiTitle title={shiftArr.name} >
          <div style={styles.btn}>
            <AddShift shift_id={shiftArr.shift_id} getFormValues={this.getFormValues} />
            <DeletePanel shiftArr={shiftArr} handleRemove={this.remove} />
            <EditPanel shiftArr={shiftArr} getEditValues={this.getEditValues} />
          </div>
          <Table dataSource={this.state.shiftData} style={{ marginBottom: '20px' }}>
            <Table.Column title={'班别'} dataIndex='attrbute' />
            <Table.Column title={'开始时间'} dataIndex='start_time' />
            <Table.Column title={'结束时间'} dataIndex='end_time' />
            <Table.Column title="操作" cell={render} />
          </Table>
          <div style={styles.btn}>
            <AddShift id={uuidV4()} shift_id={shiftArr.shift_id} getFormValues={this.getFormValues} />
          </div>
          <Table dataSource={this.state.restData}>
            <Table.Column title={'休息时间'} dataIndex='attrbute' />
            <Table.Column title={'开始时间'} dataIndex='start_time' />
            <Table.Column title={'结束时间'} dataIndex='end_time' />
            <Table.Column title="操作" cell={renderRest} />
          </Table>
        </Panel>
      </Accordion>
    </div>
    );
  }
}

const styles = {
  btn: {
    marginBottom: "10px",
  },

};