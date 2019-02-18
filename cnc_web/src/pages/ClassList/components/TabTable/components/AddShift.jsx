import React, { Component } from "react";
import {
  Dialog,
  Button,
  Form,
  Icon,
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

export default class AddShift extends Component {
  static displayName = "AddShift";

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataIndex: null,
      checked: false,
      value: {
        on_off: '',
      },
    };
    this.field = new Field(this);
    this.onChange = this.onChange.bind(this);
  }
  onChange(checked) {
    // console.log(checked, 123)
    this.setState({
      checked
    });
  }

  handleSubmit = () => {
    this.field.validate((errors, values) => {
      if (errors) {
        console.log("Errors in form!!!");
        return;
      }
        values.shift_id =this.props.shift_id;
       let curTime =TimeUtil.getDayStartUnixTime();
        values.end_time =  (new Date(values.end_time).getTime()/1000-curTime)/3600;
        values.start_time =(new Date(values.start_time).getTime()/1000-curTime)/3600;
        values.end_time=parseFloat(( values.end_time).toFixed(1));
        values.start_time=parseFloat(( values.start_time).toFixed(1));

        // if (values.end_time <  values.start_time ) {
        //     Toast.prompt("班别结束时间不能小于班别开始时间");
        //     return;
        // }

        values.id =this.props.id;
        console.log(this.props,'uuid');
        console.log(values,'添加');
        

      AxiosHttp.post("/shift/add", values).then(res => {
        console.log(res,'添加成功吗');
        let { ok } = res;
        if (ok === 1) {
          Toast.success("添加成功");
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
  // handleRespone(data) {
  //   //触发回调   通知父组件修改data
  //   const { dataIndex } = this.state;
  //   console.log(dataIndex,'table添加1');
  //   console.log(data,'table添加2')
  //   this.props.getFormValues(dataIndex, data)
  //   this.setState({
  //     visible: false
  //   });
  // }

  onOpen = (index, record) => {
    this.field.setValues({index,...record });
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
          onClick={() => this.onOpen(index, record)}
        >
          <Icon type="add" />添加
        </Button>
        <Dialog
          style={{ width: 640 }}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="添加"
        >
          <Form direction="ver" field={this.field}>
            <FormItem label="班别：" {...formItemLayout}>
              <Input
                style={{ width: '300px' }}
                {...init("shift", {
                  rules: [{ required: true, message: "必填选项" }]
                })}
              />
              
            </FormItem>

             {/* <FormItem label="跨天工作：" {...formItemLayout} >   style={{display:"none"}} 
              <Switch
                name="no_off"
                checked={this.state.checked}
                onChange={this.onChange}
              />
            </FormItem> */}

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
