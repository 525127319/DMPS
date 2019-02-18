import React, { Component } from "react";
import {
  Dialog,
  Button,
  Form,
  Input,
  Field,
  TimePicker,
  moment,
  Feedback,
  Select
} from "@icedesign/base";
import AxiosHttp from '@/utils/AxiosHttp'
import Principal from '@/components/Principal/Principal'

const FormItem = Form.Item;
const Toast = Feedback.toast;

export default class HandlingAbnormality extends Component {
  static displayName = "HandlingAbnormality";
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      dataIndex: 0,
      visible: false
    };
    this.field = new Field(this);
  }
 
  onOpen = (index, record) => {
    this.field.setValues({ ...record });
    this.setState({
      visible: true,
      dataIndex: index
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };
  handleRespone = (res)=> {
    const {dataIndex} = this.state;
    this.props.getFormValues(dataIndex, res);
    // this.setState({
    //     visible: false
    // });
} 

handleSubmit = () => {
    this.field.validate((errors, values) => {
        if (errors) {
            console.log("Errors in form!!!");
            return;
        }
        let  fix_time=Date.parse(new Date())/1000;
        values.time=values.time;
        values.fix_time=fix_time;
        values.status=1;
        values.fix_man=values.responsibility_by
        AxiosHttp.post("/alarminfo/update", values).then(res => {
            this.handleRespone(values);
            this.props.handelUpdate();
        });
    });
};
  render() {
    const init = this.field.init;
    const { index, record } = this.props;
    const formItemLayout = {
      labelCol: {
        fixedSpan: 6
      },
      wrapperCol: {
        span: 14
      }
    };

    return (
      <div style={styles.editDialog}>
        <Button
          size="small"
          type="secondary"
          onClick={() => this.onOpen(index, record)}
        >
          处理
        </Button>
        <Dialog
          style={{ width: 640 }}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="处理操作"
        >
          <Form direction="ver" field={this.field}>
            <FormItem label='负责人：' {...formItemLayout}>
            <Principal   responsibility_by={init("responsibility_by")}    hasClear  {...init("responsibility_by", {
                                    rules: [{required: true, message: "必填"}]
                                })}/>
            </FormItem> 
            <FormItem label="信息描述：" {...formItemLayout}>
              <Input
                multiple
                trim
                rows={6}
                {...init("desc", {
                  rules: [{ required: true, message: "必填选项" }]
                })}
              />
            </FormItem> 
          </Form>
        </Dialog>
      </div>
    );
  }
}

const styles = {
  editDialog: {
    display: "inline-block",
    marginRight: "5px"
  }
};
