import React, { Component } from 'react';
import echarts from 'echarts/lib/echarts';
import IceContainer from '@icedesign/container';
import { Router, Route, hashHistory } from 'react-router';
import { Button, Field, DatePicker, Breadcrumb } from "@icedesign/base";
import ShiftUtil from '@/utils/ShiftUtil';

let echart = null, allOption;
export default class Chart extends Component {
    constructor(props) {
        super(props);
        let shiftDate = ShiftUtil.getShiftDate();
        this.state = {
            alarmType: [],
            shiftDate: shiftDate
        };
        this.field = new Field(this);
    }
    handleAlarmType = function (alarmTypeData) {
        let _alarmCodeName = [];
        var selecteds = {};


        let _alarmCode = [];
        var otherType = {};
        var sumCount = 0;
        var sumCode = 0;
        alarmTypeData.sort((data0, data1) => {
            if (data0.count - data1.count > 0) {
                return -1;
            } else if (data0.count - data1.count < 0) {
                return 1;
            } else {
                return 0;
            }
        });
        for (let index = 0; index < alarmTypeData.length; index++) {
            var alarmTypeObject = {};

            // if (index < 9) {
            //     alarmTypeObject.value = alarmTypeData[index].count;
            //     alarmTypeObject.name = alarmTypeData[index]._id;
            //     _alarmCode.push(alarmTypeObject);
            //     _alarmCodeName.push(alarmTypeData[index]._id);
            // } else {
            //     sumCount += alarmTypeData[index].count;
            //     sumCode += alarmTypeData[index]._id + ",";
            //     sumCode = sumCode.slice(0, -1).split(",");
            // }

            if (index) {
                alarmTypeObject.value = alarmTypeData[index].count;
                alarmTypeObject.name = alarmTypeData[index]._id;
                _alarmCode.push(alarmTypeObject);
                _alarmCodeName.push(alarmTypeData[index]._id);
            }
        }

        for (let i = 0; i < _alarmCodeName.length; i++) {
            if (i > 9) {
                selecteds[_alarmCodeName[i]] = false
            }
        }

        // otherType.value = sumCount;
        // otherType.name = "其他";
        // _alarmCode.push(otherType);
        // _alarmCodeName.push("其他");
        allOption.series[0].data = _alarmCode;
        allOption.legend.data = _alarmCodeName;
        allOption.legend.selected = selecteds;

        echart.setOption(allOption);
        echart.on("click", function (param) {
            let codes
            if (_alarmCode[param.dataIndex].name == "其他") {
                codes = _alarmCodeName.slice(0, 9)
            } else {
                codes = [_alarmCode[param.dataIndex].name]
            }

            let path = {
                pathname: 'exception/list',
                state: codes,
            }
            hashHistory.push(path);
        });
    }.bind(this);

    componentWillMount() {
        allOption = {
            title: {
                text: '报警类型分析',
                // subtext: '报警处理表',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                type: 'scroll',
                orient: 'vertical',
                left: 'left',
                data: [],

            },
            series: [
                {
                    name: '异常码',
                    type: 'pie',
                    radius: '55%',
                    center: ['51%', '50%'],
                    label: {
                        normal: {
                            formatter: '{b}:{c}({d}%)',
                            textStyle: {
                                fontWeight: 'normal',
                                fontSize: 16
                            }
                        }
                    },
                    data: [],
                    itemStyle: {
                        // normal : {
                        //     label : {
                        //         show : false   
                        //     },
                        //     labelLine : {
                        //         show : false   
                        //     }
                        // },
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        },
                    }
                }
            ]
        };

    }

    componentWillReceiveProps() {
        this.getData();
    }

    componentDidMount() {
        echart = echarts.init(document.getElementById('allWarning'));
        echart.setOption(allOption);
    }

    getData() {
        let alarmTypeData = this.props.alarmType;
        let arr = Object.keys(alarmTypeData);
        if (arr.length) {
            this.handleAlarmType(alarmTypeData);
        }
    }

    onSearch = (value) => {
        let val = this.field.getValues()
        let device = null;

        this.props.search(device, val);
    };

    normDate(date, dateStr) {
        return dateStr;
    }

    render() {
        this.getData()
        const init = this.field.init;
        return (
            <div className='main-container'>
                {/* <IceContainer   className='main-con-head'><span>数据统计 > 报警类型</span></IceContainer> */}
                <IceContainer className='main-con-head'>

                    {/* 面包屑↓ */}
                    <div className="head-title">
                        <Breadcrumb separator="/">
                            <Breadcrumb.Item >报警统计</Breadcrumb.Item>
                            <Breadcrumb.Item >报警分析</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div>
                        <DatePicker
                            format="YYYY-MM-DD"
                            {...init("datepicker", {
                                getValueFromEvent: this.normDate
                            })}
                            // defaultValue={new Date}
                            defaultValue={this.state.shiftDate}
                        />
                        <Button onClick={this.onSearch} style={styles.btn}>查询</Button>

                    </div>
                </IceContainer>

                <IceContainer className='main-con-body'>
                    <div >
                        <div id="allWarning" style={{ width: "100%", height: "600px", }} /></div>
                </IceContainer>
            </div>
        );
    }
}
const styles = {
    search: {
        display: "flex",
    },
    btn: {
        marginLeft: "40px",

    }
};
