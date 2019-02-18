import React, { Component } from 'react';
import { hashHistory } from "react-router";
import { Moment, Button } from "@icedesign/base";
import _ from 'lodash';
import { msgType, status, evn } from '@/utils/Config';
import DepartmentUtils from "@/utils/DepartmentUtil";
import BrandUtil from "@/utils/BrandUtil";
import PeopleUtils from "@/utils/PeopleUtil";
import iconWork from '../../../../../public/images/work.png';
import debug from '../../../../../public/images/debug.svg';
import iconAlarm from '../../../../../public/images/alarm.png';
import iconDisconnect from '../../../../../public/images/disconnect.png';
import iconIdle from '../../../../../public/images/idle.png';
import firstPieceAlarm from '../../../../../public/images/firstPieceAlarm.png';
import toolChangerAlarm from '../../../../../public/images/toolChangerAlarm.png';
import upAndDownMaterial from '../../../../../public/images/upAndDownMaterial.png';
import AxiosHttp from "../../../../utils/AxiosHttp";
import '../../sass/daytypestatus.scss';
import DeviceinfoUtils from '../../../../utils/DeviceinfoUtil';

let statusbgStyle = null;
let alarmTextStyle = null;

export default class DeviceBasisInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            ip: "",
            curWorktime: 0,
            curRuntime: 0,
            efficiency: 0,
            programe: "",
            alarmcode: "",
            alarminfo: "",
            location: "",
            department: "",
            responsibility_by: "",
            brand_name: "",
            statusText: "",
            port: null,
            count: 0,
            alarm_count:0
        }
    }

    componentWillMount() {
        this.setState({
            statusText: this.props.devicestatus
        });
    }

    componentWillUnmount() {
        //重写组件的setState方法，直接返回空
        this.setState = (state, callback) => {
            return;
        };
    }

    componentWillReceiveProps(nextProps) {
        let { deviceInfo, deviceMonitorData, devDayStaticdata } = nextProps;
        if (!_.isEmpty(devDayStaticdata)) {
            this.setState({
                count: devDayStaticdata.data.count,
                alarm_count: devDayStaticdata.data.alarm_count,

                curWorktime: ((devDayStaticdata.data.wt) / 3600).toFixed(2),
                curRuntime: ((devDayStaticdata.data.rt) / 3600).toFixed(2),
                efficiency: ((devDayStaticdata.data.efficiency))
            })
            isNaN(this.state.curWorktime) ? this.state.curWorktime = 0 : this.state.curWorktime;
            isNaN(this.state.curRuntime) ? this.state.curRuntime = 0 : this.state.curRuntime;
        }
        if (!_.isEmpty(deviceMonitorData)) {
            this.setState({
                programe: deviceMonitorData.data.prog_name,
                alarmcode: deviceMonitorData.data.alarm_code,
                alarminfo: deviceMonitorData.data.alarm_msg,
                statusText: status[deviceMonitorData.data.status],
            })
        }

        switch (this.state.statusText) {
            case '待料':
                statusbgStyle = { backgroundColor: status.WaitingMaterialC };
                break;
            case '上下料':
                statusbgStyle = { backgroundColor: status.UpAndDownMaterialC };
                break;
            case '运行中':
                statusbgStyle = { backgroundColor: status.RunningC };
                break;
            case '报警':
                statusbgStyle = { backgroundColor: status.AlarmC };
                alarmTextStyle = { color: status.AlarmC };
                break;
            case '换刀报警':
                statusbgStyle = { backgroundColor: status.ToolChangerAlarmC };
                alarmTextStyle = { color: status.ToolChangerAlarmC };
                break;
            case '首件报警':
                statusbgStyle = { backgroundColor: status.FirstPieceAlarmC };
                alarmTextStyle = { color: status.FirstPieceAlarmC };
                break;
            case '离线':
                statusbgStyle = { backgroundColor: status.UnConnecteedC };
                break;
            case '调机中':
                statusbgStyle = { backgroundColor: status.DebugC };
                break;
        }

        let node = DeviceinfoUtils.getDeviceByDevid(deviceInfo.dev_id);
        if (node){
            this.setState({
                location: DepartmentUtils.getLocationById(node.location),
                department: DepartmentUtils.getCompleteDepartmentPath(node.department),
                responsibility_by: PeopleUtils.getPeopleById(node.responsibility_by),
                brand_name: BrandUtil.getBrandLabelById(node.brand_name),
                name: node.name,
                ip: node.conn.ip,
                port: node.conn.port,
            });
        }

    }

    toProUseDetail() {
        hashHistory.push({
            pathname: 'program/programUseDetail'
        });
    }

    render() {
        let {
            statusText,
            responsibility_by,
            department,
            curWorktime,
            curRuntime,
            efficiency,
            brand_name,
            location,
            name,
            ip,
            port,
            programe,
            alarmcode,
            alarminfo,
            count,
            alarm_count
        } = this.state;

        return <div>
            <div className="top-mes" style={styles.infobody}>
                {this.state.statusText == "运行中" && <img src={iconWork} alt="" style={styles.imgstyle} />}
                {this.state.statusText == "离线" && <img src={iconDisconnect} alt="离线" style={styles.imgstyle} />}
                {this.state.statusText == "报警" && <img src={iconAlarm} alt="报警" style={styles.imgstyle} />}
                {this.state.statusText == "换刀报警" && <img src={toolChangerAlarm} alt="换刀报警" style={styles.imgstyle} />}
                {this.state.statusText == "首件报警" && <img src={firstPieceAlarm} alt="首件报警" style={styles.imgstyle} />}
                {this.state.statusText == "待料" && <img src={iconIdle} alt="待料" style={styles.imgstyle} />}
                {this.state.statusText == "上下料" && <img src={upAndDownMaterial} alt="上下料" style={styles.imgstyle} />}
                {this.state.statusText == "调机中" && <img src={debug} alt="调机中" style={styles.imgstyle} />}

                <div className={"mess-bar"}>
                    <div style={statusbgStyle} className={"status"}>
                        <span>状态 </span>
                        <span>{statusText}</span>
                    </div>
                    <ul className="tim-mess">
                        <li>
                            <span>设备名:</span>
                            <span>{name}</span>
                        </li>
                        <li onClick={this.toProUseDetail.bind(this)}>
                            <span>程序名:</span>
                            <span style={styles.program_name}>{programe || ""}</span>
                        </li>
                        {/* <li>
                            <span>负责人:</span>
                            <span>{responsibility_by || ""}</span>
                        </li> */}

                        <li>
                            <span>当天产量:</span>
                            <Button type="primary">
                                {count || 0}
                            </Button>
                        </li>


                    </ul>
                    <ul className="tim-mess">
                        <li>
                            <span>工作:</span>
                            <span>{curWorktime || 0}h</span>
                        </li>
                        <li>
                            <span>开机:</span>
                            <span>{curRuntime || 0}h</span>
                        </li>
                        <li>
                            <span>稼动率:</span>
                            <span>{efficiency || 0}%</span>
                        </li>
                        <li>
                            <span>报警数:</span>
                            <Button className='statusAlarm '>{alarm_count || 0}</Button>
                        </li>
                    </ul>
                    <ul className="tim-mess">
                        <li>
                            <span>ip:</span>
                            <span>{ip}</span>
                        </li>
                        <li>
                            <span> port:</span>
                            <span>{port}</span>
                        </li>
                        {/* <li>
                            <span>品牌名:</span>
                            <span>{brand_name || ""}</span>
                        </li>
                        <li>
                            <span>位置:</span>
                            <span>{location || ""}</span>
                        </li> */}
                        <li>
                            <span>部门:</span>
                            <span>{department || ""}</span>
                        </li>
                    </ul>
                </div>
            </div>

            {statusText == "报警" && <div className='alarm-detial'>
                <p>
                    <span>报警码:</span>
                    <span style={alarmTextStyle}>{alarmcode || ""}</span>
                </p>
                <p>
                    <span>报警描述:</span>
                    <span style={alarmTextStyle}>{alarminfo || ""}</span>
                </p>
            </div>}

        </div>
    }
}
const styles = {
    imgstyle: {
        width: '150px',
        height: '150px'
    },
    infobody: {
        display: 'flex',
    },
    textstyle: {
        display: 'inline-block',
        marginRight: '25px',
    },
    fontstyle: {
        color: "gray",
    },
    program_name: {
        cursor: 'pointer',
        background: '#c9f6f7'
    }
}