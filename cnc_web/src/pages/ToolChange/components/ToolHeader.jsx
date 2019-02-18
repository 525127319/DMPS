import React, { Component } from "react";
import { Button, DatePicker, Field, Moment, Select, Upload, Breadcrumb } from "@icedesign/base"
import DepartmentUtil from '@/utils/DepartmentUtil';
import TimeUtil from '@/utils/TimeUtil';
import AxiosHttp from '@/utils/AxiosHttp';
import { Feedback } from "@icedesign/base";
const Toast = Feedback.toast;
// const token = sessionStorage.getItem("tocken");

const { Combobox } = Select;
export default class DeaprmentHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [
                { label: '6小时', value: 6 },
                { label: '12小时', value: 12 },
                { label: '24小时', value: 24 },
            ],
            value: 6,
            show: false,
            fillProps: '',
            deviceId: '',
        }
        this.selectTime = 6;
        this.field = new Field(this);
    }

    onSearch = (ctype) => {
        let val = this.field.getValues();
        if ('export' != ctype) ctype = null;
        this.props.handletHeaderDate(this.selectTime, ctype, this.state.deviceId);
    };

    onExport = (value) => {
        this.setState({
            show: true,
        })
        // this.onSearch('export');
        //'/cutterlife/getCutterlifeByDepartmentId/' +this.state.selectTime+ '/' +departmentId +'/' + this.state.current
        let curDepartmentId = DepartmentUtil.changeDepartment();
        let name = '实时预测报表' + '_' + DepartmentUtil.getDepartmentById(curDepartmentId) + '_' + TimeUtil.getCurDate(TimeUtil.format4);
        AxiosHttp.exportExcel('/cutterlife/export', { departmentid: curDepartmentId }, name).then((res) => {
            if (res == 0) {
                Toast.success('没有可导出数据！');
            } else {
                Toast.success('下载成功！');
                this.setState({
                    show: false,
                })
            }

        }).catch(error => {
            console.log(error)
        })
    };

    // 导出CSV
    onExportCSV = (value) => {
        // this.onSearch('export');
    };

    normDate(date, dateStr) {
        return dateStr;
    }

    onSelect(value) {
        this.selectTime = value;
    }

    componentDidMount() {

    }

    onChange(value) {
        this.setState({
            deviceId: value
        })
    };



    render() {
        const init = this.field.init;
        let deviceMap = JSON.parse(localStorage.getItem('deviceinfo'));
        return (
            <div className='main-con-head' style={styles.y}>

                {/* 面包屑↓ */}
                <div className="head-title">
                    <Breadcrumb separator="/">
                        <Breadcrumb.Item >刀具报表</Breadcrumb.Item>
                        <Breadcrumb.Item >实时预测报表</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div style={styles.search}>
                    {/*<span className='y-top-text'>报表日期：</span>*/}
                    {/*<DatePicker*/}
                    {/*format="YYYY-MM-DD"*/}
                    {/*{...init("datepicker", {*/}
                    {/*getValueFromEvent: this.normDate*/}
                    {/*})}*/}
                    {/*/>*/}
                    {/*<span className='y-top-text' style={styles.btn}> 报表时间段：</span>*/}
                    {/*<Select*/}
                    {/*style={{ width: 150 }}*/}
                    {/*ref="selectTime"*/}
                    {/*/>*/}
                    <Select
                        dataSource={this.state.dataSource}
                        style={{ width: 150 }}
                        onChange={this.onSelect.bind(this)}
                        defaultValue={this.state.value}
                    />
                    {/* <Combobox 
                        size={this.state.size}
                        style={{ width: 180 ,marginLeft:50}} 
                        // multiple={this.state.mode}
                        // hasArrow={this.state.hasArrow}
                        // disabled={this.state.disabled}
                        fillProps={this.state.fillProps}
                        // hasClear={this.state.hasClear}
                        onChange={this.onChange.bind(this)}
                        placeholder="请输入设备名称"
                        >
                        {deviceMap.map(item =>{
                            if(item.department =this.props.departmentId){
                                return(<Option value={item.dev_id} >{item.name}</Option>) 
                            }
                        })}
                    </Combobox> */}
                    <Button onClick={this.onSearch.bind(this)} style={styles.btn} >查询</Button>
                    <Button onClick={this.onExport.bind(this)} style={styles.btn} >导出</Button>
                    {/* <Button onClick={this.onExportCSV.bind(this)} style={styles.btn} >导出CSV</Button> */}
                    {/* <Upload
                        style={styles.upload}
                        listType="text"
                        showUploadList //是否显示上传列表
                        action={AxiosHttp.feilurl() + "importBasicExcel"} // 上传的地址
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
                    </Upload> */}
                </div>
                <div className="load" style={{ display: this.state.show ? "block" : "none" }}>
                    导出中,请稍等<i>...</i>
                </div>
            </div>
        )
    }
}
const styles = {
    search: {
        display: "flex",
    },
    btn: {
        marginLeft: "40px",
    },
    date: {
        marginRight: "40px",
    },
    y: {
        padding: "20px",
        background: "#fff"
    }
};