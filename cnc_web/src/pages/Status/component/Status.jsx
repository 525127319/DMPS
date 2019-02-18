import React, { Component } from 'react';
import { Moment} from "@icedesign/base";
import echarts from 'echarts/lib/echarts';
import AxiosHttp from '@/utils/AxiosHttp';
import { status, evn } from '@/utils/Config';
import TimeUtil from '@/utils/TimeUtil';
import { div } from 'gl-matrix/src/gl-matrix/vec4';

let Config = status;
let idel = Config.IdelC;
let running = Config.RunningC;
let alarm = Config.AlarmC;
let stop = Config.StopC;
let pause = Config.PauseC;
let debug = Config.DebugC;
let unconnected = Config.UnConnecteedC;
let unknown = Config.Unknown;
let indexArr = []; 
let statusDatas,firstT;
export default class Status extends Component {
    constructor(props){
        super(props);
        this.shouldSHow = false;
        this.topPadding = 1; 
       

    }

    translate2Second(time) {
        // console.log(Moment(this.props.day).format('X'),'kkkkkkkkkkkkk')
        // console.log(parseInt(Moment(this.props.day).format('X'))+this.props.shiftSTime,'mmmmmmmmmmmmmmmmmmmm')
        let moment = Moment(time * 1000);//由于存储为1000位数据(32位机器决定)
        let hour = moment.hour();
        let mm = moment.minute();
        let ss = moment.second();
        if(time>parseInt(Moment(this.props.day).add(1,'d').format('X'))&&time<=(parseInt(Moment(this.props.day).add(1,'d').format('X'))+this.props.shiftSTime)){
            time =86400+hour * 3600 + mm * 60 + ss;
        }else if(parseInt(Moment().hour(0).minute(0).second(0).format('X'))<time && time< parseInt(Moment().hour(0).minute(0).second(0).format('X'))+this.props.shiftSTime){
            time =86400+hour * 3600 + mm * 60 + ss;
        }
        else{
            time = hour * 3600 + mm * 60 + ss;//转换为秒
        }
        // return time = hour * 3600 + mm * 60 + ss;//转换为秒
        return time;//转换为秒
    }

    handle = function () {

        let {statusDatas,devid} = this.props;

        if (!statusDatas || statusDatas.length <= 0){
            this.option.series[0].markArea.data = [];
            this.option.series[1].data = [];
            this.echart.setOption(this.option);
            return;
        }
        // 当天的时候
        if(parseInt(Moment().hour(0).minute(0).second(0).format('X'))+this.props.shiftSTime<Moment().format('X') && Moment().format('X')< parseInt(Moment(this.props.day).add(1,'d').format('X'))+this.props.shiftSTime){
            if(Moment().format('X')-statusDatas[statusDatas.length-1].data.end_time>=180){
            statusDatas.push({
                data:{
                  start_time:statusDatas[statusDatas.length-1].data.end_time,
                //   end_time:statusDatas[statusDatas.length].data.start_time || Moment().format('X'),
                  end_time: Moment().format('X'),
                  status:10
                },
                type:'status',
                dev_id: this.props.devid.toString()
            })
           }

           let curDayTime = parseInt(Moment().hour(0).minute(0).second(0).format('X'))+this.props.shiftSTime;
            firstT = statusDatas[0].data.start_time; // 跨天开始时间
            if(firstT<curDayTime){
                statusDatas[0].data.start_time = curDayTime;
            }
        }else{// 昨天以前的时候

            var yesDayTime = parseInt(Moment(this.props.day).format('X'))+this.props.shiftSTime;
            firstT = statusDatas[0].data.start_time; // 跨天开始时间
           

            //====================================

            if(parseInt(Moment().hour(0).minute(0).second(0).format('X'))<Moment().format('X') && Moment().format('X')< parseInt(Moment(this.props.day).add(0,'d').format('X'))+this.props.shiftSTime){
                if((parseInt(Moment().format('X')))-statusDatas[statusDatas.length-1].data.end_time>=180){
                statusDatas.push({
                    data:{
                    start_time:statusDatas[statusDatas.length-1].data.end_time,
                    end_time: parseInt(Moment().format('X')),
                    status:10
                    },
                    type:'status',
                    dev_id: this.props.devid.toString()
                })
            }
            }else{
                 if(firstT<yesDayTime){
                    statusDatas[0].data.start_time = yesDayTime;
                 }
                if((parseInt(Moment(this.props.day).add(1,'d').format('X'))+this.props.shiftSTime)-statusDatas[statusDatas.length-1].data.end_time>=180){
                statusDatas.push({
                    data:{
                    start_time:statusDatas[statusDatas.length-1].data.end_time,
                    end_time: parseInt(Moment(this.props.day).add(1,'d').format('X'))+this.props.shiftSTime,
                    status:10
                    },
                    type:'status',
                    dev_id: this.props.devid.toString()
                })
                }
                }

            //========================================


            // if((parseInt(Moment(this.props.day).add(1,'d').format('X'))+this.props.shiftSTime)-statusDatas[statusDatas.length-1].data.end_time>=180){
            //     statusDatas.push({
            //         data:{
            //           start_time:statusDatas[statusDatas.length-1].data.end_time,
            //         //   end_time:statusDatas[statusDatas.length].data.start_time || Moment().format('X'),
            //           end_time: parseInt(Moment(this.props.day).add(1,'d').format('X'))+this.props.shiftSTime,
            //           status:10
            //         },
            //         type:'status',
            //         dev_id: this.props.devid.toString()
            //     })
            //    }
        }

       

        indexArr = []
       
        for(let i = 1; i<=statusDatas.length;i++){

                if(i !==statusDatas.length){
                    if( statusDatas[i-1].data.end_time !== statusDatas[i].data.start_time && i<statusDatas.length){
                        indexArr.push(i)
                    }
                }
       }

       if(indexArr.length>0){
        indexArr.forEach((index,i)=>{
            var newIndex = index+i
           statusDatas.splice(newIndex,0,{
               data:{
                 end_time:statusDatas[newIndex].data.start_time,
                 start_time:statusDatas[newIndex-1].data.end_time,
                 status:10
               },
               type:'status',
               dev_id: this.props.devid.toString()
           })

        })
    }

        let datas = [], second = null, last, lastSecond, cur, curSecond, color, lines = [];
        for (let index = 1; index <= statusDatas.length; index++) {
            //if (!(index % 2)) {
                last = statusDatas[index - 1];
                lastSecond = this.translate2Second(last.data.start_time);
                if(index === statusDatas.length) {
                    let dateEntTime = parseInt(TimeUtil.getDayEndUnixTime(last.data.end_time));//获取指定日期结束时间， 返回long
                    let endTimeDay = parseInt(Moment(this.props.day).add(1,'d').format('X'))+this.props.shiftSTime; // 获取指定天的
                    // console.log(endTimeDay,'endTimeDay')
                    if(last.data.end_time < endTimeDay) {
                        curSecond = this.translate2Second(last.data.end_time);
                    }else {
                        curSecond = this.translate2Second(endTimeDay);
                    }

                } else {

                     cur = statusDatas[index-1];
                     curSecond = this.translate2Second(cur.data.end_time)
                }

                let _v = last.data.status;//状态
                switch (_v) {
                    case Config.IdleV:
                        color = idel;
                        break;
                    case Config.RunningV:
                        color = running;
                        break;
                    case Config.AlarmV:
                        color = alarm;
                        break;
                    // case Config.StopV:
                    //     color = stop;
                    //     break;
                    // case Config.PauseV:
                    //     color = pause;
                    //     break;
                    case Config.DebugV: // 调试
                        color = debug;
                        break;
                    case Config.UnConnectedV:
                        color = unconnected;
                        break;
                    case Config.UnknownV: // 自定义异常
                        color = unknown;
                        break;
                }
                datas.push([{
                    xAxis: lastSecond,
                    itemStyle: {
                        color: color
                    }
                }, {
                    xAxis: curSecond,
                    itemStyle: {
                        color: color
                    }
                }]);
                lines.push(curSecond);

            //}
           
        }
        if (datas.length <= 0)
            return;

        // this.setState({
        //    datas: datas
        // });
        // //'运行中', '空闲', '报警', '未联接'
        try{
            this.option.series[0].markArea.data = datas;
            this.option.series[1].data = lines;
            this.echart.setOption(this.option);
        } catch(error){

        }
       
    }.bind(this);

    createOption() {
        let {xMin,xMax} = this.props;
        var baseTop = 0;
        var gridHeight = 20;

        var data = {
            main: [],
            xMin: xMin,
            xMax: xMax
        };

        function makeXAxis(gridIndex, opt) {
            return echarts.util.merge({
                type: 'value',
                gridIndex: gridIndex,
                axisLine: { onZero: false },//, lineStyle: { color: '#ddd' }
                axisTick: { show: true },
                axisLabel: { show: true, formatter: (value, index)=>{
                    return value/60/60>=24?value/60/60-24:value/60/60;;
                }
                },
                splitLine: { show: false, lineStyle: { color: '#ddd' } },
                min: data.xMin,
                max: data.xMax,
                splitNumber: 24,
                interval: 3600,
                axisPointer: {
                    lineStyle: { color: 'transparent' }
                }
            }, opt || {}, true);
        }

        function makeYAxis(gridIndex, opt) {
            return echarts.util.merge({
                type: 'value',
                gridIndex: gridIndex,
                nameLocation: 'middle',
                nameTextStyle: {
                    color: '#333'
                },
                boundaryGap: ['30%', '30%'],
                axisTick: { show: false },
                //axisLine: { lineStyle: { color: '#ccc' } },
                axisLabel: { show: false },
                splitLine: { show: false }
            }, opt || {}, true);
        }

        function makeGrid(top, opt) {
            return echarts.util.merge({
                top: top,
                height: gridHeight,
                left:30,
                right:38
            }, opt || {}, true);
        }

        this.option = {
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    if (params.length) {
                        let time = params[0];
                        if (!time)return;
                        let _data = time.data; 
                        let curDayTime = TimeUtil.getDayStartUnixTime();
                        curDayTime = parseInt(curDayTime) + _data;
                        // var style = 'color: ' + time.color;
                        var style =  'color: #ffffff';
                        return '<span style="' + style + '">' 
                        + '时间：</span><span style="' 
                        + style + '">' + TimeUtil.format(curDayTime, 'HH:mm:ss') + '</span>';
                    }
                }
            },
            grid: [
                makeGrid(baseTop),
                makeGrid(baseTop),
                makeGrid(baseTop),
            ],
            xAxis: [
                makeXAxis(0, {
                    axisLine: { show: true }
                }),
                makeXAxis(1, {
                    axisLine: { show: false },
                    splitLine: {show: false},
                    axisTick: {show: false},
                    axisLabel: { show: false}
                }),
                makeXAxis(2, {
                    axisLine: { show: false },
                    splitLine: {show: false},
                    axisTick: {show: false},
                    axisLabel: { show: false}
                }),
            ],
            yAxis: [
                makeYAxis(0, {
                    name:  this.props.devname,
                    axisLine: { show: true }
                }),
                makeYAxis(1, {
                    //name: 'test',
                    axisLine: { show: false }
                }),
                makeYAxis(2, {
                    //name: 'test',
                    axisLine: { show: false }
                }),
            ],

            series: [{
                name: '时间',
                type: 'line',
                symbol: 'circle',
                symbolSize: 2,
                xAxisIndex: 0,
                yAxisIndex: 0,
                markArea: {
                    data: data.main
                }
            },
            {
                name: '空闲',
                type: 'line',
                xAxisIndex: 1,
                yAxisIndex: 1,
                itemStyle:{
                    color: idel,
                    opacity:0
                },
                lineStyle:{
                    width: 0,
                    opacity: 0
                },
                data:[0]
            },
            {
                name: '报警',
                type: 'line',
                xAxisIndex: 2,
                yAxisIndex: 2,
                itemStyle:{
                    color: alarm,
                    opacity:0
                },
                lineStyle:{
                    width: 0,
                    opacity: 0
                },
                data:[0]
            }
            ]
        };
    }

    componentWillMount() {
       
        this.createOption();
    }

    componentDidMount() {
        let {statusDatas,devid} = this.props;
        let rendTo = document.getElementById(this.rendToId);
        this.echart = echarts.init(rendTo);
        this.handle();
        this.echart.setOption(this.option);
    }

    componentWillReceiveProps(nextProps){
         this.props = nextProps;
         this.handle();
        //  this.createOption();

    }

    componentWillUnmount() {
       // clearInterval(this.timer);
     
    }
      

    render() {
        let time = TimeUtil.geCurUnixTime();
        this.rendToId =  this.props.devid;
        return (
            <div id={this.rendToId } className='status-canvas' style={this.shouldSHow? styles.status_height2: styles.status_height}>
            </div>  
        )
    }

}

const styles = {
    status_height: {
        height: '50px',
        margin:'6px 0'
    },

    status_height2: {
        height: '180px'
    }
}