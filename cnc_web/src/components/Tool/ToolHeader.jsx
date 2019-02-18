import React, { Component } from "react";
import { Button, Field, DatePicker, Select, Breadcrumb } from "@icedesign/base"
import DepartmentUtil from '@/utils/DepartmentUtil';
import AxiosHttp from '@/utils/AxiosHttp';
import AppConfigUtil from '@/utils/AppConfigUtil';
import TimeUtil from '@/utils/TimeUtil';
import ToolDevice from './ToolDevice';
import { Feedback } from "@icedesign/base";
import ShiftUtil from '@/utils/ShiftUtil';
const Toast = Feedback.toast;
let arr = [];
let configArr = [];

const { Combobox } = Select;

export default class ToolHeader extends Component {
    constructor(props) {
        super(props);
        //初始化时间
        let _this = this;
        this.type = this.props.type;//type 0-center, 1-branch        
        this.field = new Field(this);
        let shiftDate = ShiftUtil.getShiftDate();
        let times = '';
        let array = [];
        let _configs = AppConfigUtil.getDefaultValue(this.type);
        configArr = _configs;// configArr主要是给this.type === 3，换刀时刻表用的时间配置
        if (!_configs || _configs.length <= 0) {
            this.state = {
                dataSource: array,//时间段选择
                show: false,
                shiftDate: shiftDate,
                timesStr: "",
                dateStr: "",
                updateStr: ""
            };
            let promise = AppConfigUtil.getToolConfigByType(this.type);
            promise.then(configs => {
                array.length = 0;
                arr.length = 0;
                if (configs && configs.length > 0) {
                    configArr = configs;// configArr主要是给this.type === 3，换刀时刻表用的时间配置
                    configs.forEach(element => {
                        times = element.start + '-' + element.end;
                        array.push({ label: times, value: times });
                    });
                    this.setState({
                        dataSource: array,//时间段选择
                        value: array[0].value,
                    });
                    arr = array[0].value.split('-');
                    this.start = arr[0];
                    this.end = arr[1];
                    this.selectTime = { start: this.start, end: this.end };
                    this.onSearch();
                }
            });
        } else {
            array.length = 0;
            arr.length = 0;
            _configs.forEach(element => {
                times = element.start + '-' + element.end;
                array.push({ label: times, value: times });
            });
            this.state = {
                dataSource: array,
                value: array[0].value,
                deviceId: 0,
                shiftDate: shiftDate,
                timesStr: "",
                dateStr: "",
                updateStr: ""
            };
            arr = array[0].value.split('-');
            this.start = arr[0];
            this.end = arr[1];
            this.selectTime = { start: this.start, end: this.end };
            this.onSearch();
        }

    }

    // 获取航班头部日期和时间
    getDateAndTime = (element, timeArr) => {
        let stampStart, stampEnd;
        let tempstamp = TimeUtil.timestamp();// 当前时间戳
        let preDate = TimeUtil.format((tempstamp - 24 * 60 * 60 * 1000), TimeUtil.format3);// 前一天 'YYYY-MM-DD'
        let nextDate = TimeUtil.format((tempstamp + 24 * 60 * 60 * 1000), TimeUtil.format3);// 后一天 'YYYY-MM-DD'
        let curTime = TimeUtil.format(tempstamp, TimeUtil.format5);// 当前时间 'HH:mm'
        if (element.start > element.end) {// 判断是否跨天班别
            if (curTime > element.start) {// 已经确定是跨天班别，判断是跨天前，还是跨天后
                stampStart = timeArr[0] + " " + element.start + ":00";
                stampEnd = nextDate + " " + element.end + ":00";
            } else {
                stampStart = preDate + " " + element.start + ":00";
                stampEnd = timeArr[0] + " " + element.end + ":00";
            }
        } else {
            stampStart = timeArr[0] + " " + element.start + ":00";
            stampEnd = timeArr[0] + " " + element.end + ":00";
        }
        stampStart = TimeUtil.changeTimestamp(stampStart);
        stampEnd = TimeUtil.changeTimestamp(stampEnd);
        if ((tempstamp > stampStart) && (tempstamp < stampEnd)) {// 判断是否跨天班别
            this.setState({
                timesStr: element.start + '-' + element.end,
                dateStr: timeArr[0],
                updateStr: timeArr[1]
            });
            if (element.start > element.end) {
                if (curTime > element.start) {
                    this.setState({
                        dateStr: timeArr[0],
                    })
                } else {
                    this.setState({
                        dateStr: preDate,
                    })
                }
            }
        }
    };

    onSearch = (ctype) => {
        if ('export' != ctype) ctype = null;
        let val = this.field.getValues();
        let optiondate = this.getSelectDate();
        if (Object.keys(this.selectTime).length !== 0)
            this.props.handletHeaderDate(this.selectTime, optiondate, ctype, this.state.deviceId);
    };

    getSelectDate() {
        let val = this.field.getValues();
        let time = val.datepicker ? val.datepicker : this.state.shiftDate;
        let optiondate = TimeUtil.formatDateByFormat(time, TimeUtil.format3);
        return optiondate;
    }

    componentDidMount() {
        //this.onSearch();
    }

    // 根据props改变来执行一些操作
    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.timeArr) {
            configArr.forEach(element => {
                this.getDateAndTime(element, nextProps.timeArr)
            })
        }
    }



    onExport = (value) => {
        this.setState({
            show: true,
        })
        // this.onSearch('export');
        //'/cutterlife/getCutterlifeByDepartmentId/' +this.state.selectTime+ '/' +departmentId +'/' + this.state.current
        let curDepartmentId = DepartmentUtil.changeDepartment();
        ///cutterforecast/export/:date/:time/:type/:departmentid
        let optiondate = this.getSelectDate();
        // this.props.setFlag(true);
        let name = '';
        if (this.type == AppConfigUtil.branchwms) {
            name = '分仓备刀报表';
        } else if (this.type == AppConfigUtil.generalwms) {
            name = '总仓装刀报表';
        } else if (this.type == AppConfigUtil.sixhour) {
            name = '技术员换刀报表';
        } else if (this.type == AppConfigUtil.optimize) {
            name = '优化滞后报表';
        }
        name = name + '_' + DepartmentUtil.getDepartmentById(curDepartmentId) + '_' + optiondate + '_' + this.start + '_' + this.end;
        if (this.type === 5) {
            AxiosHttp.exportExcel("/cutteroptimize/exportCutterOptHistroy", {
                departmentid: curDepartmentId,
                devID: this.state.deviceId,
                date: optiondate,
                start: this.start,
                end: this.end
            }, name).then((res) => {
                if (res == 0) {
                    Toast.success('没有可导出数据！');
                } else {
                    Toast.success('下载成功！');
                    this.setState({
                        show: false,
                    })
                }
                // this.props.setFlag(false);
            }).catch(error => {
                console.log(error)
            })
        } else {
            AxiosHttp.exportExcel('/cutterforecast/export/' + curDepartmentId + '/' + optiondate + '/' + this.start + '/' + this.end + '/' + this.type, { departmentid: curDepartmentId }, name).then((res) => {
                if (res == 0) {
                    Toast.success('没有可导出数据！');
                } else {
                    Toast.success('下载成功！');
                    this.setState({
                        show: false,
                    })
                }
                // this.props.setFlag(false);
            }).catch(error => {
                console.log(error)
            })
        }

    };

    componentWillMount() {
        console.log(this.type, 'sdasdasdas');
    }

    // 导出CSV
    onExportCSV = (value) => {
        // this.onSearch('export');
    };

    normDate(date, dateStr) {
        return dateStr;
    }

    onSelect(value) {
        let arr = value.split('-');
        this.start = arr[0];
        this.end = arr[1];
        this.selectTime = { start: this.start, end: this.end };
    }

    // 日期控件年
    yearChange(val, str) {
        this.year_no = str
    }

    selectDeviceId(value) {
        this.setState({
            deviceId: value
        })
    }

    toolCrumbs() {
        if (this.type == AppConfigUtil.branchwms) {
            return (<Breadcrumb separator="/">
                <Breadcrumb.Item >刀具报表</Breadcrumb.Item>
                <Breadcrumb.Item >分仓备刀报表</Breadcrumb.Item>
            </Breadcrumb>);
        } else if (this.type == AppConfigUtil.generalwms) {
            return (<Breadcrumb separator="/">
                <Breadcrumb.Item  >刀具报表</Breadcrumb.Item>
                <Breadcrumb.Item >总仓装刀报表</Breadcrumb.Item>
            </Breadcrumb>);
        } else if (this.type == AppConfigUtil.sixhour) {
            return (<Breadcrumb separator="/">
                <Breadcrumb.Item  >刀具报表</Breadcrumb.Item>
                <Breadcrumb.Item >技术员换刀报表</Breadcrumb.Item>
            </Breadcrumb>);
        } else if (this.type == AppConfigUtil.optimize) {
            return (<Breadcrumb separator="/">
                <Breadcrumb.Item  >刀具报表</Breadcrumb.Item>
                <Breadcrumb.Item >优化滞后报表</Breadcrumb.Item>
            </Breadcrumb>);
        }
    }

    render() {
        const init = this.field.init;
        if (this.type === 3) {
            return (<div className='main-con-head' style={styles.y}>
                {/* 面包屑↓ */}
                <div className="head-title">
                    <Breadcrumb separator="/">
                        <Breadcrumb.Item >刀具报表</Breadcrumb.Item>
                        <Breadcrumb.Item >换刀时刻表</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <span className='y-top-text'>换刀时刻表：{this.state.dateStr} {this.state.timesStr}  更新时间：{this.state.updateStr}</span>
            </div>
            )
        } else {
            // let deviceMap = JSON.parse(localStorage.getItem('deviceinfo'));
            return (
                <div className='main-con-head' style={styles.y}>

                    {/* 面包屑↓ */}
                    <div className="head-title">
                        <Breadcrumb separator="/">{this.toolCrumbs()}</Breadcrumb>
                    </div>

                    <div style={styles.search}>
                        <span className='y-top-text'>报表日期：</span>
                        <DatePicker
                            format="YYYY-MM-DD"
                            {...init("datepicker", {
                                getValueFromEvent: this.normDate
                            })}
                            // defaultValue={new Date}
                            defaultValue={this.state.shiftDate}
                            style={styles.date}
                        />
                        <span className='y-top-text'> 报表时间段：</span>
                        <Select
                            dataSource={this.state.dataSource}
                            style={{ width: 150 }}
                            onChange={this.onSelect.bind(this)}
                            defaultValue={this.state.value}
                            ref="selectTime"

                        />
                        {/* <ToolDevice selectDeviceId={this.selectDeviceId.bind(this)} departmentId={this.props.departmentId}/> */}
                        <Button onClick={this.onSearch.bind(this)} style={styles.btn} >查询</Button>
                        <Button onClick={this.onExport.bind(this)} style={styles.btn} >导出</Button>
                        {/* <Button onClick={this.onExportCSV.bind(this)} style={styles.btn} >导出CSV</Button> */}
                    </div>
                    <div className="load" style={{ display: this.state.show ? "block" : "none" }}>
                        导出中,请稍等<i>...</i>
                    </div>
                </div>
            )
        }
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