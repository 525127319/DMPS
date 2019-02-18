import React, { Component } from "react";
import { Form, Input, Button, Field, Dialog } from "@icedesign/base";

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
};

export default class EditType extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false, title: null };
    this.field = new Field(this);
    this.title = "保养记录";
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  onOpen = record => {
    if (record && record.deviceName) {
      this.title = record.deviceName + "的保养记录";
    }
    this.field.setValues({ ...record });
    this.setState({
      visible: true,
      title: this.title
    });
  };
  onClose = () => {
    this.setState({ visible: false });
  };
  render() {
    const footer = <Button onClick={this.onClose}>关闭</Button>;
    const { init } = this.field;
    const { index, record } = this.props;
    return (
      <span>
        <Dialog
          visible={this.state.visible}
          footer={footer}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title={this.state.title}
          style={styles.dialog}
        >
          <Form field={this.field}>
            <FormItem {...formItemLayout} label="设备保养明细">
              <Input multiple readOnly {...init("name")} />
            </FormItem>
            <FormItem {...formItemLayout} label="保养更换明细">
              <Input multiple readOnly {...init("name")} />
            </FormItem>
            <FormItem {...formItemLayout} label="前后对比">
              <Input readOnly {...init("name")} />
            </FormItem>
          </Form>
        </Dialog>
      </span>
    );
  }
}
const styles = {
  dialog: { width: "800px" }
};
