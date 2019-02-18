import React, {PureComponent} from 'react';
import {Grid} from '@icedesign/base';
import {status} from '../../../utils/Config';
import DeviceinfoUtil from '@/utils/DeviceinfoUtil';
import {hashHistory} from 'react-router';
import iconAlarm from '../../../../public/images/alarm.png';
import iconDisconnect from '../../../../public/images/disconnect.png';
import iconWork from '../../../../public/images/work.png';
import iconIdle from '../../../../public/images/idle.png';
import firstPieceAlarm from '../../../../public/images/firstPieceAlarm.png';
import toolChangerAlarm from '../../../../public/images/toolChangerAlarm.png';
import upAndDownMaterial from '../../../../public/images/upAndDownMaterial.png';
import debug from '../../../../public/images/debug.svg';
import '../sass/carditem.scss';

const {Col} = Grid;
export default class CardItem extends PureComponent {
    static displayName = 'CardItem';
    constructor(props) {//上層組件傳進來的屬性。
        super(props);
    }
    render() {//瀉染CT，每天开机时间，开机时长，总开机时长，总开机时间
        let {   item,
                index,
                devicestatus,
                alarminfo,
                curwt,
                currt,
            } = this.props;
        let statusText = status[devicestatus]?status[devicestatus]:'离线';
        this.clickHandler = function(){
          
            hashHistory.push({
                pathname: 'realtime/deviceList/deviceDetail/' + item.dev_id,
                state: {
                    item: item,
                    devicestatus: statusText,
                    path:'index',
                    moduleId: 'deviceBoard'
                }
            })
           
           
        };
        return (
            <Col className="cnc-item" key={index}>
                <div style={{...styles.itemBody}} onClick={this.clickHandler.bind(this)}>
                    {statusText == '运行中' &&
                    <div className="cnc-name working">
                        <img src={iconWork} alt=""/>
                        <p>{statusText}</p>
                    </div>
                    }
                    {statusText == '离线' &&
                    <div className="cnc-name no-connect">
                        <img src={iconDisconnect} alt=""/>
                        <p>{statusText}</p>
                    </div>
                    }
                    {statusText == '报警' &&
                    <div className="cnc-name alarm">
                        <img src={iconAlarm} alt=""/>
                        <p>{statusText}</p>
                    </div>
                    }
                    {statusText == '换刀报警' &&
                    <div className="cnc-name pink">
                        <img src={toolChangerAlarm} alt=""/>
                        <p>{statusText}</p>
                    </div>
                    }
                    {statusText == '首件报警' &&
                    <div className="cnc-name rose">
                        <img src={firstPieceAlarm} alt=""/>
                        <p>{statusText}</p>
                    </div>
                    }
                     {statusText == '待料'  &&
                    <div className="cnc-name rest">
                        <img src={iconIdle} alt=""/>
                        <p>{statusText}</p>
                    </div>
                    }
                    {statusText == '上下料'  &&
                    <div className="cnc-name orange">
                        <img src={upAndDownMaterial} alt=""/>
                        <p>{statusText}</p>
                    </div>
                    }
                     { statusText == '调机中' &&
                    <div className="cnc-name blue">
                        <img src={debug} alt=""/>
                        <p>{statusText}</p>
                    </div>
                    }

                    {/* 报警信息面板 */}
                    {statusText == '报警' &&
                        <div className='error-detial'>
                            <ul className='error-list'>
                                <li className='error-item'>
                                    <span>{alarminfo.alarm_code}</span>
                                    <span>{alarminfo.alarm_msg}</span>
                                </li>
                            </ul>
                        </div>
                    }

                    <div className="itemRow">
                        <div className="item-mess">
                            <p className="item-mess-name">名称</p>
                            <p className="item-mess-val">({DeviceinfoUtil.getNameByDevId(item.dev_id)})</p>

                        </div>
                        <div className="item-mess">
                            <p className="item-mess-name">工作</p>
                            <p className="item-mess-val">{curwt ? curwt : 0}
                                <span>h</span></p>
                        </div>
                        <div className="item-mess">
                            <p className="item-mess-name">开机</p>
                            <p className="item-mess-val">{currt ? currt : 0}
                                <span>h</span></p>
                        </div>
                    </div>

                </div>
            </Col>
        );
    }
}


const styles = {
    columnCard: {
        overflow: 'hidden',
        boxShadow:
            '0px 0px 2px 0px rgba(0, 0, 0, 0.1),0px 2px 2px 0px rgba(0, 0, 0, 0.1)',
        background: '#fff',
        height: '280px',
        marginBottom: '20px',
    },
    itemBody: {
        padding: '10px 20px',
        height: 'auto',
    },
    itemRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemTitle: {
        position: 'relative',
    },
    titleText: {
        margin: 0,
        fontSize: '14px',
    },
    tag: {
        position: 'absolute',
        right: 0,
        top: 0,
        padding: '2px 4px',
        borderRadius: '4px',
        fontSize: '12px',
        background: 'rgba(255, 255, 255, 0.3)',
    },
    itemNum: {
        margin: '16px 0',
        fontSize: '20px',
    },
    total: {
        margin: 0,
        fontSize: '12px',
    },
    desc: {
        margin: 0,
        fontSize: '12px',
    },

};