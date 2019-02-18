import React, { Component } from "react";
import echarts from 'echarts/lib/echarts';
import WaitChart from "@/components/CellBlock/WaitChart";
import DeviceinfoUtil from "@/utils/DeviceinfoUtil";

/** 
 * 待料统计报表
*/

export default class WaitState extends WaitChart {

    constructor(props){
        super(props);
    }


 /**
     * 获取标准定义
     * @param {*} props 
     */
    getNorm(){
        let _norm = this.props.norm;
        if (!_norm){
            _norm = {
                idleTime: 60,
                idleUpBias: 5,
                idleLowBias: -5
            };
        }
        return _norm;
    }

    /**
     * 当mouse在点上提示信息
     */
    propup(data){
        let details = data.details;
        let rs = '<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设备:'+DeviceinfoUtil.getNameByDevId(data.devId)+'</span><br/>';
        if (details && details.length > 0){
            rs+='<span>待机时间:'+details[0].s+'-'+details[0].e+'</span><br/>';
            for(let i = 1; i < details.length;i++){
                rs+='<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+details[i].s+'-'+details[i].e+'</span><br/>';
            }
            //console.log('id', details[0]._id);               
            rs+='<span>待机时长:'+details[0].realwaitduration+'</span><br/>';
            rs+='<span>实际待机:'+details[0].opwaitduration+'</span><br/>';
            rs+='<span>冲突时长:'+details[0].conflictTime+'</span><br/>';
        }
        return rs;
    }

    /** 
     * 返回标题
     */
    title(){
        return '待机时长分布图';
    }

    /**
     * 返回legend,
     * 返回数组
     */
    legend(){
        return ['待机时长(s)', '实际待机(s)'];
    }

    mkSeries(waity2, waity){
        return [
            {
                name: '待机时长(s)',
                type: 'scatter',
                data: waity2,
                symbolSize: 15, 
                symbol: 'image://data:image/jpeg;base64,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',
                color: '#fc0d1b',
                id: 'a0001',
                label: {
                    normal: {
                        formatter: function(a){
                            return a.data[1];
                         },
                        position: 'right',
                        show: false
                    },

                },
            },
            {
                name: '实际待机(s)',
                type: 'scatter',
                data: waity,
                color: '#4976c2',
                id: 'a0002',
                symbolSize: 8, 
                label: {
                    normal: {
                        formatter: function(a,b){
                            return a.data[1];
                         },
                        position: 'top',
                        show: false
                    },

                },
            }
        ]
    }

}
