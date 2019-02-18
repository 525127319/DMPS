import React, { Component } from "react";
import echarts from 'echarts/lib/echarts';

let echart = null, stuOption;
export default class WeekEcharts extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        this.echart = null
    }
    componentWillMount() {
        stuOption = {
            title: {
                text: '周报',
                x: 'center',
                y: '-5',
                textStyle: {
                    fontSize: 16,
                    color:'#333'
                },    
            }, 
            tooltip: {
                trigger: 'axis'
            },

            grid: {
                left: '3%',
                right: '3%',
                bottom: '3%',
                containLabel: true
            },
            legend: {
                data: ['week','目标产出总数'],
                top:30,
            },
            xAxis: [{
                type: "category",
                axisLine: {
                    lineStyle: {
                        color: '#90979c'
                    }
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitArea: {
                    show: false
                },
                axisLabel: {
                    interval: 0,

                },
                data: ['10/8','10/9','10/10','10/11','10/12','10/13','10/14'],
            }],
            yAxis: [{
                type: "value",
                axisTick: {
                    show: false
                },
                axisLabel: {
                    interval: 0,

                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#90979c'
                    }
                },
                splitArea: {
                    // show: false
                },

            }],
            series: [{
                    name: "week",
                    type: "bar",
                    barMaxWidth: 35,
                    barGap: "10%",
                    itemStyle: {
                        normal: {
                            color: "#0089ff",
                            label: {
                                show: true,
                                textStyle: {
                                    color: "#333"
                                },
                                position: "insideTop",
                            }
                        }
                    },
                    data: [
                        80,
                        75,
                        50,
                        40,
                        70,
                        100,
                        100,
                    ],
                },{
                    "name": "目标产出总数",
                    "type": "line",
                    "stack": "总量",
                    smooth: true,
                    symbolSize:1,

                    itemStyle: {
                        normal: {
                            color: "#b9ebc7",
                            barBorderRadius: 0,
                            label: {
                                show: true,
                                position: "top",
                                color:'red'
                            }
                        }
                    },
                    data: [
                        20,
                        20,
                        20,
                        20,
                        20,
                        20,
                        20,
                        20,
                    ]
                },
            ]
        }
    }

    componentDidMount() {
        this.echart = echarts.init(document.getElementById('weekStatement'));
        this.echart.setOption(stuOption);
        window.addEventListener("resize", () => {
            this.echart.resize();
        });
    }

    render() {
        return (
            <div className='weekStatement' id="weekStatement">

            </div>
        )
    }
}