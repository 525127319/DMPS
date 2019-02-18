import React, { Component } from "react";
import IceContainer from "@icedesign/container";
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
  Dropdown,
  Menu,
  Select
} from "@icedesign/base";
import Equipment from '@/components/Equipment/Equipment'        //设备类型
import Brand from '@/components/Brand/Brand'                   //品牌名
import AxiosHttp from "../../../utils/AxiosHttp";
import DevicetypeUtil from "@/utils/DevicetypeUtil";
import "./UploadFilesType.scss";

const { Row, Col } = Grid;
const Toast = Feedback.toast;
const FormItem = Form.Item;
const token = sessionStorage.getItem("tocken");
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

export default class AddEquipmentType extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      visible: false,
      isShow: false,
      UploadFileUrl: ""
    };
    this.field = new Field(this);
  }

  beforeUpload(info) {
    // console.log("beforeUpload callback : ", info);
  };
  onChange(info) {
    // console.log("onChane callback : ", info);
  };
  onSuccess(data) {
    console.log("onSuccess : ", data);
  };
  onRemove = data => {
    console.log(data);
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

  onOpen = () => {
    this.setState({ 
      visible: true,
      isShow: false,
     });
  };
  onClose = () => {
    this.setState({ visible: false });
    this.field.reset()
  };
  onOk = () => {
    this.field.validate((error, values) => {
      if (error) {
        // console.log(error);
        return;
      }
      if (this.state.UploadFileUrl) {
        values.UploadFileUrl = this.state.UploadFileUrl;
      } else {
        Toast.prompt("请选择上传的程序");
        return;
      }
      AxiosHttp.post("/equipmentType/add", values)
        .then(res => {
          // if (!res.ok) {
          //   Toast.error(res.desc);
          //   this.setState({
          //     visible: true,
          //     isShow: true,
          //   })
          // }
          let { ok } = res;
          if (ok === 1) {
            this.onClose();
            DevicetypeUtil.cacheDeviceType();
            Toast.success("添加成功");
            this.field.reset();
            // 触发 父组件方法  重新请求列表数据
            this.props.addEquipmentTypeList();
          }
        })
        .catch(error => {
          console.log(error);
        });
    });
  };

  render() {
    const { init, getValue, reset } = this.field;

    return (
      <div className='main-con-head e-type'>
            <span>设备类型管理 &gt; 设备类型列表 </span>
            <Button onClick={this.onOpen} style={styles.addbtn}>
              <Icon type="add" />添加
            </Button>
        <Dialog
          style={{ width: 640 }}
          visible={this.state.visible}
          onOk={this.onOk}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="新增设备类型"
        >
          <div>
            <Form field={this.field} labelAlign="top">
              <Row >
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
                    <Brand   name={init("name")} {...init("name", {
                                    rules: [{required: true, message: "必填"}]
                                })}/>
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
                    <Equipment  type={init("type")}   {...init("type", {
                                    rules: [{required: true, message: "必填"}]
                                })}/>                   
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="11">
                  {/* <FormItem {...formItemLayout} label="品牌名">
                    <Input
                      placeholder="请输入设备品牌名"
                      {...init("name", {
                        rules: [{ required: true, message: "必填选项" }]
                      })}
                    />
                  </FormItem>
                  <FormItem {...formItemLayout} label="设备类型">
                    <Input
                      placeholder="请输入设备类型"
                      {...init("type", {
                        rules: [{ required: true, message: "必填选项" }]
                      })}
                    />
                  </FormItem>*/}
                  <FormItem {...formItemLayout} label="设备型号">
                    <Input
                      placeholder="请输入设备型号"
                      {...init("model", {
                        rules: [{ required: true, message: "必填选项" }]
                      })}
                    />
                  </FormItem>
                </Col>
                <Col span="11" offset="1">
                  <FormItem {...formItemLayout} label="联系人">
                    <Input
                      placeholder="请输入联系人"
                      {...init("contact", {
                        rules: [{ required: true, message: "必填选项" }]
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
                        rules: [{ 
                          required: true, 
                          message: "请输入一个带有'https://'头部网址，必填",
                          pattern: /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i, 
                        }]
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
          </div>
        </Dialog>
      </div>
    );
  }
}
const styles = {
  pagination: {
    textAlign: "right",
    paddingTop: "26px"
  },
  batchBtn: {
    marginRight: "10px"
  },
  addbtn: {
    float: "right"
  },
  spanstyle: {
    color: "red"
  }
};
