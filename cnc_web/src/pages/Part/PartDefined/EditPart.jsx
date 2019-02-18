import React, { Component } from "react";
import { Dialog, Button, Form, Input, Field, Grid } from "@icedesign/base";
import AxiosHttp from "../../../utils/AxiosHttp";

const FormItem = Form.Item;
const {Row, Col} = Grid;

export default class EditPart extends Component {
  static displayName = "EditPart";

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataIndex: null
    };
    this.field = new Field(this);
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
      if (errors) {
        console.log("Errors in form!!!");
        return;
      }else{
        this.handleRespone(values)
      }
     
    });
  };

  render() {
    const init = this.field.init;
    // console.log('init:'+init)
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
          <Form labelAlign="top" field={this.field}>
          <Row>
            <Col span="11">
            <FormItem label="类型：" {...formItemLayout}>
              <Input
               hasClear
                {...init("type", {
                  rules: [{ required: true, message: "请填写类型" }]
                })}
              />
            </FormItem>
            </Col>
            <Col span="11" offset="1">
            <FormItem label="名称：" {...formItemLayout}>
              <Input
                hasClear
                {...init("partName", {
                  rules: [{ required: true, message: "请填写名称" }]
                })}
              />
            </FormItem>
            </Col>
            </Row>
            <Row>
            <Col span="11">
            <FormItem label="型号：" {...formItemLayout}>
              <Input
                hasClear
                {...init("model", {
                  rules: [{ required: true, message: "请填写型号" }]
                })}
              />
            </FormItem>
            </Col>
            <Col span="11" offset="1">
            <FormItem label="版本：" {...formItemLayout}>
              <Input
               hasClear
                {...init("version", {
                  rules: [
                    {
                      required: true,
                      message: "请填写版本号"
                    }
                  ]
                })}
              />
            </FormItem>
            </Col>
            </Row>
            <Row>
            <Col span="11">
            <FormItem label="联系人：" {...formItemLayout}>
              <Input
               hasClear
                {...init("contact", {
                  rules: [
                    {
                      required: true,
                      message: "请填写联系人",
                    
                    }
                  ]
                })}
              />
            </FormItem>
            </Col>
            <Col span="11" offset="1">
            <FormItem label="网址：" {...formItemLayout}>
              <Input
               hasClear
                {...init("website", {
                  rules: [
                    {
                      required: true,
                      message: "请填写网址",
                    
                    }
                  ]
                })}
              />
            </FormItem>
            </Col>
            </Row>
            <Row>
                <Col span="11">
            <FormItem label="说明书：" {...formItemLayout}>
              <Input
               hasClear
                {...init("instructions", {
                  rules: [
                    {
                      required: true,
                      message: "请填写说明",
                    
                    }
                  ]
                })}
              />
            </FormItem>
            </Col>
            <Col span="11" offset="1">
            <FormItem label="图片：" {...formItemLayout}>
              <Input
               hasClear
                {...init("img", {
                  rules: [
                    {
                      required: true,
                      message: "请填写图片地址",
                    
                    }
                  ]
                })}
              />
            </FormItem>
            </Col>
          </Row>
          <Row>
              <Col span="11">
            <FormItem label="供应商：" {...formItemLayout}>
              <Input
               hasClear
                {...init("supplier", {
                  rules: [
                    {
                      required: true,
                      message: "请填写供应商",
                    
                    }
                  ]
                })}
              />
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
