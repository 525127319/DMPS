/* eslint no-plusplus:0 */
import React, { Component } from "react";
import { hashHistory } from "react-router";
import { Table, Button, Icon, Pagination, Moment, TreeSelect, Field, Form, Select, } from "@icedesign/base";
import IceContainer from "@icedesign/container";
import EditDevice from "./EditDevice";
import AddDevice from "./AddDevice";
import DeleteDevice from "./DeleteDevice";
import AxiosHttp from "@/utils/AxiosHttp";
import DeviceinfoUtil from '@/utils/DeviceinfoUtil';
import DepartmentUtils from "@/utils/DepartmentUtil";
import DevicetypeUtils from "@/utils/DevicetypeUtil";
import PeopleUtils from "@/utils/PeopleUtil";
import Devicename from "@/components/Devicename/Devicename";
import CComponent from "@/components/Common/CComponent";
import Loadings from "@/components/Loadings/Loadings";
import BrandUtil from "@/utils/BrandUtil";
import EquipmentUtil from "@/utils/EquipmentUtil"
import Devicetype_newUtils from "@/utils/Devicetype_newUtil"
import { Loading, Breadcrumb } from "@icedesign/base";
import Store from '@/redux/Store';
let departmentId = 'root';
let listener = null, isLestener = false;

if (!isLestener)
    listener = Store.subscribe(DepartmentUtils.changeDepartment);

const FormItem = Form.Item;
export default class SelectableTable extends CComponent {
    //purecomponent
    static displayName = "DeviceTable";

    static propTypes = {};

    static defaultProps = {
        //本界面的默认配置，会合并到props里，但这里的属性为只读
        pageSize: 10
    };
    constructor(props) {
        //参数传递
        super(props);
        this.param = { pageIndex: 1 };

        // 表格可以勾选配置项
        this.rowSelection = {
            // 表格发生勾选状态变化时触发
            onChange: (ids, records) => {
                // console.log("ids", ids);
                this.setState({
                    selectedRowKeys: ids
                });
            },
            // 全选表格时触发的回调
            onSelectAll: (selected, records) => {
                console.log("onSelectAll", selected, records);
            },
            // 支持针对特殊行进行定制
            getProps: record => {
                return {
                    disabled: record.id === 100306660941
                };
            }
        };

        this.state = {
            //数据定义，所有需要被改变的数据，都会定义在这里。
            selectedRowKeys: [],
            dataSource: [],
            devices: [],
            total: 0,
            show: true,
            current: 1,
            flag: true, // 加载
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleResponse = this.handleResponse.bind(this);

        departmentId = DepartmentUtils.changeDepartment();
    }

    clearSelectedKeys = () => {
        this.setState({
            selectedRowKeys: []
        });
    };

    deleteSelectedKeys = () => {
        const { selectedRowKeys } = this.state;
        console.log("delete keys", selectedRowKeys);
    };

    handleRemove = record => {
        console.log(record);
        AxiosHttp.post("/device/delete/" + this.param.pageIndex + "/" + record._id, { devid: record.dev_id })
            .then(this.handleResponse)
            .catch(error => {
                console.log(error);
            });
    };

    getFormValues = (dataIndex, values) => {
        const { dataSource } = this.state;
        dataSource[dataIndex] = values;
        this.setState({
            dataSource
        });
    };

    handleResponse = function (response) {
        this.setState({
            //更主狀態，必須通這此方法，這樣react才能監聽到，重新調用render方法。
            dataSource: response.value.rs,
            total: response.value.total,
            show: false
        });
        DeviceinfoUtil.cacheDeviceinfo();
    };


    // //完成瀉染(render)後調用
    // componentDidMount() {
    //     AxiosHttp.get("/device/list/" + this.param.pageIndex)
    //         .then(this.handleResponse)
    //         .catch(error => {
    //             console.log(error);
    //         });
    // }

    //paging action
    // handleChange(pageIndex) {
    //     this.param.pageIndex = pageIndex;
    //     // this.componentDidMount();
    //     this.getData()
    // }
    handleChange(current) {
        this.setState({
            current
        }, () => {
            this.getData()
        });
    }

    //瀉染完後，在後臺整合數據
    componentDidMount() {
        this.getDepartment(departmentId);
        listener = Store.subscribe(this.changeDepartment.bind(this));
    }

    changeDepartment = () => {
        let state = Store.getState();
        departmentId = state.departmentId
        this.getDepartment(departmentId);
        let deviceList = sessionStorage.getItem('deviceList');
        if (deviceList == 'true') {
            hashHistory.push({
                pathname: 'deviceManager/deviceList'
            })
        }
    }

    componentWillUnmount() {
        if (listener) {
            listener()
        }
    }

   
    getDepartment = (val) => { //获取到部门信息  
        if (this.state.statusMap) {
            this.state.statusMap.clear();
        }
        this.setState({ current: 1 })
        this.setState({
            department: val
        }, () => {
            this.getData()
        })
    }

    //根据部门，获取设备信息
    getData = () => {
        this.setState({
            flag: true
        })
        AxiosHttp
            .post('/getDepartmentDevice/getDevice', { 'department': this.state.department, 'current': this.state.current })
            .then(this.handleData)
            .catch(error => {
                console.log(error)
            })
    }

    handleData = (response) => {
        let devices = [] //所有设备ID
        if (response.value.total) {
            response
                .value
                .rs
                .forEach(item => {
                    devices.push(item.dev_id);
                })
            this.setState({ total: response.value.total })
            this.setState({
                devices: devices,
                dataSource: response.value.rs,
                flag: false
            }, () => {
                // this.searchDevice();
            })
        } else {
            this.setState({ statusMap: null, dataSource: [], total: 0, devices: [], flag: false })
        }
    }

    renderOperator = (value, index, record) => {
        return (
            <div>
                {/* <EditDevice
                    index={index}
                    record={record}
                    getFormValues={this.getFormValues}
                />
                <DeleteDevice handleRemove={this.handleRemove.bind(this, record)}>
                    删除
                </DeleteDevice> */}
            </div>
        )
    };

    formatDevicepageskip(device) {
        hashHistory.push({
            pathname: 'realtime/deviceList/deviceDetail/' + device.dev_id,
            state: {
                item: device,
                moduleId: 'device'
            }
        })

    }

    handleDevicelist = function (res) {
        if (res.ok) {
            this.setState({
                dataSource: res.value.rs,
                total: res.value.total
            });
        }
    }.bind(this);

    searchDevice(click) {

        //let myDepartment = this.refs.myDepartment;
        let myDevicename = this.refs.myDevicename;
        let departmentValue = super.getDepartment();
        let devicenameValue = myDevicename.getValue();
        if (click) {
            this.param.pageIndex = 1
        }
        let searchCondition = {
            dev_id: devicenameValue,
            department: departmentValue,
            pageIndex: this.param.pageIndex
        };

        if (!searchCondition.department) {
            delete searchCondition.department;
        }
        if (!searchCondition.dev_id) {
            delete searchCondition.dev_id;
        }

        // console.log(searchCondition, 1111);
        AxiosHttp
            .post("/device/search", searchCondition)
            .then(this.handleDevicelist)
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        const formatDevicename = (value, index, record) => {
            return (
                <span
                    style={styles.colorstyle}
                    onClick={this.formatDevicepageskip.bind(this, record)}
                > {value}
                </span>
            )
        }

        const formatDatetime = (value, index, record) => {
            return (
                <span>{Moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
            )
        }

        const formatDepartment = (value, index, record) => {

            return (
                <span>{DepartmentUtils.getDepartmentById(value)}</span>
            )
        }

        const formatLocation = (value, index, record) => {
            return (
                <span>{DepartmentUtils.getLocationById(value)}</span>
            )
        }

        const formatDevicetype = (value, index, record) => {
            return (
                <span>{EquipmentUtil.getEquipmentUtilLabelById(value)}</span>
            )
        }

        const formatDevBrandName = (value, index, record) => {
            return (
                <span>{BrandUtil.getBrandLabelById(value)}</span>
            )
        }

        const formatDeviceModel = (value, index, record) => {
            return (
                <span>{Devicetype_newUtils.getDeviceModelById(value)}</span>
            )
        }

        const formatResponsibilityBy = (value, index, record) => {
            return (
                <span>{PeopleUtils.getPeopleById(value)}</span>
            )
        }

        return (
            <div className=" dev-list main-container" style={styles.selectableTable}>
                <IceContainer className='main-con-head' style={styles.IceContainer}>

                    {/* 面包屑↓ */}
                    <div className="head-title">
                        <Breadcrumb separator="/">
                            <Breadcrumb.Item>设备管理</Breadcrumb.Item>
                            <Breadcrumb.Item>设备列表</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    {/* 面包屑end */}

                    <Form direction="hoz" className="demo-ctl">
                        <FormItem >
                            <Devicename ref="myDevicename" />
                        </FormItem>
                        <FormItem>
                            <Button onClick={(click = true) => this.searchDevice(click = true)}>查询</Button>
                        </FormItem> 

                    </Form>

                    <div style={styles.Addlog}>
                        {/* <AddDevice
                            handleChange={this.handleChange}
                            componentDidMount={this.componentDidMount}
                            param={this.param}
                        /> */}

                        {/* <Button style={styles.batchBtn}>导入</Button> */}

                        {/*
            <Button
              onClick={this.deleteSelectedKeys}
              size="small"
              style={styles.batchBtn}
              disabled={!this.state.selectedRowKeys.length}
            >
              <Icon type="ashbin" />删除
            </Button>
            
            <Button
              onClick={this.clearSelectedKeys}
              size="small"
              style={styles.batchBtn}
            >
              <Icon type="close" />清空选中
            </Button>
             */}


                    </div>
                    {/* <div> */}
                    {/*<a href="/" download>*/}
                    {/*<Icon size="small" type="download" /> 导出表格数据到 .csv 文件*/}
                    {/*</a>*/}
                    {/* </div> */}

                </IceContainer>
                <IceContainer className='main-con-body'>
                    <Loading
                        color="#ccc"
                        shape="fusion-reactor"
                        visible={this.state.flag}
                    >
                        <Table
                            dataSource={this.state.dataSource}
                            // primaryKey="devID"
                            isLoading={this.state.isLoading}
                        // rowSelection={{
                        //   ...this.rowSelection,
                        //   selectedRowKeys: this.state.selectedRowKeys
                        // }}
                        // rowSelection={this.state.rowSelection}
                        >
                            <Table.Column title="设备编号" dataIndex="dev_id" width="16%" style={{ display: "none" }} />
                            <Table.Column title="设备名称" dataIndex="name" width="16%" cell={formatDevicename} />{/*  */}
                            <Table.Column title="设备类型" dataIndex="type" width="16%" cell={formatDevicetype} />{/*  */}
                            <Table.Column title="品牌名称" dataIndex="brand_name" width="16%" cell={formatDevBrandName} />{/*  */}
                            <Table.Column title="设备型号" dataIndex="model" width="16%" cell={formatDeviceModel} />{/*  */}
                            <Table.Column title="所属部门" dataIndex="department" width="20%" cell={formatDepartment} />{/*  */}
                            {/* <Table.Column title="位置" dataIndex="location" width="9%" cell={formatLocation} /> */}
                            {/* <Table.Column title="负责人" dataIndex="responsibility_by" width="10%" cell={formatResponsibilityBy}/> */}
                            <Table.Column title="ip" dataIndex="conn.ip" width="0%" />{/*  */}
                            {/* <Table.Column title="端口" dataIndex="conn.port" width="25%" /> */}
                            {/* <Table.Column title="添加时间" dataIndex="time" width="0%" cell={formatDatetime} /> */}
                            {/*  */}
                            {/* <Table.Column title="操作" cell={this.renderOperator} lock="right" width="1%" align="center" style={styles.Columns} 
                        /> */}
                        </Table>

                        <div className='pagination'>
                            <span className='total'>共 {this.state.total} 条</span>
                            <Pagination
                                current={this.state.current}
                                total={this.state.total}
                                pageSize={this.props.pageSize}
                                onChange={this.handleChange}
                            />
                        </div>
                    </Loading>
                </IceContainer>
            </div>
        );
    }
}

const styles = {
    batchBtn: {
        marginRight: "10px",
    },
    IceContainer: {
        marginBottom: "20px",
        minHeight: "auto",
        // display: "flex",

        justifyContent: "flex-end"
    },
    removeBtn: {
        marginLeft: 10
    },

    Addlog: {
        float: "right"
    },
    colorstyle: {
        color: "#2a64e8"
    },
    Columns: {
        display: "none"
    }
};
