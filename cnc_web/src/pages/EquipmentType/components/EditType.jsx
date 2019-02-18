import React, { Component } from "react";
import {
  Form,
  Input,
  Switch,
  Grid,
  Button,
  Icon,
  Balloon,
  Field,
  Dialog,
  Feedback,
  Upload,
  Select
} from "@icedesign/base";

import "./UploadFilesType.scss";
import AxiosHttp from "../../../utils/AxiosHttp";
import DevicetypeUtil from "@/utils/DevicetypeUtil";
import Equipment from '@/components/Equipment/Equipment'        //设备类型
import Brand from '@/components/Brand/Brand'                   //品牌名
const Toast = Feedback.toast;
const { Row, Col } = Grid;
const token = sessionStorage.getItem("tocken");
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

export default class EditType extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false, getVal: null, UploadFileUrl: "" };
    this.field = new Field(this);
  }

  beforeUpload(info) {
    // console.log("beforeUpload callback : ", info);
  };
  onChange(info) {
    // console.log("onChane callback : ", info);
  };
  onSuccess(data) {
    // console.log("onSuccess : ", data);
  };
  onRemove = data => {
    // console.log(data);
  };
  // 文件上传
  onError = error => {
    let { ok, value } = error.response;   
    if (ok) {
      Toast.success("程序文件上传成功");
      this.setState({
        UploadFileUrl: value[0],
        visible: true,  
         isShow: true,
      });
      
    } else {
      Toast.error("上传失败");
    }
  };

  onOpen = (index, record) => {
    this.field.setValues({ ...record });
    this.setState({
      visible: true,
      dataIndex: index
    });
  };
  onClose = () => {
    this.setState({ visible: false, });
  };
  onOk = () => {
    this.field.validate((error, values) => {
      if (error) {
        console.log(error);
        return;
      }
      if (this.state.UploadFileUrl) {
        values.UploadFileUrl = this.state.UploadFileUrl;
      } 
      AxiosHttp.post("/equipmentType/update", values).then(res => {
        let { ok, data, status, statusText } = res;
        // console.log(res);
        if (ok === 1) {
          DevicetypeUtil.cacheDeviceType();
          Toast.success("编辑成功");
          this.handleRespone(values);
        }
      });
    });
  };

  handleRespone(data) {
    //触发回调   通知父组件修改data
    const { dataIndex } = this.state;
    // console.log(data);
    this.props.editTypeInfo(dataIndex, data);
    this.setState({
      visible: false
    });
  }

  render() {
    const { init } = this.field;
    const { index, record } = this.props;
    return (
      <span>
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
          onOk={this.onOk}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="编辑设备类型信息"
        >
          <Form field={this.field} labelAlign="top">
            <Row>
              <Col span="11">
                <FormItem label="品牌名">
                  {/* <Select
                    {...init("name", {
                      rules: [
                        {
                          required: true,
                          message: "必填选项"
                        }
                      ]
                    })}
                    style={{ width: 270 }}>
                      <option value="发那科">发那科</option>
                      <option value="三凌">三凌</option>
                    </Select> */}
                  <Brand name={init("name")} {...init("name", {
                    rules: [{ required: true, message: "必填" }]
                  })} />
                </FormItem>
              </Col>
              <Col span="11" offset="1">
                <FormItem label="设备类型">
                  {/* <Select  
                    {...init("type", {
                      rules: [
                        {
                          required: true,
                          message: "必填选项"
                        }
                      ]
                    })}
                    style={{ width: 270 }}>
                      <option value="机器人">机器人</option>
                      <option value="CNC">CNC</option>
                      <option value="水表">水表</option>
                    </Select> */}
                  <Equipment type={init("type")}   {...init("type", {
                    rules: [{ required: true, message: "必填" }]
                  })} />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="11">
                <FormItem {...formItemLayout} label="设备型号">
                  <Input
                    placeholder="请输入设备型号"
                    {...init("model", {
                      rules: [
                        {
                          required: true,
                          message: "必填选项"
                        }
                      ]
                    })}
                  />
                </FormItem>
              </Col>
              <Col span="11" offset="1">
                <FormItem {...formItemLayout} label="联系人">
                  <Input
                    placeholder="请输入联系人"
                    {...init("contact", {
                      rules: [
                        {
                          required: true,
                          message: "必填选项"
                        }
                      ]
                    })}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="11">
                <FormItem {...formItemLayout} label="公司网站">
                  <Input
                    placeholder="请输入公司网站"
                    {...init("website", {
                      rules: [
                        {
                          required: true,
                          message: "必填选项",
                          pattern: /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i,
                        }
                      ]
                    })}
                  />
                </FormItem>
              </Col>
              <Col span="11" offset="1">
                <FormItem {...formItemLayout} label="说明书">
                  <Upload
                    listType="text"  //上传列表的样式
                    showUploadList //是否显示上传列表
                    action={AxiosHttp.feilurl() + "upLoadFile"} // 上传的地址
                    data={{ token: "abcd" }}
                    headers={{ Authorization: token }}
                    beforeUpload={this.beforeUpload}
                    onChange={this.onChange}
                    onSuccess={this.onSuccess}
                    onError={this.onError}
                    limit={1}  //最大文件上传个数
                  >
                    <Button type="primary" size="small">上传文件</Button>
                  </Upload>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Dialog>
      </span>
    );
  }
}
const style = { padding: "20px", background: "#F7F8FA", margin: "20px" };
