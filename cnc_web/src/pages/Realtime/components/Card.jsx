import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import CardItem from './CardItem';
let curRuntimeMap = new Map(),
    curWorktimeMap = new Map(),
    deviceStatusMap = new Map(),
    alarminfoMap = new Map();
let filterArr = [];
let isChange = '';
export default class Card extends PureComponent {
    static displayName = 'Card';
    // React.PropTypes提供的验证器来验证传入数据的有效性 
    static propTypes = {
        dataSource: PropTypes.array,
        curTimeArr: PropTypes.array,
        deviceStatusArr: PropTypes.array,
    };
    static defaultProps = {
        dataSource: [],
        curTimeArr: [],
        deviceStatusArr: []
    };
    constructor(props) {//上層組件傳進來的屬性。
        super(props);
        this.state = {
            filterData:[]
        }
    }
    /**
     * 1. 判断是否有新机器
     * 2. 有新机器，先注消，然后再注册。
     */
    renderContent = () => {
        let {dataSource, curTimeArr, deviceStatusArr, devtype} = this.props;
        if (_.isEmpty(dataSource) || _.isEmpty(deviceStatusArr)) {
            return false;
        }
        let tempdata = [];
         filterArr = [];
        switch (devtype) {
            case "all":
                isChange = "all";
                filterArr = deviceStatusArr;
                break;
            case "run":
                filterArr = deviceStatusArr.filter(item => item.data.status === 2);
                filterArr.forEach((item) => {
                    let rundevice = dataSource.filter(item1 => item1.dev_id === parseInt(item.dev_id))[0];
                    if (rundevice) {
                        tempdata.push(rundevice);
                    }
                });
                isChange = "run";
                break;
            case "idle":
                filterArr = deviceStatusArr.filter(item => item.data.status === 1);
                filterArr.forEach((item) => {
                    let idledevice = dataSource.filter(item1 => item1.dev_id === parseInt(item.dev_id))[0];
                    if (idledevice) {
                        tempdata.push(idledevice);
                    }
                });
                isChange = "idle";
                break;
            case "alarm":
                filterArr = deviceStatusArr.filter(item => item.data.status === 4);
                filterArr.forEach((item) => {
                    let alarmdevice = dataSource.filter(item1 => item1.dev_id === parseInt(item.dev_id))[0];
                    if (alarmdevice) {
                        tempdata.push(alarmdevice);
                    }
                });
                isChange = "alarm";
                break;
            case "disconnect":
                filterArr = deviceStatusArr.filter(item => item.data.status === 8);
                filterArr.forEach((item) => {
                    let disconnectdevice = dataSource.filter(item1 => item1.dev_id === parseInt(item.dev_id))[0];
                    if (disconnectdevice) {
                        tempdata.push(disconnectdevice);
                    }
                });
                isChange = "disconnect";
                break;
            case "debug":
            filterArr = deviceStatusArr.filter(item =>  item.data.status === 7);
            filterArr.forEach((item) => {
                let disconnectdevice = dataSource.filter(item1 => item1.dev_id === parseInt(item.dev_id))[0];
                if (disconnectdevice) {
                    tempdata.push(disconnectdevice);
                }
            });
            isChange = "debug";
            break;
        }
        deviceStatusArr.map((item) => {
            if (!_.isNull(item) && !_.isUndefined(item)) {
                deviceStatusMap.set(parseInt(item.dev_id), item.data.status);
                alarminfoMap.set(parseInt(item.dev_id), {
                    "alarm_code": item.data.alarm_code,
                    "alarm_msg": item.data.alarm_msg
                })
            }
        });
        curTimeArr.map((item) => {
            if (!_.isNull(item) && !_.isUndefined(item)) {
                if (!curRuntimeMap.has(item.dev_id)) {
                    curRuntimeMap.set(parseInt(item.dev_id), item.data.rt);
                    curWorktimeMap.set(parseInt(item.dev_id), item.data.wt);
                }
            }
        });
        return dataSource.map((item, index) => {
            let dev_id = parseInt(item.dev_id);
            let devicestatus = deviceStatusMap.get(dev_id);
            let alarminfo = alarminfoMap.get(dev_id);
            let curwt = ((curWorktimeMap.get(dev_id)) / 3600).toFixed(2);
            isNaN(curwt) ? curwt = 0 : curwt;
            let currt = ((curRuntimeMap.get(dev_id)) / 3600).toFixed(2);
            isNaN(currt) ? currt = 0 : currt;
            return (
                <CardItem
                    item={item}
                    index={index}
                    key={index}
                    alarminfo={alarminfo}
                    devicestatus={devicestatus}
                    curwt={curwt}
                    currt={currt}
                />
            );
        }) ;
    };

    render() {//瀉染
        return (
            this.renderContent()
        );
    }
}