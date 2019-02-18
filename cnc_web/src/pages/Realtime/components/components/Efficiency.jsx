import React, {Component} from 'react';
import {Moment} from "@icedesign/base";
import echarts from 'echarts/lib/echarts';

let stuOption = null;
let stuChart = null;
let timer = null;
let tempXaxis = [];
let tempSeriesefficiency = [];
let tempSeriesWt = [];
let tempSeriesRt = [];

export default class Efficiency extends Component {
    constructor(props) {
        super(props);
        this.state = {
            xaxisdata: [],
            serieswt: [],
            seriesrt: [],
            seriesefficiency: [],
        };
    }

    handleEfficiency = function (efficiencydata) {
        if (tempXaxis.length === 10) {
            tempXaxis.shift();
        }
        if (tempSeriesefficiency.length === 10) {
            tempSeriesefficiency.shift();
        }
        if (tempSeriesWt.length === 10) {
            tempSeriesWt.shift();
        }
        if (tempSeriesRt.length === 10) {
            tempSeriesRt.shift();
        }

        let tempEfficiency = (efficiencydata.data.efficiency).toFixed(2);
        let tempwt = ((efficiencydata.data.wt) / 3600).toFixed(2);
        let temprt = ((efficiencydata.data.rt) / 3600).toFixed(2);
        let tempefficiencytime = Moment((efficiencydata.time) * 1000).format('HH:mm');

        // Unix时间戳格式化
        // let aa = Moment(1525850290000).format('YYYY-MM-DD HH:mm:ss')
        // console.log(aa);

        tempXaxis.push(tempefficiencytime);
        tempSeriesWt.push(tempwt);
        tempSeriesRt.push(temprt);
        tempSeriesefficiency.push(tempEfficiency);
        this.setState({
            xaxisdata: tempXaxis,
            serieswt: tempSeriesWt,
            seriesrt: tempSeriesRt,
            seriesefficiency: tempSeriesefficiency,
        });
        stuOption.xAxis.data = this.state.xaxisdata;
        stuOption.series[0].data = this.state.seriesrt;
        stuOption.series[1].data = this.state.serieswt;
        stuOption.series[2].data = this.state.seriesefficiency;
    }.bind(this);

    componentWillMount() {
        let curTime = Moment(Date.now()).format('HH:mm');

        stuOption = {
            backgroundColor: "#F5F6F7",
            color: ["#2077ff", "#2bcda2", "#ff9800"],
            title: {text: "稼动率", left: "center", textStyle: {color: "#000"}},
            tooltip: {trigger: "axis", axisPointer: {type: "cross"}},
            grid: {left: 10, top: 80, right: 10, bottom: 20, containLabel: true},
            legend: {data: ["总开机时长", "总开机时间", "稼动率"], left: "center", padding: [5, 10], top: 30},
            xAxis: {
                type: "category",
                data: [curTime]
            },
            yAxis: [
                {type: "value", name: "时间 （h）", min: 0, max: 50, axisLabel: {formatter: "{value}"}}, {
                    type: "value",
                    name: "稼动率（%）",
                    min: 0,
                    max: 100,
                    position: "right",
                    axisLabel: {formatter: "{value}"}
                }],
            series: [
                {
                    name: "总开机时长",
                    type: "bar",
                    barWidth: 20,
                    data: [0]
                }, {
                    name: "总开机时间",
                    type: "bar",
                    barWidth: 20,
                    data: [0]
                }, {
                    name: "稼动率",
                    type: "line",
                    yAxisIndex: 1,
                    data: [0],
                    markPoint: {
                        color: "blue",
                        data: [
                            {type: "max", name: "最大值"},
                            {type: "min", name: "最小值"}
                        ]
                    }
                }]
        };
    }

    componentDidMount() {
        stuChart = echarts.init(document.getElementById('efficiency'));
        stuChart.setOption(stuOption);
    }

    componentWillReceiveProps() {
        let efficiencydata = this.props.devicerealtimeData;
        let arr = Object.keys(efficiencydata);
        if (arr.length) {
            this.handleEfficiency(efficiencydata);
        }
    }

    shouldComponentUpdate() {
        stuChart = echarts.init(document.getElementById('efficiency'));
        stuChart.setOption(stuOption);
        return true;
    }

    componentWillUnmount() {
    }

    render() {

        return (
            <div id="efficiency">
            </div>
        )
    }
}