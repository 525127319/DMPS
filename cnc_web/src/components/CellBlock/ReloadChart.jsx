import React, { Component } from "react";
import echarts from 'echarts/lib/echarts';
import CComponent from "@/components/Common/CComponent";
import DeviceinfoUtil from "@/utils/DeviceinfoUtil";
import TimeUtil from "@/utils/TimeUtil";

/** 
 * 上下料统计报表
*/
export default class Reload extends CComponent {

    constructor(props) {
        super(props);
    }

    /**
     * 获取标准定义
     * @param {*} props 
     */
    getNorm(props){

    }

    /**
     * 当mouse在点上提示信息
     */
    propup(){

    }

    /** 
     * 返回标题
     */
    title(){

    }

    /**
     * 返回legend,
     * 返回数组
     */
    legend(){

    }

    mkSeries(x, y){
        return [];
    }

    _mkSeries(x, y, norm, limit, low){
        let series = this.mkSeries(x, y);
        if (norm == 0)
            return series;
        return series.concat(  
        {
            type: 'scatter',
            markLine: {
                symbol: 'none',
                silent: true,
                // lineStyle: {
                //     normal: {
                //         type: 'solid'
                //     }
                // },
                data: [{
                    yAxis: limit,
                    lineStyle: {
                        color:"red",
                    },
                    label:{
                        normal: {
                            formatter: '上限',
                        }
                    }
                }, {
                    yAxis: norm,
                    lineStyle: {
                        color:"#b9ebc7",
                    },
                    label:{
                        normal: {
                            formatter: '标准',
                        }
                    }
                }, {
                    yAxis: low,
                    lineStyle: {
                        color:"#005bee",
                    },
                    label:{
                        normal: {
                            formatter: '下限',
                        }
                    }
                }
            ]
            }
        });
    }

    willReceiveProps(newProps, oldProps) {
        let x = newProps.x;
        let y = newProps.y;
        //this.state.norm.reloadTime}/{this.state.norm.reloadUpBias}/{this.state.norm.reloadLowBias
        let _norm = this.getNorm(this.props.norm);
        if (!_norm){
            _norm={
                reloadTime: 0,
                reloadUpBias: 0,
                reloadLowBias: 0
            }
        }

        this.datasource = newProps.datasource;
        //x = y;
        if (y && y.length > 0) {
            this.setOption(x, y, _norm.reloadTime, _norm.reloadTime + _norm.reloadUpBias, _norm.reloadTime + _norm.reloadLowBias);
        }
    }

    setOption(x, y, norm, limit, low) {        
        if (!y || y.length <= 0) return;
        let fn = function (params) {
           ;
            let index = params.dataIndex;
            let data = this.datasource[index];
            if (!data) return;
            return this.propup(data);
        }.bind(this);

        let option = {
            backgroundColor: '#fff',
            legend: {
                top: '25',
                data: this.legend()//'标准', '上限', '下限', 
            },
            grid: {
                bottom: '22%',
                right: '5%',
                left: '7%',
                top: '10%'
            },
            title: {
                text: this.title(),
                left: 'center',
                textStyle: {
                    fontSize: 16,
                }
            },
  
            xAxis: {
                    splitNumber: 10,
                    type: 'time',
                    name: '时间'
                }
            ,
            yAxis: [
            {
                scale: true,
                name: '时间(s)'
            }
        ],
            tooltip: {
                trigger: 'item',
                formatter: fn
            },
            dataZoom: [
                {
                    show: true,
                    xAxisIndex: [0],
                    type: 'slider',
                    bottom: 10,
                    start: 0,
                    end: 100,
                    //zoomLock: true,
                    realtime: true,
                    left: 50,
                    right: 60,
                    handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '105%',
                }
            ],
            series: 
                this._mkSeries(x, y, norm, limit, low)
        };
        if (this.props.isFirstTime)
        this.echart.setOption(option);
    }

    didMount() {
        let fn = function (start, end) {
            this.props.countLoad(start, end);
        }.bind(this);
        this.echart = echarts.init(document.getElementById(this.props.chartId));
        this.echart.on('datazoom', function (params) {
            let start = this.echart.getModel().option.dataZoom[0].startValue;
            let end = this.echart.getModel().option.dataZoom[0].endValue;
            setTimeout(() => {
                fn(start, end);
            }, 500);
        }.bind(this));
    }

    render() {
        return (
            <div id={this.props.chartId} style={styles.statusCanvas}></div>
        )
    }
}

const styles = {
    statusCanvas: {
        width: '60%',
        height: '500px'
    }
}