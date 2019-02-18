import React, { Component } from 'react';
import { Moment } from "@icedesign/base";
import echarts from 'echarts/lib/echarts';
import AxiosHttp from '@/utils/AxiosHttp';
import { status, evn } from '@/utils/Config';
import TimeUtil from '@/utils/TimeUtil';
import _ from 'lodash';

let Config = status;
let idel = Config.IdelC;
let running = Config.RunningC;
let alarm = Config.AlarmC;
let debug = Config.DebugC;
let unconnected = Config.UnConnecteedC;
let unknown = Config.Unknown;
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
        this.state = {
            datas:[],
            timeData:null,
            shift_sTime:28800,
            optiondate:''

        };
        this.rendToId = null;
        this.echart = null;
        this.option = null;
        timess++;
        this.interval = interval + (timess * 5000);
        devid = this.props.devid.toString();
    }

         // 拿到指定的日期
         handletHeaderDate = (optiondate) => {
            let today = new Date().toLocaleDateString();
            let times = Moment(today).format("YYYY-MM-DD")
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
        }else{
            time = hour * 3600 + mm * 60 + ss;//转换为秒
        }
        // return time = hour * 3600 + mm * 60 + ss;//转换为秒
        return time;//转换为秒

    }

    handle = function (response) {
         statusDatas = response.value;
            console.log(statusDatas,'statusDatas')
        if (!statusDatas || statusDatas.length <= 0){
            statusDatas =[]
            return;
        }

        let lastTime = statusDatas[statusDatas.length-1].data.end_time;
        let nowTime = Moment().format('X');
        // 当天的时候
        if(parseInt(Moment().hour(0).minute(0).second(0).format('X'))+this.props.shiftSTime<Moment().format('X') && Moment().format('X')< parseInt(Moment(this.state.optiondate).add(1,'d').format('X'))+this.props.shiftSTime){
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
               var yesDayTime = parseInt(Moment(this.state.optiondate).format('X'))+this.props.shiftSTime;
               firstT = statusDatas[0].data.start_time; // 跨天开始时间
           

            if(parseInt(Moment().hour(0).minute(0).second(0).format('X'))<Moment().format('X') && Moment().format('X')< parseInt(Moment().hour(0).minute(0).second(0).format('X'))+this.props.shiftSTime){
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
                 if((parseInt(Moment(this.state.optiondate).add(1,'d').format('X'))+this.props.shiftSTime)-statusDatas[statusDatas.length-1].data.end_time>=180){
                statusDatas.push({
                    data:{
                      start_time:statusDatas[statusDatas.length-1].data.end_time,
                      end_time: parseInt(Moment(this.state.optiondate).add(1,'d').format('X'))+this.props.shiftSTime,
                      status:10
                    },
                    type:'status',
                    dev_id: this.props.devid.toString()
                })
               }
            }
           
          
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
      
        let datas = [], second = null, last,endTime,startTime, now ,lastSecond, cur,flag = false, curSecond, color, lines = [];
          for (let index = 1; index <= statusDatas.length; index++) {
              
                last = statusDatas[index - 1];
                lastSecond = this.translate2Second(last.data.start_time);
                if(index === statusDatas.length) {
                    let dateEntTime = parseInt(TimeUtil.getDayEndUnixTime(last.data.end_time));//获取指定日期结束时间， 返回long
                    let endTimeDay = parseInt(Moment(this.state.optiondate).add(1,'d').format('X'))+this.props.shiftSTime; // 获取指定天的
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
                    case Config.IdleV:  // 空闲
                        color = idel;
                        break;
                    case Config.RunningV: // 运行
                        color = running;
                        break;
                    case Config.AlarmV: // 报警
                        color = alarm;
                        break;
                    case Config.DebugV: // 调试
                        color = debug;
                        break;
                    case Config.UnConnectedV: // 未连接
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
                        if(statusDatas.length==0)return;
                        dataIndex>statusDatas.length-1?statusDatas.length-1:dataIndex;
                        if(dataIndex==0&&statusDatas[0].data.start_time==TimeUtil.getDayStartUnixTime()){
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