import React, { Component } from 'react';
import { Dialog, Button, Grid, Form, Input, Field, Icon, Select, TreeSelect, Feedback } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import AxiosHttp from '@/utils/AxiosHttp';
import DeviceinfoUtil from '@/utils/DeviceinfoUtil';
import BrandUtil from '@/utils/BrandUtil';
import {
    FormBinderWrapper as IceFormBinderWrapper,
    FormBinder as IceFormBinder,
    FormError as IceFormError,
} from '@icedesign/form-binder';
import Principal from '@/components/Principal/Principal'        //负责人
import Equipment from '@/components/Equipment/Equipment'        //设备类型
import Brand from '@/components/Brand/Brand'                   //品牌名
import Models from '@/components/Models/Models'               //设备型号
import Department from '@/components/Department/Department'  //部门
import Location from '@/components/Location/Location'        //位置
const FormItem = Form.Item;
const { Row, Col } = Grid;
const Toast = Feedback.toast;
const { Combobox } = Select;
export default class AddDialog extends Component {
    static displayName = 'AddDevice';

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isShowNameError: false,
            isShowIpError: false,
            dataIndex: null,
            value: {
                dev_id: 10000,          // 设备编码
                supplier_id: '',        // 供应商id
                type: '',               // 设备类型
                brand_name: '',         // 品牌名称
                model: '',              // 设备型号
                name: '',               // 设备名称
                responsibility_by: '',  // 负责人
                location: '',           // 设备位置
                department: '',         // 部门
                ip: '',
                port: 8193,
                desc: ''
            },
        };
        this.field = new Field(this);
    }

    handleResponse = (response) => {
        if (response.value.length) {
            this.setState({
                value: {
                    dev_id: response.value[0].flagSn + 1,
                    port: 8193,
                },
                visible: false,
            });
        } else {
            let flagSN = this.state.value.dev_id;
            AxiosHttp
                .post('/device/createFlagSn', { flagSn: flagSN, title: "记录SN" })
                .then((res) => {
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    // 页面即将渲染时调用,编码存数据库
    componentWillMount() {
        AxiosHttp
            .get('/device/findFlagSn')
            .then(this.handleResponse)
            .catch((error) => {
                console.log(error);
            });
    }

    // 表格改变
    formChange = (value) => {
         console.log('value', value);
        this.setState({
            isShowNameError: false,
            isShowIpError: false,
            // value: value,
        });
    };


    handleSubmit = () => {
        const _this = this;
        this.postForm.validateAll((errors, values) => {
            let tempBrandname = BrandUtil.getBrandLabelById(values.brand_name);
            if (errors) {
                console.error('Errors in form!!!');
                return;
            } else {
                let deviceInfoDB = {
                    dev_id: values.dev_id,
                    supplier_id: '89456',
                    type: values.type,
                    brand_name: tempBrandname,
                    model: values.model,
                    responsibility_by: values.responsibility_by,
                    name: (values.name).toUpperCase(),
                    location: values.location,
                    department: values.department,
                    conn: {
                        ip: values.ip,
                        port: values.port,
                    },
                    desc: values.desc,
                };
                AxiosHttp.post('/device/create', deviceInfoDB)
                    .then((res) => {
                        if (!res.ok) {
                            if (res.desc === "two") {
                                _this.setState({
                                    visible: true,
                                    isShowNameError: true,
                                    isShowIpError: true,
                                });
                            } else if (res.desc === "name") {
                                _this.setState({
                                    visible: true,
                                    isShowNameError: true,
                                    isShowIpError: false,
                                });
                            } else if (res.desc === "ip") {
                                _this.setState({
                                    visible: true,
                                    isShowNameError: false,
                                    isShowIpError: true,
                                });
                            }
                        } else {
                            if (res.ok === 1) {
                                Toast.success("添加成功");
                                DeviceinfoUtil.cacheDeviceinfo();
                                _this.setState({
                                    value: {
                                        dev_id: values.dev_id + 1,
                                        supplier_id: '',
                                        type: '',
                                        brand_name: '',
                                        model: '',
                                        responsibility_by: '',
                                        name: '',
                                        location: '',
                                        department: '',
                                        ip: '',
                                        port: 8193,
                                        desc: '',
                                    },
                                    visible: false,
                                });
                                // 调用父级的方法
                                _this.props.handleChange(this.props.param.pageIndex);
                            } else {
                                Toast.error("添加失败");
                            }
                        }

                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
    };

    onOpen = (index, record) => {
        this.setState({
            value: {
                dev_id: this.state.value.dev_id,
                type: '',
                brand_name: '',
                model: '',
                name: '',
                responsibility_by: '',
                location: '',
                department: '',
                ip: '',
                port: 8193,
                desc: '',
            },
            visible: true,
            isShowNameError: false,
            isShowIpError: false,
            dataIndex: index,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
            isShowNameError: false,
            isShowIpError: false,
        });
    };

    render() {
        const init = this.field.init;
        const { index, record } = this.props;

        let dev_id = this.state.value.dev_id;
        let port = this.state.value.port;

        const formItemLayout = {
            labelCol: {
                fixedSpan: 6,
            },
            wrapperCol: {
                span: 14,
            },
        };
        // 自定义底部

        const footer = (
            <Button onClick={() => this.handleSubmit()} type="primary" style={styles.save}>
                保存
            </Button>
        );
        return (
            <div style={styles.addDialog}>
                <Button
                    disabled
                    // size="small"
                    onClick={() => this.onOpen(index, record)}
                >
                    <Icon type="add" />添加
                </Button>
                <Dialog
                    style={{ width: 640 }}
                    visible={this.state.visible}
                    onOk={this.handleSubmit}
                    // footer={footer}
                    closable="esc,mask,close"
                    onCancel={this.onClose}
                    onClose={this.onClose}
                    title="添加设备"
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
                                        <FormItem label="设备编码" required  style={{ display: "none" }}>
                                            <IceFormBinder
                                                name="dev_id"
                                                required
                                                message="必填"
                                            >
                                                <Input placeholder="设备编码" value={dev_id} readOnly/>
                                            </IceFormBinder>
                                            <IceFormError name="dev_id"/>
                                        </FormItem>
                                        <FormItem label="设备名称" required>
                                            <IceFormBinder
                                                required
                                                message="请填写设备名称"
                                            >
                                                <Input name="name" placeholder="设备名称" />
                                            </IceFormBinder>
                                            {this.state.isShowNameError && <span style={styles.errormsg}>设备名重复, 请重新填写</span>}
                                            <IceFormError name="name" />
                                        </FormItem>
                                    </Col>
                                    <Col span="11" offset="1">
                                        <FormItem label="负责人" required>
                                            <IceFormBinder
                                                name="responsibility_by"
                                                required
                                                message="请填写负责人"
                                            >
                                                <Principal name="responsibility_by"/>
                                            </IceFormBinder >
                                            <IceFormError name="responsibility_by" />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="11">
                                        <FormItem label="设备类型" required>
                                            <IceFormBinder
                                                name="type"
                                                required
                                                message="请填写设备类型"
                                            >
                                                {/* <Input name="type" placeholder="设备类型"/> */}
                                                {/* <Select
                                                    dataSource={this.state.deviceType}
                                                    style={{ width: 255 }}
                                                    placeholder="请选择"
                                                    name="type"
                                                /> */}
                                                <Equipment name="type"/>
                                            </IceFormBinder>
                                            <IceFormError name="type" />
                                        </FormItem>
                                    </Col>
                                    <Col span="11" offset="1">
                                        <FormItem label="品牌名" required>
                                            <IceFormBinder
                                                name="brand_name"
                                                required
                                                message="请填写品牌名"
                                            >
                                                {/*<Input placeholder="品牌名"/>*/}
                                                {/* <Select
                                                    dataSource={this.state.deviceBrandName}
                                                    style={{ width: 255 }}
                                                    placeholder="请选择"
                                                    name="brand_name"
                                                /> */}
                                                <Brand  name="brand_name"/>
                                            </IceFormBinder>
                                            <IceFormError name="brand_name" />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="11">
                                        <FormItem label="设备型号" required>
                                            <IceFormBinder
                                                required
                                                message="请填写设备型号"
                                            >
                                                 {/*<Input name="model" placeholder="设备型号"/>*/}
                                                 {/*<Select*/}
                                                    {/*dataSource={this.state.deviceModel}*/}
                                                    {/*style={{ width: 255 }}*/}
                                                    {/*placeholder="请选择"*/}
                                                    {/*name="model"*/}
                                                 {/*/>*/}
                                                <Models name="model"/>
                                            </IceFormBinder>
                                            <IceFormError name="model" />
                                        </FormItem>
                                    </Col>
                                    <Col span="11" offset="1">
                                        <FormItem label="部门" required>
                                            <IceFormBinder
                                                name="department"
                                                required
                                                message="请填写部门"
                                            >
                                                {/*<TreeSelect*/}
                                                    {/*treeDefaultExpandAll*/}
                                                    {/*style={{ width: 255 }}*/}
                                                    {/*autoWidth*/}
                                                    {/*dataSource={this.state.devdepartment}*/}
                                                    {/*name="department"*/}
                                                {/*/>*/}
                                                <Department name="department"/>
                                                {/*<Input name="department" placeholder="部门"/>*/}
                                            </IceFormBinder>
                                            <IceFormError name="department" />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="11">
                                        <FormItem label="位置">
                                            <IceFormBinder
                                                name="location"
                                                message="请填写位置"
                                            >
                                                {/* <TreeSelect
                                                    treeDefaultExpandAll
                                                    style={{ width: 255 }}
                                                    autoWidth
                                                    dataSource={this.state.devlocation}
                                                    name="location"
                                                /> */}
                                                {/* <Location  name="location"/> */}
                                                <Input name="location" placeholder="位置"/>
                                            </IceFormBinder>
                                            <IceFormError name="location" />
                                        </FormItem>
                                    </Col>
                                    <Col span="11" offset="1">
                                        <FormItem label="ip" required>
                                            <IceFormBinder
                                                name="ip"
                                                rules={[
                                                    {
                                                        type: 'string',
                                                        required: true,
                                                        // pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                                                        message: '请输入一个合规的 IP，必填',
                                                    },
                                                    {
                                                        validator(rule,
                                                            value,
                                                            callback,
                                                            source,
                                                            options) {
                                                            let errors = [];
                                                            let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

                                                            if (!reg.test(value) && value !== undefined && value !== '') {
                                                                errors.push('填写正确格式的IP');
                                                            }
                                                            callback(errors);
                                                        },
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="ip" />
                                            </IceFormBinder>
                                            {this.state.isShowIpError && <span style={styles.errormsg}>ip重复, 请重新填写</span>}
                                            <IceFormError name="ip" />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="11">
                                        <FormItem label="端口" required>
                                            <IceFormBinder
                                                name="port"
                                                rules={[
                                                    {
                                                        type: "number",
                                                        required: true,
                                                        // pattern: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/,
                                                        message: '请输入一个合规的 port，必填',
                                                    },
                                                    {
                                                        validator(rule,
                                                            value,
                                                            callback,
                                                            source,
                                                            options) {
                                                            let errors = [];
                                                            let reg = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;
                                                            if (!reg.test(value) && value !== undefined && value !== '') {
                                                                errors.push('填写正确格式的port');
                                                            }
                                                            callback(errors);
                                                        },
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="port" />
                                            </IceFormBinder>
                                            <IceFormError name="port" />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <FormItem label="描述">
                                    <IceFormBinder name="desc">
                                        <Input multiple placeholder="这里填写正文描述" />
                                    </IceFormBinder>
                                </FormItem>
                            </Form>
                        </IceContainer>
                    </IceFormBinderWrapper>
                </Dialog>
            </div>
        );
    }
}

const styles = {
    addDialog: {
        display: 'inline-block',
        marginRight: '5px',
        // float: "right"
    },
    batchBtn: {
        marginRight: '10px',
    },
    save: {
        marginRight: '10px'
    },
    errormsg: {
        color: 'red',
        fontSize: '12px',
    }
};
