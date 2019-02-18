import React, { Component } from 'react';
import { Moment } from "@icedesign/base";
import echarts from 'echarts/lib/echarts';
import AxiosHttp from '@/utils/AxiosHttp';
import { status, evn } from '@/utils/Config';
import TimeUtil from '@/utils/TimeUtil';

let Config = status;
// let idel = Config.IdelC;
let running = Config.RunningC;
let alarm = Config.AlarmC;
let WaitingMaterial = Config.WaitingMaterialC;
let UpAndDownMaterial = Config.UpAndDownMaterialC;
let debug = Config.DebugC;
let unconnected = Config.UnConnecteedC;
let ToolChangerAlarm = Config.ToolChangerAlarmC;
let FirstPieceAlarm = Config.FirstPieceAlarmC;
let echart;

export default class Title extends Component {

    constructor(props){
        super(props);
    }


    createOption(){
        let option = {
            title: {
                text: '历史状态',
                left: 'center',
                //subtext: 'sssss'
                show: true,
                top: 5
            },
            legend: {selectedMode:false, left: "center", top: 30, formatter: function (name) {
                return name;
            }, data: [
                // {name: '空闲', icon: 'roundRect'}, '调试','运行','报警', '未连接','自定义异常'
                {name: '运行中', icon: 'roundRect'}, '待料', '上下料', '调机中', '报警', '换刀报警', '首件报警', '离线'
                ],
                show: true
            },
            xAxis: {
                axisLine: { show: false },
                axisLabel: { show: false },
                splitLine: { show: false },
                axisTick: { show: false },
            },
            yAxis: { 
                axisLine: { show: false },
                axisLabel: { show: false },
                splitLine: { show: false },
                axisTick: { show: false },
            },
            series: [
                // {
                //     name: '空闲',
                //     type: 'custom',
                //     itemStyle:{
                //         color: idel
                //     },
                //     data:[0]
                // },
                {
                    name: '运行中',
                    type: 'custom',
                    itemStyle:{
                        color: running
                    },
                    data:[0]
                },
                {
                    name: '待料',
                    type: 'custom',
                    itemStyle:{
                        color: WaitingMaterial
                    },
                    data:[0]
                },
                {
                    name: '上下料',
                    type: 'custom',
                    itemStyle:{
                        color: UpAndDownMaterial
                    },
                    data:[0]
                },
                {
                    name: '调机中',
                    type: 'custom',
                    itemStyle:{
                        color: debug
                    },
                    data:[0]
                },
                {
                    name: '报警',
                    type: 'custom',
                    itemStyle:{
                        color: alarm
                    },
                    data:[0]
                },
                {
                    name: '离线',
                    type: 'custom',
                    itemStyle:{
                        color: unconnected
                    },
                    data:[0]
                },
                // {
                //     name: '自定义异常',
                //     type: 'custom',
                //     itemStyle:{
                //         color: unknown
                //     },
                //     data:[0]
                // },
                {
                    name: '换刀报警',
                    type: 'custom',
                    itemStyle:{
                        color: ToolChangerAlarm
                    },
                    data:[0]
                },
                {
                    name: '首件报警',
                    type: 'custom',
                    itemStyle:{
                        color: FirstPieceAlarm
                    },
                    data:[0]
                }
            ]
        }
        return option;
    }

    componentDidMount() {
        echart = echarts.init(document.getElementById('status_title'));
        let option = this.createOption();
        echart.setOption(option);
    }

    render() {
        return (
            <div id='status_title' style={styles.title_height}>
            </div>
        )
    }
}

const styles = {
    title_height: {
       height: '60px'
    }
}