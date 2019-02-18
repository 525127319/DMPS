import React, { Component } from "react";
import echarts from 'echarts/lib/echarts';

let echart = null, stuOption;
export default class OutputEcharts extends Component {
    constructor(props){
        super(props)
        this.state = {
        }
        this.echart = null
    }
        componentWillMount(){
            stuOption = {
                    title: {
                    text: '日产能数',
                    x: 'center',
                    y: '0',
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
                    bottom: '1%',
                    containLabel: true
    
                },
                legend: {
                    data: ['产出数','目标产出'],
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
                    data: [8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,1,2,3,4,5,6,7],
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
                        name: "产出数",
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
                                }
                            }
                        },
                        data: [
                            30,
                            15,
                            40,
                            20,
                            60,
                            70,
                            30,
                            15,
                            40,
                            20,
                            60,
                            70,
                            30,
                            15,
                            40,
                            20,
                            60,
                            70,
                            30,
                            15,
                            40,
                            20,
                            60,
                            70,
                        ],
                    },{
                        "name": "目标产出",
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
                            20,
                            20,
                            20,
                            20,
                            20,
                            20,
                            20,
                            20,
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

        componentDidMount(){
            this.echart = echarts.init(document.getElementById('OutputEcharts'));
            this.echart.setOption(stuOption);
            window.addEventListener("resize",()=>{              
                this.echart.resize();
            });
        }
  
    render(){
        return(
            <div className='OutputEcharts2' id="OutputEcharts">

            </div>
        )
    }
}