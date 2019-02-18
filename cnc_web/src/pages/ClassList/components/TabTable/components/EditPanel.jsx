import React, { Component } from "react";
import {
  Dialog,
  Button,
  Form,
  Input,
  Field,
  Feedback
} from "@icedesign/base";
import AxiosHttp from "@/utils/AxiosHttp.js";

const FormItem = Form.Item;
const Toast = Feedback.toast;

let shiftname = {};
export default class EditDialog extends Component {
  static displayName = "EditDialog";
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      name:'',
    };
    this.field = new Field(this);
  }
 
  handleSubmit = () => {
    this.field.validate((errors, values) => {
      if (errors) {
        console.log("Errors in form!!!");
        return;
      }
       
      values.shift_id = this.props.shiftArr.shift_id;
      values.id = this.props.shiftArr._id;

      this.props.shiftArr.name = values.name;
      
      AxiosHttp.post("/shift/updateName", this.props.shiftArr).then(res => {
        let { ok } = res;
        if (ok === 1) {
          Toast.success("编辑成功");
          this.props.getEditValues(values);
          this.setState({
            visible: false,
          });
        }else{
          Toast.prompt(res.desc);
        }
      });
    });
  };

  onOpen = (name) => {
    this.field.setValues({name});
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    const {shiftArr} =this.props;
    
    const init = this.field.init;

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
          onClick={() => this.onOpen(shiftArr.name)}
        >
          编辑{shiftArr.name}
          {/* 编辑 */}
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
            <FormItem label="当前班别修改：" {...formItemLayout}>
              <Input
              name="name"
              defaultValue = {shiftArr.name}
                style={{ width: '300px' }}
                {...init("name", {
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
    marginRight: "10px"
  }
};
