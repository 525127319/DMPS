import React, { Component } from 'react';
import { Dialog, Button,Grid, Form, Input, Field, Icon, Switch, Feedback } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import AxiosHttp from '../../../utils/AxiosHttp.js';
import {
    FormBinderWrapper as IceFormBinderWrapper,
    FormBinder as IceFormBinder,
    FormError as IceFormError,
  } from '@icedesign/form-binder';
  const FormItem = Form.Item;
  const { Row, Col } = Grid;
  const Toast = Feedback.toast;
export default class AddStrategy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dataIndex: null,
            checked: false,
            value: {
                company: '', 
                devType: '',
                maintenanceName: '', 
                workingTime: '',
                freeTime: '',
                part: '',
                note: '',
                enable: '',
            },
        }
        this.field = new Field(this);
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
        
    };
    // 打开弹窗
    onOpen = () => {
        
        this.setState({
            visible: true,
            value: {},
            
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
        // console.log('value', value);
        this.setState({
        value: value,
        });
    };

    // 提交信息
    handleSubmit = () => {
        this.postForm.validateAll((errors, values) => {
            // console.log(values,'5050')
            if (errors) {
                console.error('Errors in form!!!');
                return;
              } else {
                  if(values.enable){
                      values.enable = '是'
                  }else{
                    values.enable = '否'
                  }
                //   let strategyInfo = {
                //     company: values.company, 
                //     devType: values.devType,
                //     maintenanceName: values.maintenanceName, 
                //     workingTime: values.workingTime,
                //     freeTime: values.freeTime,
                //     part: values.part,
                //     note: values.note,
                //     enable: values.enable,
                //   }
                  AxiosHttp.post('/strategy/create',values).then(res=>{
                      console.log('res:'+res)
                      let {ok} = res;
                      if(ok ===1){
                          Toast.success('添加成功');
                          // 添加成功后清空表格
                          this.setState({
                            value: {
                                company: '', 
                                devType: '',
                                maintenanceName: '', 
                                workingTime: '',
                                freeTime: '',
                                part: '',
                                note: '',
                                enable: '',
                            },
                            visible: false,
                          })
                          this.props.handleChange(this.props.param.pageIndex)
                      }else{
                          Toast.error('添加失败')
                      }
                  }).catch(error=>{
                      console.log(error)
                  })
                // console.log(this.props.dataSource,8080)
                // let newArray = this.props.dataSource.slice();
                // newArray.push(values);
                // this.props.updateData(newArray);
                // this.setState({
                //     visible: false,
                // })
              }
        })
    }
     // 启用开关
  onChange(checked) {
    this.setState({ checked });
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
                                    <FormItem label="工厂" required>
                                        <IceFormBinder
                                            name="company"
                                            required
                                            message="请输入工厂"
                                        >
                                        <Input placeholder="请输入工厂" />
                                        </IceFormBinder>
                                        <IceFormError name="company" />
                                    </FormItem>
                                    </Col>
                                    <Col span="11" offset="1">
                                    <FormItem label="设备类型" required>
                                        <IceFormBinder
                                            required
                                            message="请输入设备类型"
                                        >
                                        <Input name="devType" placeholder="请输入设备类型" />
                                        </IceFormBinder>
                                        <IceFormError name="devType" />
                                    </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="11">
                                    <FormItem label="保养名称" required>
                                        <IceFormBinder
                                            name="maintenanceName"
                                            required
                                            message="请输入保养名称"
                                        >
                                        <Input placeholder="请输入保养名称" />
                                        </IceFormBinder>
                                        <IceFormError name="maintenanceName" />
                                    </FormItem>
                                    </Col>
                                    <Col span="11" offset="1">
                                    <FormItem label="工作时保养时长(小时)" required>
                                        <IceFormBinder
                                        name="workingTime"
                                        required
                                        message="请输入工作时保养时长"
                                        >
                                        <Input placeholder="请输入工作时保养时长"/>
                                        </IceFormBinder>
                                        <IceFormError name="workingTime" />
                                    </FormItem>
                                    </Col>
                                    </Row>
                                <Row>
                                    <Col span="11">
                                    <FormItem label="空闲时保养时长(小时)" required>
                                        <IceFormBinder
                                        name="freeTime"
                                        required
                                        message="请输入空闲时保养时长"
                                        >
                                        <Input placeholder="请输入空闲时保养时长" />
                                        </IceFormBinder>
                                        <IceFormError name="freeTime" />
                                    </FormItem>
                                    </Col>
                                    <Col span="11" offset="1">
                                    <FormItem label="零件" required>
                                        <IceFormBinder
                                        name="part"
                                        required
                                        message="请输入零件"
                                        >
                                        <Input placeholder="请输入零件" />
                                        </IceFormBinder>
                                        <IceFormError name="part" />
                                    </FormItem>
                                    </Col>
                                </Row>
                                
                                    {/* <Col span="11">
                                    <FormItem label="启用" required>
                                        <IceFormBinder
                                        name="enable"
                                        required
                                        message="请输入启用"
                                        >
                                        <Input placeholder="请输入启用" />
                                        </IceFormBinder>
                                        <IceFormError name="enable" />
                                    </FormItem>
                                    </Col> */}
                                   
                                    <FormItem label="备注" required>
                                        <IceFormBinder
                                        name="note"
                                        required
                                        message="请输入备注地址"
                                        >
                                        <Input multiple placeholder="请输入备注地址" />
                                        </IceFormBinder>
                                        <IceFormError name="note" />
                                    </FormItem>
                                    
                              
                                <FormItem label="是否启用：" >
                                     <IceFormBinder
                                        name="enable"
                                      
                                        >
                                      <Switch checked={this.state.checked} onChange={this.onChange} />
                                      </IceFormBinder>
                                    <IceFormError name="enable" />
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
  