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
  Select,
  Switch
} from "@icedesign/base";
import TimeUtil from "@/utils/TimeUtil";
const FormItem = Form.Item;
const Toast = Feedback.toast;

import AxiosHttp from "@/utils/AxiosHttp.js";

export default class EditDialog extends Component {
  static displayName = "EditDialog";
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataIndex: null,
      checked: false,
      startTime:0,
      endTime:0,
      value: {
        on_off: '',
      },
    };
    this.field = new Field(this);
    // this.onChange = this.onChange.bind(this);
  }
 
  handleSubmit = () => {
    this.field.validate((errors, values) => {
      if (errors) {
        console.log("Errors in form!!!");
        return;
      }
      const {startTime,endTime} =this.state;
      let curTime =TimeUtil.getDayStartUnixTime();
      values.start_time = (new Date(values.start_time).getTime()/1000-curTime)/3600;
      values.end_time =(new Date(values.end_time).getTime()/1000-curTime)/3600;
      if(values.start_time<0 ){
        values.start_time =startTime;
      }else if(values.end_time<0){
        values.end_time=endTime;
      }
      values.end_time=parseFloat((values.end_time).toFixed(1));
      values.start_time=parseFloat((values.start_time).toFixed(1)); 
      if (values.end_time <  values.start_time ) {
        Toast.prompt("班别结束时间不能小于班别开始时间");
        return;
      }
      values.id =this.props.id;
      values.shift_id =this.props.shiftArr.shift_id;
      AxiosHttp.post("/shift/update", values).then(res => {
        let { ok } = res;
        if (ok === 1) {
          Toast.success("编辑成功");
          this.props.getFormValues();
          this.setState({
            visible: false
          });
        }else{
          Toast.prompt(res.desc);
        }
      });
    });
  };
 

  onOpen = (index, record) => {
    this.field.setValues({index,...record });
    this.setState({
      visible: true,
      startTime:record['start_time'],
      endTime:record['end_time']
    });
  };

  onClose = () => {
    this.setState({
      visible: false
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
          type="primary"
          onClick={() => this.onOpen(index, record)}
        >
          编辑
        </Button>
        <Dialog
          style={{ width: 640 }}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="编辑"
        >
          <Form direction="ver" field={this.field}>
            <FormItem label="班别：" {...formItemLayout}>
              <Input
                disabled
                style={{ width: '300px' }}
                {...init("attrbute", {
                  rules: [{ required: true, message: "必填选项" }]
                })}
              />
              
            </FormItem>

            <FormItem label="开始时间：" {...formItemLayout}>
              <TimePicker
                format="HH:mm"
                name="start_time"
                style={{ width: '300px' }}
                {...init("start_time", {
                  rules: [{ required: true, message: "必填选项" }]
                })}
              />
            </FormItem>

            <FormItem label="结束时间：" {...formItemLayout}>
              <TimePicker
                format="HH:mm"
                name="end_time"
                style={{ width: '300px' }}
                {...init("end_time", {
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
