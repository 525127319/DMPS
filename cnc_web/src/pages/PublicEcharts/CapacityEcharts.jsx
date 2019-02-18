import React, { Component } from "react";
import echarts from 'echarts/lib/echarts';

let echart = null, stuOption;

export default class CapacityEcharts extends Component {
    constructor(props){
        super(props)
        this.state = {
        }
        this.echart = null
    }
        componentWillMount(){
            stuOption = {
                title: {
                text: 'TOP5 产能损失数',
                x: 'center',
                y: '20',
                textStyle: {
                    fontSize: 16,
                    color:'#333'
                },    
            }, 
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
            },
            /*legend: {
                data: [date]
            },*/
            grid: {
                left: '3%',
                right: '3%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                min: 0,
                        axisTick: {
                    show: false
                },
                interval: 20,
            },
            yAxis: {
                type: 'category',
                data: ['MC3002/11', 'MC3003/12', 'MC3004/13', 'MC3005/16', 'MC3006/1'],
                 axisTick: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    interval: 0,
                    rotate: 0,
                    textStyle: {
                        fontWeight: '50'
                    }
                }
            },
            series: [{
                type: 'bar',
                itemStyle: {
                        normal: {
                            color: "#0089ff",
                            label: {
                                show: true,
                                textStyle: {
                                    color: "#333"
                                },
                                position: "right",
                            }
                        }
                    },
                data: [22, 33, 44, 55, 66]
            }]
        };
        }

        componentDidMount(){
            this.echart = echarts.init(document.getElementById('CapacityEcharts'));
            this.echart.setOption(stuOption);
            window.addEventListener("resize",()=>{              
                this.echart.resize();
            });
        }
  
    render(){
        return(
            <div className='CapacityEcharts' id="CapacityEcharts">

            </div>
        )
    }
}