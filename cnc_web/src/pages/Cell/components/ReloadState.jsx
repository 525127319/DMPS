import React, { Component } from "react";
import echarts from 'echarts/lib/echarts';
import ReloadChart from "@/components/CellBlock/ReloadChart";
import DeviceinfoUtil from "@/utils/DeviceinfoUtil";
import TimeUtil from "@/utils/TimeUtil";

/** 
 * 上下料统计报表
*/
export default class ReloadState extends ReloadChart {

    constructor(props) {
        super(props);
    }
    /**
     * 获取标准定义
     * @param {*} props 
     */
    getNorm(){
        let _norm = this.props.norm;
        if (!_norm || !_norm.reloadTime) {
            _norm = {
                reloadTime: 300,
                reloadUpBias: 15,
                reloadLowBias: -15
            };
        }
        return _norm;
    }

    /**
     * 当mouse在点上提示信息
     */
    propup(data){
        let details = data.details;
        let rs = '<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设备:' + DeviceinfoUtil.getNameByDevId(data.devId) + '</span><br/>';
        if (details && details.length > 0) {
            details.forEach(item => {
                rs += '<span>换刀时间:' + item.s + '-' + item.e + '</span><br/>';
                rs += '<span>换刀时长:' + item.uploadduration+ '</span><br/>';
            });
        }
        return rs;
    }

    /** 
     * 返回标题
     */
    title(){
        return '换刀时长分布图';
    }

    /**
     * 返回legend,
     * 返回数组
     */
    legend(){
        return ['换刀时长(s)'];
    }

    mkSeries(x, y){
        return [{
            name: '换刀时长(s)',
            type: 'scatter',
            data: y,
            // xAxisIndex: 2,
            // yAxisIndex: 2,
            color: '#4976c2',
            id: '0001',
            label: {
                normal: {
                    formatter: function(a,b){
                       return a.data[1];
                    },
                    position: 'top',
                   show: false
                },

            },
           // markLine: morn,
        }];
    }
}
