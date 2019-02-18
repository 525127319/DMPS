import React, { Component } from "react";
import { Dialog, Button, Form, Input,Feedback, Field, Switch, Grid } from "@icedesign/base";
import AxiosHttp from "../../../utils/AxiosHttp";
import IceContainer from '@icedesign/container';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
const FormItem = Form.Item;
const {Row, Col} = Grid;
const Toast = Feedback.toast;
export default class EditStrategy extends Component {
  static displayName = "EditStrategy";

  static defaultProps = {};

  constructor(props) {
    super(props);
    // console.log(props);
    this.state = {
      visible: false,
      dataIndex: null,
      checked: false
    };
    this.field = new Field(this);
    this.onChange = this.onChange.bind(this);
  }

 
// 打开弹窗
  onOpen = (index, record) => {
   console.log('record:'+ record)
   this.field.setValues({ ...record }); //回显数据
    this.setState({
      visible: true,
      dataIndex: index
    });
  };
// 关闭弹窗
  onClose = () => {
    this.setState({
      visible: false
    });
  };
 //回调父页面更新数据。
 handleRespone = function(res) {
    const { dataIndex } = this.state;
    this.props.getFormValues(dataIndex, res);
    this.setState({
      visible: false
    });
  }.bind(this);
// 提交信息
handleSubmit = () => {
    this.field.validate((errors, values) => {
      if(this.state.checked==true){
        values.enable = '是'
      }else{
        values.enable = '否'
      }
      if (errors) {
        console.log("Errors in form!!!");
        return;
      }else{
        // console.log(values,909099999)
        AxiosHttp.post('/strategy/update',values).then(res=>{
          let { ok } = res;
        if (ok === 1) {
          Toast.success("编辑成功");
           this.handleRespone(values)
        }
        })
      }
     
    });
  };
  // 启用开关
  onChange(checked) {
    this.setState({ checked });
    console.log('checked:',this.state.checked)
  }

  render() {
    const init = this.field.init;
    let checkstatus = this.state.checked;
    console.log('init:'+init)
    const { index, record } = this.props;
    const formItemLayout = {
      labelCol: {
        fixedSpan: 8
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
          onClick={() => this.onOpen(index, record) }
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
          <Form labelAlign="top" field={this.field}>
          <Row>
            <Col span="11">
            <FormItem label="工厂：" {...formItemLayout}>
              <Input
               hasClear
                {...init("company", {
                  rules: [{ required: true, message: "请填写工厂" }]
                })}
              />
            </FormItem>
            </Col>
            <Col span="11" offset="1">
            <FormItem label="设备类型：" {...formItemLayout} >
              <Input
                hasClear
                
                {...init("devType", {
                  rules: [{ required: true, message: "请填写设备类型" }]
                })}
              />
            </FormItem>
            </Col>
            </Row>
            <Row>
                <Col span="11">
            <FormItem label="保养名称：" {...formItemLayout}>
              <Input 
                hasClear
                {...init("maintenanceName", {
                  rules: [{ required: true, message: "请填写保养名称" }]
                })}
              />
            </FormItem>
            </Col>
              <Col span="11" offset="1">
            <FormItem label="工作时保养时长(小时)：" {...formItemLayout}>
              <Input
               hasClear
                {...init("workingTime", {
                  rules: [
                    {
                      required: true,
                      message: "请填写工作时保养时长号"
                    }
                  ]
                })}
              />
            </FormItem>
            </Col>
          </Row>
          <Row>
              <Col span="11">
            <FormItem label="空闲时保养时长(小时)：" {...formItemLayout}>
              <Input
               hasClear
                {...init("freeTime", {
                  rules: [
                    {
                      required: true,
                      message: "请填写空闲时保养时长",
                    
                    }
                  ]
                })}
              />
            </FormItem>
            </Col>
            <Col span="11" offset="1">
            <FormItem label="零件：" {...formItemLayout}>
              <Input
               hasClear
                {...init("part", {
                  rules: [
                    {
                      required: true,
                      message: "请填写零件",
                    
                    }
                  ]
                })}
              />

            </FormItem>
            </Col>
              </Row>
              <Row>
                  <Col span="11">
            {/* <FormItem label="启用：" {...formItemLayout}>
              <Input
               hasClear
                {...init("enable", {
                  rules: [
                    {
                      required: true,
                      message: "请填写启用",
                    
                    }
                  ]
                })}
              />
            </FormItem> */}
            <FormItem label="备注：" {...formItemLayout}>
              <Input
               hasClear
                {...init("note", {
                  rules: [
                    {
                      required: true,
                      message: "请填写备注信息",
                    
                    }
                  ]
                })}
              />
            </FormItem>
            </Col>
             <Col span="11" offset="1">
            <FormItem label="是否启用：" {...formItemLayout} >
                  <Switch {...init('enable',{
              
            })} checked={checkstatus} onChange={this.onChange} />
            </FormItem>
            </Col>
            </Row>
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
