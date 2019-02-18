import React, { Component } from "react";
import {
  Upload,
  Button,
  Form,
  Feedback,
  Field,
  Dialog,
  Input,
  moment
} from "@icedesign/base";

import AxiosHttp from "@/utils/AxiosHttp.js";
const FormItem = Form.Item;
const Toast = Feedback.toast;
const token = sessionStorage.getItem("tocken");

export default class UploadingFiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      fileUrl: ""
    };
    this.field = new Field(this);
  }

  beforeUpload(info) {
    // console.log("beforeUpload callback : ", info);
  }

  onChange(info) {
    // console.log("onChane callback : ", info);
  }
  onSuccess(data) {
    console.log("onSuccess : ", data);
  }
  // 飞冰组件问题
  onError = error => {
    let { ok, value } = error.response;
    if (ok) {
      Toast.success("程序文件上传成功");
      this.setState({
        fileUrl: value[0]
      });
    } else {
      Toast.error("上传失败");
    }
  };
  onRemove = data => {
    // console.log(data);
  };
  handleSubmit = () => {
    this.field.validate((errors, values) => {
      if (errors) {
        // console.log(errors);
        return;
      }
      // 获取的当前时间
      values.writeTime = moment().format("YYYY-MM-DD H:mm:ss");
      values.time = Date.parse(new Date());
      if (this.state.fileUrl) {
        values.fileUrl = this.state.fileUrl;
      } else {
        Toast.prompt("请选择上传的程序");
        return;
      }

      AxiosHttp.post("/programlist/addprogram", values)
        .then(res => {
          if (res.ok) {
            Toast.success("添加成功");
            this.props.addFiles();
            this.field.reset();
            this.onClose();
            this.setState({
              fileUrl: ""
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    });
  };
  openAdd = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };
  render() {
    const { init, reset } = this.field;
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
        <Button onClick={this.openAdd}>上传</Button>
        <Dialog
          style={{ width: 640 }}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="上传程序及描述"
        >
          <Form direction="ver" field={this.field}>
            <FormItem label="程序名：" {...formItemLayout}>
              <Input
                name="programName"
                {...init("programName", {
                  rules: [{ required: true, message: "必填选项" }]
                })}
              />
            </FormItem>

            <FormItem label="版本号：" {...formItemLayout}>
              <Input
                name="edition"
                {...init("edition", {
                  rules: [{ required: true, message: "必填选项" }]
                })}
              />
            </FormItem>

            <FormItem label="开发者：" {...formItemLayout}>
              <Input
                name="developer"
                {...init("developer", {
                  rules: [{ required: true, message: "必填选项" }]
                })}
              />
            </FormItem>
            <FormItem label="描述：" {...formItemLayout}>
              <Input
                name="describe"
                {...init("describe", {
                  rules: [{ required: true, message: "必填选项" }]
                })}
              />
            </FormItem>
            <Upload
              style={styles.upload}
              listType="text"
              showUploadList //是否显示上传列表
              action={AxiosHttp.feilurl() + "upLoadFile"} // 上传的地址
              data={{ token: "abcd" }}
              headers={{ Authorization: token }}
              beforeUpload={this.beforeUpload}
              onChange={this.onChange}
              onSuccess={this.onSuccess}
              onRemove={this.onRemove}
              onError={this.onError}
              limit={1}
            >
              <Button type="primary">选择程序</Button>
            </Upload>
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
  },
  upload: {
    marginLeft: "48px"
  }
};
