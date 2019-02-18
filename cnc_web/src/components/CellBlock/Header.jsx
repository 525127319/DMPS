import React, { Component } from "react";
import { Button, Field, DatePicker, Select, Breadcrumb, Feedback } from "@icedesign/base"
import ShiftUtil from '@/utils/ShiftUtil';
import TimeUtil from '@/utils/TimeUtil';
import CComponent from "@/components/Common/CComponent";
import DepartmentUtil from "@/utils/DepartmentUtil";
import AxiosHttp from "@/utils/AxiosHttp";
const Toast = Feedback.toast;

export default class Header extends CComponent {
    static defaultProps = {
        showExprot: 'block'
    }

    constructor(props) {
        super(props);
        this.field = new Field(this);
        let shifts = super.getShifts();
        let shiftDate = null;
        if (props.defaultDate){
            shiftDate = props.defaultDate;
        } else {
            shiftDate = ShiftUtil.getShiftDate();
        }
        let defaultShiftId = null;
        if (props.shift){
            defaultShiftId = props.shift;
        } else {
            defaultShiftId = ShiftUtil.getDefaultShift();
        }
        
        this.state = {
            show: false,
            dataSource: shifts,
            shift: defaultShiftId,
            shiftDate: shiftDate,
            showExprot: props.showExprot
        }
    }

    normDate(date, dateStr) {
        return dateStr;
    }

    didMount() {
        let _this = this;
        if (this.state.dataSource.length <= 0) {
            ShiftUtil.getShift().then(res => {
                //let shifts = res.data;
                let values = ShiftUtil.wrapShift(res);
                if (!values || values.length <= 0) return;
                _this.setState({
                    dataSource: values,
                    shift: values[0].value
                });
                _this.onSearch();
            });
        } else {
            _this.onSearch()
        }
    }

    getSelectDate() {
        let val = this.field.getValues();
        let time = val.datepicker;
        let optiondate = TimeUtil.formatDateByFormat(time, TimeUtil.format3);
        return optiondate;
    }

    onSearch() {
        let optiondate = this.getSelectDate();
        this.props.reset({ selectedDate: optiondate, shift: this.state.shift });
    }

    onSelect(value) {
        this.state.shift = value;
    }

    /**
     * 导出URL
     */
    getExportUrl(){
        return '请继承';
    }

    /**
     * 导出的名称
     */

    _getExportingName(departmentId, param){
        let name = this.getExportingName();
        name = name+ '_' + DepartmentUtil.getDepartmentById(departmentId) + '_' + param.date+'_'+ShiftUtil.getShiftById(this.state.shift).name;
        return name;
    }

    getExportingName(){
        return '请继承';
    }

    /**
     * 面包屑
     */
    _getBreadcrumb(){
        let showBread = this.props.showBread;
        if (showBread){
            return '';
        } else {
            return this.getBreadcrumb();
        }
    }

    getBreadcrumb(){
        return '';
    }

    _getExportingParam(param){
        return this.getExportingParam(param);
    }

    getExportingParam(param){
        return  param;
    }


    onExport = (value) => {
        this.setState({
            show: true,
        })
        // this.onSearch('export');
        //'/cutterlife/getCutterlifeByDepartmentId/' +this.state.selectTime+ '/' +departmentId +'/' + this.state.current
        let departmentId = DepartmentUtil.changeDepartment();

        
        // let date = ctx.request.fields.date;        
        //let shiftID = ctx.request.fields.shiftID;
        let optiondate = this.getSelectDate();
        
        let param = {
            departmentid: departmentId,
            date: optiondate,
            shiftID:this.state.shift
         };

         let name = this._getExportingName(departmentId, param);

         param = this._getExportingParam(param);

        AxiosHttp.exportExcel(this.getExportUrl(), param, name).then((res) => {
            if (res == 0) {
                Toast.success('没有可导出数据！');
            } else {
                Toast.success('下载成功！');
            }
            this.setState({
                show: false
            })
        }).catch(error => {
            console.log(error)
        })
    };

    render() {
        const init = this.field.init;
        return (
            <div className='main-con-head' style={styles.y}>

                {/* 面包屑↓ */}
                <div className="head-title" style={{display: this.props.showBread?'none': 'block'}}>
                    {this._getBreadcrumb()}
                </div>

                <div style={styles.search}>
                    <DatePicker
                        format="YYYY-MM-DD"
                        {...init("datepicker", {
                            getValueFromEvent: this.normDate
                        })}
                        defaultValue={this.state.shiftDate}
                        style={styles.date}
                    />
                    <Select
                        hasClear
                        dataSource={this.state.dataSource}
                        style={{ width: 150 }}
                        defaultValue={this.state.shift}
                        onChange={this.onSelect.bind(this)} />
                    <Button onClick={this.onSearch.bind(this)} style={styles.btn} >查询</Button>
                    <Button onClick={this.onExport.bind(this)} style={{ marginLeft: "40px", display: this.state.showExprot }}>导出</Button>
                    <div className="load" style={{display: this.state.show ? "block" : "none"}}>
                        导出中,请稍等<i>...</i>
                        </div>
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
    year: {
        marginRight: "40px",
    },
    y: {
        padding: "20px",
        background: "#fff"
    }
};