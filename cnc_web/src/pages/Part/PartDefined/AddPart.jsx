import React, { Component } from 'react';
import { Dialog, Button,Grid, Form, Input, Field, Icon, Upload } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import {
    FormBinderWrapper as IceFormBinderWrapper,
    FormBinder as IceFormBinder,
    FormError as IceFormError,
  } from '@icedesign/form-binder';
  const FormItem = Form.Item;
  const { Row, Col } = Grid;

//   上传说明书
  function beforeUpload(info) {
    
    console.log("beforeUpload callback : ", info);
  }
  
  function onChange(info) {
    console.log("onChane callback : ", info);
  }
//   上传图片
function beforeUpload2(info) {
    
    console.log("beforeUpload callback : ", info);
  }
  
  function onChange2(info) {
    console.log("onChane callback : ", info);
  }
export default class AddPart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dataIndex: null,
            value: {
                type: '', 
                partName: '',
                model: '', 
                version: '',
                contact: '',
                website: '',
                instructions: '',
                img: '',
                supplier: '',
            },
        }
    };
    // 打开弹窗
    onOpen = () => {
        this.setState({
            visible: true
        });
    };
    // 关闭弹窗
    onClose = () => {
        this.setState({
            visible: false,
        });
    };
      // 表格改变事件
    formChange = (value) => {
        console.log('value', value);
        this.setState({
        value: value,
        });
    };

    // 提交信息
    handleSubmit = () => {
        this.postForm.validateAll((errors, values) => {
            console.log(values,'9090')
            if (errors) {
                console.error('Errors in form!!!');
                return;
              } else {
                console.log(this.props.dataSource,8080)
                let newArray = this.props.dataSource.slice();
                newArray.push(values);
                this.props.updateData(newArray);
                // 添加成功清空表格
                this.setState({
                    value: {
                        type: '', 
                        partName: '',
                        model: '', 
                        version: '',
                        contact: '',
                        website: '',
                        supplier: '',
                    },
                    visible: false,
                })
              }
        })
    }  
    render() {
        return (
            <div>
                <span>
                    <Button onClick={this.onOpen} type="normal">
                    <Icon type="add" />添加
                   </Button>
                    <Dialog
                        visible={this.state.visible}
                        onOk={this.handleSubmit}
                        closable="esc,mask,close"
                        onCancel={this.onClose}
                        onClose={this.onClose}
                        style={{ width: 640 }}
                        title="添加零件"
                    >
                         <IceFormBinderWrapper
                            ref={(refInstance) => {
                                this.postForm = refInstance;
                            }}
                            value={this.state.value}
                            onChange={this.formChange}
                            >
                            <IceContainer>
                                <Form labelAlign="top" style={styles.form}>
                                <Row>
                                    <Col span="11">
                                    <FormItem label="类型" required>
                                        <IceFormBinder
                                            name="type"
                                            required
                                            message="请输入类型"
                                        >
                                        <Input placeholder="请输入类型" />
                                        </IceFormBinder>
                                        <IceFormError name="type" />
                                    </FormItem>
                                    </Col>
                                    <Col span="11" offset="1">
                                    <FormItem label="名称" required>
                                        <IceFormBinder
                                            required
                                            message="请输入名称"
                                        >
                                        <Input name="partName" placeholder="请输入名称" />
                                        </IceFormBinder>
                                        <IceFormError name="partName" />
                                    </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="11">
                                    <FormItem label="型号" required>
                                        <IceFormBinder
                                            name="model"
                                            required
                                            message="请输入型号"
                                        >
                                        <Input placeholder="请输入型号" />
                                        </IceFormBinder>
                                        <IceFormError name="model" />
                                    </FormItem>
                                    </Col>
                                    <Col span="11" offset="1">
                                    <FormItem label="版本" required>
                                        <IceFormBinder
                                        name="version"
                                        required
                                        message="请输入版本"
                                        >
                                        <Input placeholder="请输入版本"/>
                                        </IceFormBinder>
                                        <IceFormError name="version" />
                                    </FormItem>
                                    </Col>
                                    </Row>
                                <Row>
                                    <Col span="11">
                                    <FormItem label="联系人" required>
                                        <IceFormBinder
                                        name="contact"
                                        required
                                        message="请输入联系人"
                                        >
                                        <Input placeholder="请输入联系人" />
                                        </IceFormBinder>
                                        <IceFormError name="contact" />
                                    </FormItem>
                                    </Col>
                                    <Col span="11" offset="1">
                                    <FormItem label="网址" required>
                                        <IceFormBinder
                                        name="website"
                                        required
                                        message="请输入网址"
                                        >
                                        <Input placeholder="请输入网址" />
                                        </IceFormBinder>
                                        <IceFormError name="website" />
                                    </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="11">
                                    <FormItem label="供应商" required>
                                        <IceFormBinder
                                        name="supplier"
                                        required
                                        message="请输入供应商"
                                        >
                                        <Input placeholder="请输入供应商" />
                                        </IceFormBinder>
                                        <IceFormError name="supplier" />
                                    </FormItem>
                                    </Col>
                                    <Col span="11" offset="1">
                                    <FormItem label="图片" required>
                                        <Upload
                                            style={styles.upload}
                                            listType="text"
                                            showUploadList //是否显示上传列表
                                            action="" // 上传的地址
                                            accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                                            data={{ token: "abcd" }}
                                            beforeUpload2={beforeUpload2}
                                            onChange2={onChange2}
                                            >   
                                            <Button type="primary" style={{ margin: "0 0 10px" }}>
                                            上传图片
                                            </Button>
                                        </Upload>  
                                    </FormItem>
                                    </Col>
                                </Row>
                                <FormItem label="说明书" required>
                                      <Upload
                                        style={styles.upload}
                                        listType="text"
                                        showUploadList //是否显示上传列表
                                        action="" // 上传的地址
                                        data={{ token: "abcd" }}
                                        beforeUpload={beforeUpload}
                                         onChange={onChange}
                                        >   
                                        <Button type="primary" style={{ margin: "0 0 10px" }}>
                                        上传文件
                                        </Button>
                                    </Upload>                                    
                                </FormItem>
                              
                                </Form>
                            </IceContainer>
                            </IceFormBinderWrapper>
                       
                    </Dialog>
                </span>
            </div>
        )
    }
}
const styles = {
    addDialog: {
      display: 'inline-block',
      marginRight: '5px',
    },
    batchBtn: {
      marginRight: '10px',
    },
    save:{
      marginRight: '10px'
    }
  };
  