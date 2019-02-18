import React, { Component } from "react";
import { Table, Accordion, Feedback } from "@icedesign/base";
import EditDialog from "./EditDialog";
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
    // this.getList();
  }

  // getList() {
  //   AxiosHttp.get("/shift/findById/" + this.props.shiftArr.shift_id)
  //     .then(res => {
  //       console.log(res, 'res')
  //       if (res.ok) {
  //         this.setState({
  //           shiftData: res.value.shift,
  //           restData: res.value.rest_time,
  //         });
  //       }
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // }

  getFormValues = () => {
    // this.getList();
  };

  
 


  render() {
    const { cutter , keys ,cutterName,k} = this.props;
    
    const render = (value, index, record) => {
      return (
        <span>
          <EditDialog
            // record={record}
            // shiftArr={shiftArr}
            // getFormValues={this.getFormValues}
          />
        </span>
      );
    }

    return (<div>
      <Accordion >
        <Panel multiTitle  title ={cutterName[keys]} >
          <Table dataSource={cutter} style={{ marginBottom: '20px' }}>
            <Table.Column title={'触发时间'} dataIndex='trigger' />
            <Table.Column title={'开始时间'} dataIndex='start' />
            <Table.Column title={'结束时间'} dataIndex='end' />
            <Table.Column title="操作" cell={render} />
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