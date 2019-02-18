import React, { Component } from "react";
import echarts from 'echarts/lib/echarts';
import CComponent from "@/components/Common/CComponent";
import DeviceinfoUtil from "@/utils/DeviceinfoUtil";

/** 
 * 待机统计报表
*/

export default class WaitState extends CComponent {

    constructor(props){
        super(props);
    }

    /**
     * 获取标准定义
     * @param {*} props 
     */
    getNorm(){

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

    /**
     * 
     * @param {*} waity2   包括冲突值
     * @param {*} waity    除掉冲突值
     * @param {*} norm 上限，标准，下限
     */
    _mkSeries(waity2, waity, norm, morn){
        let series = this.mkSeries(waity2, waity);
        debugger;
        if (morn != 0){
            return series.concat(norm);
        }
        return series;
    }

    mkSeries(x, y){
        return [];
    }
    willReceiveProps(newProps, oldProps){
        let waitx = newProps.waitx;
        let waity = newProps.waity;
        let waity2 = newProps.waity2;
        let _norm = this.getNorm();
        if (!_norm){
            _norm={
                idleTime: 0,
                idleUpBias: 0,
                idleLowBias: 0
            }
        }
        this.datasource = newProps.datasource;
        if (waity && waity.length > 0){
            this.setOption(waitx, waity, waity2, _norm.idleTime, _norm.idleTime + _norm.idleUpBias, _norm.idleTime + _norm.idleLowBias);
        }
    }

    setOption(waitx, waity, waity2, morn, limit, low) {
        if (!this.echart)return;
        if (!waity || waity.length <= 0)return;
        // let array0 = []
        // for (let index = 0; index < waitx.length; index++) {
        //     array0.push(waitx[index]);
        // }
        let fn = function(params){
            let rs = '';
            let index = params.dataIndex;
            let data = this.datasource[index];
            if (!data)return;
            return this.propup(data);
        }.bind(this);
        
        let option = {
            backgroundColor: '#fff',
            legend: {
                top: '25',
                data: this.legend()
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
                axisTick: {
                    show: false
                },
                splitNumber: 10,
                type: 'time',
                name: '时间'
                //data: waitx,
                // 'axisLabel': {
                //     rotate: '90'
                // },
            },
            yAxis: {
                // axisTick: {
                //     show: false
                // },
                // splitLine: {
                //     show: false
                // },
                scale: true,
                name: '待机时间(s)'
                // max:200,
                // splitNumber: 5
            },
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
                this._mkSeries(waity2, waity, [{
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
                            }
                        }, {
                            yAxis: morn,
                            lineStyle: {
                                color:"#b9ebc7",
                            }
                        }, {
                            yAxis: low,
                            lineStyle: {
                                color:"#005bee",
                            }
                        }
                    ]
                    },
                }], morn)
        };
        if (this.props.isFirstTime)
            this.echart.setOption(option);
    }

    didMount() {
        let fn = function(start, end){
            this.props.countWait(start, end);
        }.bind(this);
        this.echart = echarts.init(document.getElementById(this.props.chartId));
        this.echart.on('datazoom', function (params) {
            let start =  this.echart.getModel().option.dataZoom[0].startValue;
            let end =  this.echart.getModel().option.dataZoom[0].endValue;
            setTimeout(()=>{
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