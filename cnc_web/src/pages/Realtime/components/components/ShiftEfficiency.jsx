import React, { Component } from 'react';
import { Moment } from "@icedesign/base";
import echarts from 'echarts/lib/echarts';

let echart = null, stuOption, interval_left, maxappreg, maxy, _maxy;
let times = null;
export default class DayEfficiency extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dayStatistic: null,
            department: '',
            _parent_id: [],
            classlogo: [],
            add: '',
            markData: [],
            colors: ['rgba(0,0,255,0.03)', 'rgba(0,0,0,0.08)']
        };

    }

    async handleEfficiency(efficiencydata) {
        // console.log(efficiencydata,'efficiencydata')
        let classType = efficiencydata.data.name;
        this.setState({
            add: classType
        })

        await this.Theboottime(this.props.Maximumworkinghour)
        let efficiencies = efficiencydata.data.children;
        let _worktimes = [], _openTimes = [], _efficiencies = [], _shiftdata = [], a = [];
        let hour = Moment().hour();
        for (let index = 0; index < efficiencies.length; index++) {
            let data = efficiencies[index];
            for (let i = 0; i < data.children.length; i++) {
                let childrenName = data.children[i];
                if (childrenName.rt < 0) {
                    _worktimes.push(0);
                    _openTimes.push(0);
                    _efficiencies.push(0);
                    continue;
                }

                let _shiftvalue = {}
                _shiftvalue.name = childrenName.name;
                _shiftvalue.value = childrenName.name;
                _shiftdata.push(_shiftvalue);
                let tmp = 0;
                if (childrenName.wt > 0) {
                    tmp = (childrenName.wt / 60).toFixed(2);
                }
                _worktimes.push(tmp);
                let opentime = (childrenName.rt / 60).toFixed(2);
                _openTimes.push(opentime);

                let efficiency = (childrenName.efficiency);
                _efficiencies.push(efficiency);
            }
        }
        stuOption.series[0].data = _worktimes;
        stuOption.series[1].data = _openTimes;
        stuOption.series[2].data = _efficiencies;
        stuOption.xAxis.data = _shiftdata;
        echart.setOption(stuOption);
        return new Promise(function (resolve, reject) {
            resolve()
        })
    };

    componentWillMount() {
        this.r();
    }

    // yAxis 时间轴的值
    Theboottime(Maximumworkinghours) {
        if (Maximumworkinghours === 0) {
            _maxy = 100;
            maxappreg = 100;
            interval_left = maxappreg / 5;
            maxy = _maxy / 5;
            return new Promise(function (resolve, reject) {
                resolve()
            })
        } else {
            Maximumworkinghours = Maximumworkinghours;
            let price = Maximumworkinghours;
            let maxint = Math.ceil(price / 10);
            let maxval = maxint * 10;
            _maxy = 100;
            maxappreg = maxval;
            interval_left = maxappreg / 5;
            maxy = _maxy / 5;
            return new Promise(function (resolve, reject) {
                resolve()
            })
        }
    }
    componentDidMount() {
        this.draw()
        echart = echarts.init(document.getElementById('day_efficiency'));
        echart.setOption(stuOption);
    }

    // componentWillUnmount(){
    //     clearTimeout(times);
    //     times= null;
    // }

    draw() {
        stuOption = {
            backgroundColor: "rgba(0,0,0,0)",
            color: ["#2cc760", "#2077ff", "#ff9800"],
            title: { text: "历史稼动率", left: "center", textStyle: { color: "#000" } },
            tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
            grid: { left: 10, top: 80, right: 10, bottom: 20, containLabel: true },
            legend: { data: ["工作时长", "开机时长", "稼动率"], left: "center", padding: [5, 10], top: 30 },

            xAxis: {
                "type": "category",
                name: "时段",
                // data : [ 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,0, 1, 2, 3, 4, 5, 6, 7,],
                data: [
                    { name: "8-9点", value: "8-9点" },
                    { name: "9-10点", value: "9-10点" },
                    { name: "10-11点", value: "10-11点" },
                    { name: "11-12点", value: "11-12点" },
                    { name: "12-13点", value: "12-13点" },
                    { name: "13-14点", value: "13-14点" },
                    { name: "14-15点", value: "14-15点" },
                    { name: "15-16点", value: "15-16点" },
                    { name: "16-17点", value: "16-17点" },
                    { name: "17-18点", value: "17-18点" },
                    { name: "18-19点", value: "18-19点" },
                    { name: "19-20点", value: "19-20点" },
                    { name: "20-21点", value: "20-21点" },
                    { name: "21-22点", value: "21-22点" },
                    { name: "22-23点", value: "22-23点" },
                    { name: "23-0点", value: "23-0点" },
                    { name: "0-1点", value: "0-1点" },
                    { name: "1-2点", value: "1-2点" },
                    { name: "2-3点", value: "2-3点" },
                    { name: "3-4点", value: "3-4点" },
                    { name: "4-5点", value: "4-5点" },
                    { name: "5-6点", value: "5-6点" },
                    { name: "6-7点", value: "6-7点" },
                    { name: "7-8点", value: "7-8点" }
                ],
            },
            yAxis: [
                {
                    type: "value",
                    name: "时间(min)",
                    Min: 0,
                    // 调用this.Theboottime 取开机时长给'max',均分Y轴
                    // max: maxappreg ? maxappreg : 60,
                    max: 60,
                    interval: interval_left,
                    axisLabel: { formatter: "{value}" },
                    splitNumber: 5
                },
                {
                    type: "value",
                    name: "稼动率(%)",
                    min: 0,
                    // 调用this.Theboottime 设备最大值给'max',均分稼动率Y轴
                    // max: _maxy ? _maxy : 100,
                    max: 100,
                    position: "right",
                    splitLine: { show: false },
                    splitNumber: 5,
                    interval: maxy ? maxy : 100 / 5,

                }
            ],
            series: [

                {
                    name: "工作时长",
                    type: "bar",
                    barWidth: 10,
                    data: [0],


                },
                {
                    name: "开机时长",
                    type: "bar",
                    barWidth: 10,

                    data: [0],
                },
                {
                    name: "稼动率",
                    type: "line",
                    yAxisIndex: 1,
                    smooth: true,
                    showSymbol: false,
                    data: [0],
                    markArea: {
                        // data: this.state.markData,
                        data: [
                            [{
                                name: '白班',
                                xAxis: 0,
                                itemStyle: {
                                    color: 'rgba(0,0,255,0.03)'
                                }
                            }, {
                                xAxis: 12
                            }],
                            [{
                                name: '夜班',
                                xAxis: 12,
                                itemStyle: {
                                    color: 'rgba(0,0,0,0.08)'
                                }
                            }, {
                                xAxis: 24
                            }],
                            //   [{
                            //     name: 'E',
                            //     xAxis: 10,
                            //     itemStyle: {
                            //         color: 'rgba(254,231,219,0.7)'
                            //     }
                            //   }, {
                            //     xAxis: 0
                            //   }]
                        ]
                    },
                    color: '#ff9800'

                },

            ],



        };
        echart = echarts.init(document.getElementById('day_efficiency'));
    }

    // shouldComponentUpdate() {
    //     return true;
    // }


    componentWillReceiveProps(nextProps) {
        this.r();
        let { deviceInfo } = nextProps;
        this.setState({
            department: deviceInfo.department
        });

    }

    r() {
        let efficiencydata = this.props.dayStatistic;
        if (!efficiencydata || efficiencydata.length <= 0) {
            return;

        }
        let arr = Object.keys(efficiencydata);
        if (arr.length) {
            this.handleEfficiency(efficiencydata).then(() => {
                if (!times) return;
                this.draw()
            });
        }
    }

    render() {

        return (
            <div id="day_efficiency">
            </div>
        )
    }

}