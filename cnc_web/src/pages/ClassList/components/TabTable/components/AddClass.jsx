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
  Switch,
  Grid
} from "@icedesign/base";
import TimeUtil from "@/utils/TimeUtil";
const { Row, Col } = Grid;
const FormItem = Form.Item;
const Toast = Feedback.toast;

import AxiosHttp from "../../../../../utils/AxiosHttp.js";

export default class AddClass extends Component {
  static displayName = "AddClass";

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      checked: false,
      value: {
        on_off: '',
      },
    };
    this.field = new Field(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(checked) {
    this.setState({
      checked
    });
  }

  componentDidMount() {
    //注册父组件调用的方法
    this.props.registerInvokingEvent(this);
  }
  handleSubmit = () => {
    this.field.validate((errors, values) => { //校验并获取一组输入域的值与 Error
      if (errors) {
        console.log("Errors in form!!!");
        return;
      } else {
        
        AxiosHttp.post("/shift/addShift", values)
          .then(res => {
            let { ok } = res;
            if (ok === 1) {
              this.onClose();
              Toast.success("添加成功");
              this.field.reset();
              // 触发 父组件方法  重新请求列表数据
              this.props.addClassValues();
            }else{
               Toast.prompt(res.desc);
            }
          })
          .catch(error => {
            console.log(error);
          });
      };
    });
  };
  onOpen = () => {
    this.setState({
      visible: true
    });
  };
  onClose = () => {
    this.setState({
      visible: false
    });
  };
  // 早午晚班下拉框选择
  onClassChange(type, value) {

  }

  render() {
    // const init = this.field.init;
    const { init, getValue, reset } = this.field;
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
        <Dialog
          style={{ width: 640 }}
          visible={this.state.visible}
          onOpen={this.onOpen}
          onOk={this.handleSubmit}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="添加班别"
        >
          <Form
            direction="ver"
            field={this.field}
          >
           
             <FormItem {...formItemLayout} label="名称">
                    <Input
                      placeholder="请输入名称"
                      style={{ width: '300px' }}
                      {...init("name", {
                        rules: [{ required: true, message: "必填选项" }]
                      })}
                    />
            </FormItem>
           
            
            {/* <FormItem label="班别：" {...formItemLayout}>
              <Input
                  placeholder="请输入班别"
                  style={{ width: '300px' }}
                  {...init("shift",{
                    rules: [{ required: true, message: "必填选项" }]
                  })}
                />
            </FormItem>
            <Row >
            <Col span="11">
             <FormItem label="时间：" {...formItemLayout}>
              <TimePicker
                format="HH:mm"
                style={{ width: '150px', }}
                name="shift_start_time"
                {...init("shift_start_time", {
                  rules: [{ required: true, message: "必填选项" }]
                })}
              />
            </FormItem>
            </Col>
            <Col span="11" offset="1">
            <FormItem   {...formItemLayout}>
              <TimePicker
                format="HH:mm"
                style={{ width: '150px', float:'right' }}
                name="shift_end_time"
                {...init("shift_end_time", {
                  rules: [{ required: true, message: "必填选项" }]
                })}
              />
            </FormItem>
            </Col>
            </Row>
            <FormItem label="休息名称：" {...formItemLayout}>
              <Input
                  placeholder="请输入休息名称"
                  style={{ width: '300px' }}
                  {...init("rest_time",{
                    rules: [{ required: true, message: "必填选项" }]
                  })}
                />
            </FormItem> 
            <Row >
            <Col span="11">
            <FormItem label="休息时间：" {...formItemLayout}>
              <TimePicker
                format="HH:mm"
                style={{ width: '150px', }}
                name="rest_start_time"
                {...init("rest_start_time", {
                  rules: [{ required: true, message: "必填选项" }]
                })}
              />
            </FormItem>
            </Col>
            <Col span="11" offset="1">
              <FormItem  {...formItemLayout}>
                <TimePicker
                  format="HH:mm"
                  style={{ width: '150px', float:'right' }}
                  name="rest_end_time"
                  {...init("rest_end_time", {
                    rules: [{ required: true, message: "必填选项" }]
                  })}
                />
              </FormItem>
            </Col>
            </Row> */}
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
