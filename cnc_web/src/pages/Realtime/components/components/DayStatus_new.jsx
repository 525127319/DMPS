import React, { Component } from 'react';
import { Moment } from "@icedesign/base";
import echarts from 'echarts/lib/echarts';
import AxiosHttp from '@/utils/AxiosHttp';
import { status, evn } from '@/utils/Config';
import TimeUtil from '@/utils/TimeUtil';
import ShiftUtil from '@/utils/ShiftUtil';
import _ from 'lodash';

let Config = status;
let idel = Config.IdelC;
let running = Config.RunningC;
let alarm = Config.AlarmC;
let WaitingMaterial = Config.WaitingMaterialC;
let UpAndDownMaterial = Config.UpAndDownMaterialC;
let debug = Config.DebugC;
let unconnected = Config.UnConnecteedC;
let ToolChangerAlarm = Config.ToolChangerAlarmC;
let FirstPieceAlarm = Config.FirstPieceAlarmC;
let Unknown = Config.UnknownC;
let code,msg;

let interval = 10000;
let timess = 1;     
let statusDatas,devid,optiondate;
let indexArr = [], findAlarmInfoArr = [];
let firstT ; 
let xMin= 28800,xMax=115200
//  let xMin= 57600,xMax=144000

export default class DayStatus extends Component {
    constructor(props) {
        super(props);
        let shiftDate = ShiftUtil.getShiftDate();
        this.state = {
            datas:[],
            timeData:null,
            shift_sTime:28800,
            optiondate:'',
            shiftDate: shiftDate

        };
        this.rendToId = null;
        this.echart = null;
        this.option = null;
        timess++;
        this.interval = interval + (timess * 5000);
        devid = this.props.devid;
        // console.log(this.props,'this.props')
    }

         // 拿到指定的日期
         handletHeaderDate = (optiondate) => {
            let today = new Date().toLocaleDateString();
            let times = this.state.shiftDate;
            if (optiondate === undefined || optiondate === times) {
                this.setState({
                    optiondate: times,
                }, () => {
                    this.getAlarmInfo()

                   this.loadData()
                })
    
            } else {
                this.setState({ optiondate: optiondate}, () => {
                    this.getAlarmInfo()
                  
                    this.loadData()
                })
            }
        }

    // 实时状态请求数据
    loadData = function () {
        AxiosHttp
            .get('/deviceStatusData/getStatusByDevId/' + devid +'/' + this.state.optiondate)
            .then(this.handle)
            .catch((error) => {
                console.log(error);
            });
    }.bind(this)

    // 实时报警请求数据
    getAlarmInfo = function(){
         AxiosHttp
            .post('/alarminfo/findAlarmInfo',{devid:devid,time:this.state.optiondate})
            .then(res=>{
                // console.log(res,'res')
                if(res.ok===1){
                   findAlarmInfoArr = res.value // 报警信息数组
                }
            }).catch((error)=>{
                console.log(error)
            })
    }.bind(this)

    translate2Second(time) {
        let moment = Moment(time * 1000);//由于存储为1000位数据(32位机器决定)
        let hour = moment.hour();
        let mm = moment.minute();
        let ss = moment.second();
        // if(time>parseInt(Moment().hour(0).minute(0).second(0).format('X'))&&time<parseInt(Moment().hour(24).minute(0).second(0).format('X'))){
        //     console.log(8)
        // }
        if(time>parseInt(Moment(this.state.optiondate).add(1,'d').format('X'))&&time<=(parseInt(Moment(this.state.optiondate).add(1,'d').format('X'))+this.props.shiftSTime)){
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

    handle = function (response) {
        statusDatas = response.value;
        if (!statusDatas || statusDatas.length <= 0){
            statusDatas =[];
            return;
        }

        let firstTime = statusDatas[0].data.start_time;
        let lastTime = statusDatas[statusDatas.length-1].data.end_time;
        let nowTime = parseInt(TimeUtil.geCurUnixTime());// 获取当前的时间
        let selectdayStartUnixTime = parseInt(TimeUtil.getSelectDayStartUnixTime(this.state.optiondate));// 获取指定日期开始时间
        let selectNextDayStartUnixTime = parseInt(TimeUtil.getSelectNextDayStartUnixTime(this.state.optiondate));// 获取指定日期下一天开始时间
        let preDayTime = selectdayStartUnixTime + this.props.shiftSTime;// 指定日期当天白班班别开始时间
        let nextDayTime = selectNextDayStartUnixTime + this.props.shiftSTime;// 指定日期下一天白班班别开始时间

        // 中间件发送异常时候插入记录，补全实时状态的渲染
        if(nowTime > preDayTime && nowTime < nextDayTime){// 当天的时候
            if(nowTime - lastTime >= 180){// 当前班别结束之前
                statusDatas.push({// 插入一条自定义的状态记录
                    data:{
                        start_time:lastTime,
                        end_time: nowTime,
                        status:10
                    },
                    type:'status',
                    dev_id: this.props.devid.toString()
                })
            }

            if(firstTime - preDayTime >= 180){// 当前班别开始的时候
                statusDatas.unshift({
                    data:{
                        start_time:preDayTime,
                        end_time: firstTime,
                        status:10
                    },
                    type:'status',
                    dev_id: this.props.devid.toString()
                })
            }

            firstT = firstTime; // 跨班开始时间
            if(firstT < preDayTime){// 开始记录时间是否小于当前班别开始时间
                statusDatas[0].data.start_time = preDayTime;
            }
        }else{// 昨天以前的时候，或者是未来的时候

            if(lastTime > preDayTime && lastTime < nextDayTime){// 防止未来日期的进入
                if(nextDayTime - lastTime >= 180){// 当前班别结束之前
                    statusDatas.push({
                        data:{
                            start_time:lastTime,
                            end_time: nextDayTime,
                            status:10
                        },
                        type:'status',
                        dev_id: this.props.devid.toString()
                    })
                }
            }

            if(firstTime > preDayTime && firstTime < nextDayTime) {// 防止未来日期的进入
                if(firstTime - preDayTime >= 180){// 当前班别开始的时候
                    statusDatas.unshift({
                        data:{
                            start_time:preDayTime,
                            end_time: firstTime,
                            status:10
                        },
                        type:'status',
                        dev_id: this.props.devid.toString()
                    })
                }
            }

            firstT = firstTime; // 跨班开始时间
            if(firstT < preDayTime){// 开始记录时间是否小于当前班别开始时间
                statusDatas[0].data.start_time = preDayTime;
            }
        }

        indexArr = []

        for(let i = 1; i<=statusDatas.length;i++){
            if(i !==statusDatas.length){
                if( statusDatas[i-1].data.end_time !== statusDatas[i].data.start_time && i < statusDatas.length){
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

        let datas = [], second = null, last,endTime,startTime, now ,lastSecond, cur,flag = false, curSecond, color, lines = [];
          for (let index = 1; index <= statusDatas.length; index++) {

                last = statusDatas[index - 1];
                lastSecond = this.translate2Second(last.data.start_time);
                if(index === statusDatas.length) {
                    let dateEntTime = parseInt(TimeUtil.getDayEndUnixTime(last.data.end_time));//获取指定日期结束时间， 返回long
                    let endTimeDay = nextDayTime; // 获取指定天的
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
                    case Config.IdleV: // 空闲
                        color = idel;
                        break;
                    case Config.RunningV: // 运行中
                        color = running;
                        break;
                    case Config.AlarmV: // 告警
                        color = alarm;
                        break;
                    case Config.WaitingMaterialV: // 待料
                        color = WaitingMaterial;
                        break;
                    case Config.UpAndDownMaterialV: // 上下料
                        color = UpAndDownMaterial;
                        break;
                    case Config.DebugV: // 调试
                        color = debug;
                        break;
                    case Config.UnConnectedV: // 离线
                        color = unconnected;
                        break;
                    case Config.ToolChangerAlarmV: // 换刀报警
                        color = ToolChangerAlarm;
                        break;
                    case Config.FirstPieceAlarmV: // 首件报警
                        color = FirstPieceAlarm;
                        break;
                    case Config.UnknownV: // 中间件程序异常
                        color = Unknown;
                        break;
                }

                datas.push([{
                    xAxis: lastSecond,
                    itemStyle: {
                        color: color,
                        borderColor:color,
                        borderWidth:1
                    }
                }, {
                    xAxis: curSecond,
                    itemStyle: {
                        color: color,
                        borderColor:color,
                        borderWidth:1
                    }
                }]);
                lines.push(curSecond);


            //}

        }
        if (datas.length <= 0)
            return;
        this.option.series[0].markArea.data = datas;
        this.option.series[1].data = lines;
        this.echart.setOption(this.option);
    }.bind(this);


    createOption() {
       
        var baseTop = 10;
        var gridHeight = 60;

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
                    return value/60/60>=24?value/60/60-24:value/60/60;
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
                    // console.log(params,'params')
                    if (params.length) {
                         code=null;
                         msg= null;
                        let startTime;
                        let time = params[0];
                        if (!time || !statusDatas)return;
                        let dataIndex = time.dataIndex;
                        if(!statusDatas.length)return;
                        dataIndex = dataIndex>statusDatas.length-1?statusDatas.length-1:dataIndex;
                        if(dataIndex==0){
                             startTime = firstT;
                         }else{
                            startTime = statusDatas[dataIndex].data.start_time;
                         }
                        let endTime =  statusDatas[dataIndex].data.end_time;
                            findAlarmInfoArr.forEach((val,index)=>{
                                if(startTime<=val.time&&endTime>val.time){
                                     code = val.data.alarm_code 
                                     msg = val.data.alarm_msg
                                }else{
                                   
                                }
                            })

                        var style =  'color: #ffffff';

                        var red = code&&msg?'color: ' + '#FF0000':'color:'+'rgba(0,0,0,0)';
                        return '<span style="' + style + '">' 
                        + '开始时间：</span><span style="' 
                        + style + '">' + TimeUtil.format(startTime, 'HH:mm:ss') + '</span>'+'<br/>'
                        +'<span style="' + style + '">' 
                        + '结束时间：</span><span style="' 
                        + style + '">' + TimeUtil.format(endTime, 'HH:mm:ss') + '</span>'+'<br/>'
                       
                            +'<span style="' + red + '">' 
                            + '报警码：</span><span style="' 
                            // + style + '">' + code==null?'':code + '</span>'+'<br/>'
                            + red + '">' + code + '</span>'+'<br/>'
                            +'<span style="' + red + '">' 
                            + '报警信息：</span><span style="' 
                            + red + '">' + msg + '</span>'+'<br/>'
                            // + style + '">' + msg==null?'':msg + '</span>'+'<br/>'
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
                    axisLine: { show: true },
                    
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
                    name: '状态',
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
/*            dataZoom: [
                // {
                //     type: 'inside',
                //     xAxisIndex: [0, 1, 2],
                //     start: 0,
                //     end: 100,
                //     left:30,
                //     right:38
                // },
                {
                    show: true,
                    xAxisIndex: [0, 1, 2],
                    type: 'slider',
                    bottom: 10,
                    start: 50,
                    end: 100,
                    //zoomLock: true,
                    realtime: true,
                    left:30,
                    right:38,
                    handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '105%'
                }
            ],*/
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

   async getShiftData(){
     await AxiosHttp.post('/shift/findAll').then(res=>{
            if(res.ok===1){
                    xMin=res.value[0].begin_time*60*60;
                    xMax=(res.value[0].end_time+24)*60*60;
                    this.setState({
                        shift_sTime : res.value[0].begin_time*60*60

                    })
            }
    })
    this.createOption();
    }

    componentWillMount() {
        this.createOption();

    }

    // shouldComponentUpdate() {
    //     echart.setOption(option);
    //     return true;
    // }

    componentDidMount() {

        this.getShiftData()
        this.echart = echarts.init(document.getElementById(this.rendToId));
        // this.loadData();
        // this.getAlarmInfo();
        this.handletHeaderDate();
        this.timerStatus = setInterval(this.loadData, this.interval);
        this.timerAlarm = setInterval(this.getAlarmInfo, this.interval);
        this.echart.setOption(this.option);
        this.createOption();
    }

    componentWillUnmount() {
        clearInterval(this.timerStatus);
        clearInterval(this.timerAlarm);
    }

    render() {
        let time = TimeUtil.geCurUnixTime();
        this.rendToId =  'day_status_'+time+'_'+this.props.devid;
        return (
            <div id={this.rendToId} className='status-canvas'>
            </div>
        )
    }

}