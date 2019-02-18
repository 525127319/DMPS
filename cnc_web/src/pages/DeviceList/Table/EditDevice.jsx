import React, {Component} from "react";
import {Dialog, Button, Form, Input, Grid, Field, Select, TreeSelect} from "@icedesign/base";
import AxiosHttp from "@/utils/AxiosHttp";
import DeviceinfoUtil from '@/utils/DeviceinfoUtil';
import DevicetypeUtil from "@/utils/DevicetypeUtil";
import DepartmentUtil from "@/utils/DepartmentUtil";
import Principal from '@/components/Principal/Principal'        //负责人
import Equipment from '@/components/Equipment/Equipment'        //设备类型
import Brand from '@/components/Brand/Brand'                   //品牌名
import Models from '@/components/Models/Models'               //设备型号
import Department from '@/components/Department/Department'  //部门
import Location from '@/components/Location/Location'        //位置

const FormItem = Form.Item;
const {Row, Col} = Grid;

export default class EditDialog extends Component {
    static displayName = "EditDevice";

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dataIndex: null,
            deviceType: [],
            deviceBrandName: [],
            deviceModel: [],
            devlocation: [],
            devdepartment: [],
        };
        this.field = new Field(this, {
            parseName: true
        });
    }

    //回調父頁面更新數據。
    handleRespone = function (res) {
        const {dataIndex} = this.state;
        this.props.getFormValues(dataIndex, res);
        this.setState({
            visible: false
        });
    }.bind(this);

    handleSubmit = () => {
        this.field.validate((errors, values) => {
            if (errors) {
                console.log("Errors in form!!!");
                return;
            }
            AxiosHttp.post("/device/update", values).then(res => {
                console.log("res:  " + res);
                if (!res.ok) {
                    if (res.desc === "two") {
                        this.field.setErrors({ "conn.ip": "ip重复, 请重新填写", "name": "设备名重复, 请重新填写" });
                        this.setState({
                            visible: true,
                        });
                    } else if (res.desc === "name") {
                        this.field.setErrors({ "name": "设备名重复, 请重新填写" });
                        this.setState({
                            visible: true,
                        });
                    } else if (res.desc === "ip") {
                        this.field.setErrors({ "conn.ip": "ip重复, 请重新填写" });
                        this.setState({
                            visible: true,
                        });
                    }

                } else {
                    DeviceinfoUtil.cacheDeviceinfo();
                    this.handleRespone(values);
                }
            });
        });
    };

    handledevicetype = function (data) {
        this.setState({
            deviceType: data
        });
    }.bind(this);

    handledevBrandName = function (data) {
        this.setState({
            deviceBrandName: data
        });
    }.bind(this);

    handledevModel = function (data) {
        this.setState({
            deviceModel: data
        });
    }.bind(this);


    handledevdepartment = function(data) {
        this.setState({
            devdepartment: data
        });
    }.bind(this);

    handledevlocation = function (data) {
        this.setState({
            devlocation: data
        });
    }.bind(this);

    onOpen = (index, record) => {
        this.field.setValues({...record}); //設置初始化value，在瀉染時候init被使用value
        this.setState({
            visible: true,
            dataIndex: index,
            isShowNameError: false,
            isShowIpError: false,
        });
        this.field.setErrors({ "conn.ip": "", "conn.port": "", "name": "" });

        let devicetype = DevicetypeUtil.getDevicetype();
        this.handledevicetype(devicetype);

        let deviceBrandName = DevicetypeUtil.getBrandName();
        this.handledevBrandName(deviceBrandName);

        let deviceModel = DevicetypeUtil.getModel();
        this.handledevModel(deviceModel);

        DepartmentUtil.getDepartmentTree().then((res) => {
            let departmentdata = res;
            this.handledevdepartment(departmentdata);
        });

        DepartmentUtil.getLocationTree().then((res) => {
            let locationdata = res;
            this.handledevlocation(locationdata);
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
        const {index, record} = this.props;
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
                    disabled
                    size="small"
                    type="primary"
                    onClick={() => this.onOpen(index, record)}
                >
                    编辑
                </Button>
                <Dialog
                    style={{width: 640}}
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
                        <FormItem label="设备编码：" {...formItemLayout} style={{ display: "none" }}>
                            <Input
                                readOnly
                                {...init("dev_id", {
                                    rules: [{required: true, message: "必填"}]
                                })}
                            />
                        </FormItem>
                        <FormItem label="设备名称：" {...formItemLayout}>
                            <Input
                                trim
                                hasClear
                                {...init("name", {
                                    rules: [{required: true, message: "必填"}]
                                })}
                            />
                        </FormItem>
                        </Col>
                        <Col span="11" offset="1">
                        <FormItem label="负责人：" {...formItemLayout}>
                            {/* <Input
                                hasClear
                                {...init("responsibility_by", {
                                    rules: [{required: true, message: "必填"}]
                                })}  
                                    
                            /> */}
                            <Principal   responsibility_by={init("responsibility_by")}    hasClear  {...init("responsibility_by", {
                                    rules: [{required: true, message: "必填"}]
                                })}/>
                        </FormItem>
                        </Col>
                        </Row>
                        <Row>
                            <Col span="11">
                        <FormItem label="设备类型：" {...formItemLayout}>
                            {/*<Input*/}
                                {/*hasClear*/}
                                {/*{...init("type", {*/}
                                    {/*rules: [{required: true, message: "必填"}]*/}
                                {/*})}*/}
                            {/*/>*/}
                            {/* <Select
                                hasClear
                                dataSource={this.state.deviceType}
                                style={{width: 255}}
                                placeholder="请选择"
                                name="type"
                                defaultValue={devtype}
                                {...init("type", {
                                    rules: [{required: true, message: "必填"}]
                                })}
                             
                            /> */}
                            <Equipment  type={init("type")}   {...init("type", {
                                    rules: [{required: true, message: "必填"}]
                                })}/>
                        </FormItem>
                        </Col>
                        <Col span="11" offset="1">
                        <FormItem label="品牌名：" {...formItemLayout}>
                            {/*<Input*/}
                                {/*hasClear*/}
                                {/*{...init("brand_name", {*/}
                                    {/*rules: [{required: true, message: "必填"}]*/}
                                {/*})}*/}
                            {/*/>*/}
                            {/* <Select
                                hasClear
                                dataSource={this.state.deviceBrandName}
                                style={{width: 255}}
                                placeholder="请选择"
                                name="brand_name"
                                defaultValue={devbrandName}
                                {...init("brand_name", {
                                    rules: [{required: true, message: "必填"}]
                                })}
                            /> */}
                            <Brand   brand_name={init("brand_name")} {...init("brand_name", {
                                    rules: [{required: true, message: "必填"}]
                                })}/>
                        </FormItem>
                        </Col>
                        </Row>
                        <Row>
                            <Col span="11">
                        <FormItem label="设备型号：" {...formItemLayout}>
                            {/*<Input*/}
                                {/*hasClear*/}
                                {/*{...init("model", {*/}
                                    {/*rules: [{required: true, message: "必填"}]*/}
                                {/*})}*/}
                            {/*/>*/}
                            {/* <Select
                                hasClear
                                dataSource={this.state.deviceModel}
                                style={{width: 255}}
                                placeholder="请选择"
                                name="model"
                                defaultValue={devmodel}
                                {...init("model", {
                                    rules: [{required: true, message: "必填"}]
                                })}
                            /> */}
                            <Models   model={init("model")}  {...init("model", {
                                    rules: [{required: true, message: "必填"}]
                                })}/>
                        </FormItem>
                        </Col>
                        <Col span="11" offset="1">
                        <FormItem label="部门：" {...formItemLayout}>
                            {/* <TreeSelect
                                hasClear
                                treeDefaultExpandAll
                                style={{width: 255}}
                                autoWidth
                                dataSource={this.state.devdepartment}
                                name="department"
                                defaultValue={devdepartment}
                                {...init("department", {
                                    rules: [{required: true, message: "必填"}]
                                })}
                            /> */}
                            <Department  department={init("department")} {...init("department", {
                                    rules: [{required: true, message: "必填"}]
                                })}/>
                            {/*<Input*/}
                                {/*hasClear*/}
                                {/*{...init("department", {*/}
                                    {/*rules: [{required: true, message: "必填"}]*/}
                                {/*})}*/}
                            {/*/>*/}
                        </FormItem>
                        </Col>
                        </Row>
                        <Row>
                            <Col span="11">
                        <FormItem label="位置：" {...formItemLayout}>
                            {/*<Input*/}
                                {/*hasClear*/}
                                {/*{...init("location", {*/}
                                    {/*rules: [{required: true, message: "必填"}]*/}
                                {/*})}*/}
                            {/*/>*/}
                            {/* <TreeSelect
                                hasClear
                                treeDefaultExpandAll
                                style={{width: 255}}
                                autoWidth
                                dataSource={this.state.devlocation}
                                name="location"
                                defaultValue={devlocation}
                                {...init("location", {
                                    rules: [{required: true, message: "必填"}]
                                })}
                            /> */}
                            {/* <Location  location={init("location")} {...init("location", {
                                    rules: [{required: true, message: "必填"}]
                                })}/> */}
                                <Input name="location" placeholder="位置"/>
                                {/* <Input
                                trim
                                hasClear
                                {...init("location", {
                                    rules: [{required: true, message: "必填"}]
                                })} */}
                            {/* /> */}
                        </FormItem>
                        </Col>
                        <Col span="11" offset="1">
                        <FormItem label="ip：" {...formItemLayout}>
                            <Input
                                trim
                                hasClear
                                {...init("conn.ip", {
                                    rules: [
                                        {
                                            required: true,
                                            message: "请填写正确格式的ip",
                                            pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                                        }
                                    ]
                                })}
                            />
                        </FormItem>
                        </Col>
                        </Row>
                        <Row>
                            <Col span="11">
                            <FormItem label="端口：" {...formItemLayout}>
                                <Input
                                    trim
                                    hasClear
                                    {...init("conn.port", {
                                        rules: [
                                            {
                                                required: true,
                                                message: "请填写正确格式的端口",
                                                pattern: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/
                                            }
                                        ]
                                    })}
                                />
                            </FormItem>
                            </Col>
                            <Col span="11" offset="1">
                            <FormItem label="添加时间：" {...formItemLayout}  style={{ display: "none" }}>
                                <Input
                                    {...init("time")}
                                />
                            </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="11">
                                <FormItem label="唯一id：" {...formItemLayout}  style={{ display: "none" }}>
                                    <Input
                                        {...init("_id")}
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
    },
    errormsg: {
        color: 'red',
        fontSize: '12px',
    }
};
