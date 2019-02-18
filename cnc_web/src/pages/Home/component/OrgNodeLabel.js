import React from "react";
import DeviceMonitorUtil from '@/utils/DeviceMonitorUtil';
import DepartmentStatisticUtil from '@/utils/DepartmentStatisticUtil';

import {status} from '@/utils/Config';
import './CenteredTree.css';
let Config = status;
let idel = Config.IdelC;
let running = Config.RunningC;
let alarm = Config.AlarmC;
let debug = Config.DebugC;
let unconnected = Config.UnConnecteedC;

export default class OrgNodeLabel extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            deviceCount: 0,
            idle: 0,
            runnin: 0,
            alarm: 0,
            debug: 0,
            unConnecteed: 0,
            unknown: 0,
            wt: 0,//工作时长
            rt: 0,//开机时长
            efficiency: 0,//效率
            alarm_count: 0,//报警总数
            alarm_duration: 0,//报警时长
            count:0,//有效产量
            invalid_count:0//无效产量
        };
    }

    parse(v){
        return v?v:0;
    }

    componentDidMount() {
        const { nodeData } = this.props
        let d = nodeData.value.split('_');
        this.value = d[d.length -1];
        let fn = function(map, departmentStaticMap){
            if (!map || map.size <= 0)return;
            let _status = map.get(this.value);
            if (!_status)return;
            let IdleV = this.parse(_status[''+status.IdleV]);
            let RunningV = this.parse(_status[''+status.RunningV]);
            let AlarmV = this.parse(_status[''+status.AlarmV]);
            let DebugV = this.parse(_status[''+status.DebugV]);
            let UnConnectedV = this.parse(_status[''+status.UnConnectedV]);
            let UnknownV = this.parse(_status[''+status.UnknownV]);
            let deviceCount = IdleV+RunningV+AlarmV+DebugV+UnConnectedV+UnknownV;
            let statisc = null, wt = 0, rt = 0, efficiency = 0, alarm_count = 0, alarm_duration = 0, count = 0, invalid_count=0;
            statisc = departmentStaticMap.get(nodeData.value);
            if (statisc){
                wt = DepartmentStatisticUtil.parseTime(statisc.data.wt);
                rt = DepartmentStatisticUtil.parseTime(statisc.data.rt);
                efficiency = statisc.data.efficiency||0;
                alarm_count = statisc.data.alarm_count||0;
                alarm_duration = DepartmentStatisticUtil.parseTime(statisc.data.alarm_duration);
                count = statisc.data.count||0;
                invalid_count = statisc.data.invalid_count||0
            }
            

            this.setState({
                idle: IdleV,
                runnin: RunningV,
                alarm: AlarmV,
                debug: DebugV,
                unConnecteed: UnConnectedV,
                unknown: UnknownV,
                deviceCount: deviceCount,
                wt: wt,//工作时长
                rt: rt,//开机时长
                efficiency: efficiency,//效率
                alarm_count: alarm_count,//报警总数
                alarm_duration: alarm_duration,//报警时长
                count:count,//有效产量
                invalid_count:invalid_count//无效产量
            });
        }.bind(this);
        this.timer = setInterval(async function () {
            let rs = await DeviceMonitorUtil.load();
            let rs1 = DepartmentStatisticUtil.load();
            fn(rs, rs1);
        }.bind(this), 5000);
    }

    componentWillUnmount(){
        clearInterval(this.timer);
    }

    render() {
        var style = {
            float: "left"
        };
        const { className, nodeData } = this.props
        return (
            <div className={className}>
                {/* <img src="data:image/png;base64,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" alt="" style="width: 80px; height: 80px;" alt="test" width="40" style={style} ></img> */}
                <p className='roundedRectangle-t'>
                    {/* ↓↓ 1层级条用one，2层级条用two，3层级调用three，4层级调用four */}
                    <span className='one'>{nodeData.name}</span>
                    <div className='white'>
                        稼动：
                        <span >{this.state.efficiency}%</span>
                    </div>
                </p>
              
                <ul className="data-f data-file">
                    {/* <li>
                        <span className='b'>{this.state.deviceCount}</span>
                    </li> */}
                    
                     状态：
                       
                    <li>
                        <span className='g'>{this.state.runnin}</span>
                    </li>
                    <li>
                        <span className='j'>{this.state.idle}</span>
                    </li>
                    <li>
                        <span className='blue'>{this.state.debug}</span>
                    </li>
                    <li>
                        <span className='r'>{this.state.alarm}</span>
                    </li>
                    <li>
                        <span className='gray'>{this.state.unConnecteed}</span>
                    </li>
                 </ul>
                 <ul className='data-t'>
                    报警：
                    <li>
                        <span >{this.state.alarm_count}</span > 次,共<span>{this.state.alarm_duration}</span> 小时
                    </li>
                  
                </ul>
                <ul className='data-t'>
                    异常：
                    <li>
                        <span >{this.state.invalid_count} </span > 次<span >{this.state.count + this.state.invalid_count}次</span>
                    </li>
                </ul>
                {/* <ul className='data-t'>
                    <li>
                        <span className='square'>{this.state.alarm_count}</span>
                    </li>
                    <li>
                        <span className='triangle'>{this.state.alarm_duration}</span>
                    </li>
                    <li>
                        <span className='valid'>{this.state.alarm}</span>
                    </li>
                    <li >
                        <span className='abnormal'>{this.state.invalid_count}</span>
                    </li>
                </ul> */}
                {/* <p>
                    总数:<font color="green">{this.state.deviceCount}</font>
                    运行:<font color="green">{this.state.runnin}</font>
                    空闲:<font color="yellow">{this.state.idle}</font>
                    调试:<font color="blue">{this.state.debug}</font>
                    报警:<font color="red">{this.state.alarm}</font>
                    未连接:<font color="grey">{this.state.unConnecteed}</font>
                    未知:<font color="grey">{this.state.unknown}</font>
                </p> */}
                {/* <p>
                    工作时长(h):<font color="green">{this.state.wt}</font>
                    开机时长(h):<font color="green">{this.state.rt} </font>
                    嫁动率(%):<font color="green">{this.state.efficiency}</font>
                    报警总数:<font color="red">{this.state.alarm_count}</font>
                    报警总时长(h):<font color="red">{this.state.alarm_duration}</font>
                    有效产量:<font color="red">{this.state.count}</font>
                    异常产量:<font color="red">{this.state.invalid_count}</font>
                </p> */}
            </div>
        )
    }
}

/*
{nodeData._children && 
            <button>{   ._collapsed ? 'Expand' : 'Collapse'}</button>
          }
*/