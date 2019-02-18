import React, { PureComponent } from 'react';
import IceContainer from '@icedesign/container';
import { evn } from '@/utils/Config';
import AxiosHttp from "@/utils/AxiosHttp";
import Title from "@/pages/Status/component/Title";
import DeviceBasisInfo from './DeviceBasisInfo';
import CComponent from '@/components/Common/CComponent';
// import DayStatus from './DayStatus';
import DayStatus from './DayStatus_new';
import Cutters from './Cutters';
import DayEfficiency from './DayEfficiency';  //当天稼动率
import ShiftEfficiency from './ShiftEfficiency';  //班别稼动率
import DayProduct from './DayProduct';
import DayTypeStatus from './DayTypeStatus';  //实时类型状态
import HistoryAlarms from './HistoryAlarms';
import HistoryProgram from './HistoryProgram';
import ShiftUtil from '@/utils/ShiftUtil';
import Class from './Class';
import '../../sass/detail.scss'
let timer = null;
let xMin = 28800, xMax = 115200, moduleId = null;
import { DatePicker, Field, Moment, Button, Icon, Breadcrumb } from "@icedesign/base";

export default class Detail extends CComponent {
    static displayName = 'Detail';
    field = new Field(this);

    constructor(props) {
        super(props);

        // 测试分页
        // this.param = {pageIndex: 2};
        this.moduleId = null;
        let shiftDate = ShiftUtil.getShiftDate();
        this.state = {
            deviceMonitorData: [],
            devDayStaticdata: [],
            devfacilitydata: [],
            name: '',
            Maximumworkinghours: '',
            optiondate: '',
            shiftDate: shiftDate
        }

    }

    handlemonitordata = function (response) {
        if (response.ok) {
            this.setState({
                deviceMonitorData: response.value[0]
            });
        }
    }.bind(this);

    handledaystaticdata = function (response) {
        if (!response) return;
        if (response.value.length <= 0) {
            return
        } else {
            // let timeStamp = new Date(new Date().setHours(8, 0, 0, 0)) / 1000;
            // response.value.forEach((val) => {
            //     if (val.time > timeStamp) {
            //         this.setState({
            //             devDayStaticdata: val
            //         });
            //     }
            // })

            this.setState({
                devDayStaticdata: response.value[0]
            });

            let DayStaticdata = this.state.devDayStaticdata.data.children;

            let _openTimes = [];

            for (let i = 0; i < DayStaticdata.length; i++) {
                let data = DayStaticdata[i];

                data.children.forEach(val => {
                    // console.log(val,'val')
                    let opentime = (val.rt / 60).toFixed(2);
                    // console.log(opentime,'opentime');
                    _openTimes.push(opentime)
                });
            }
            let max = Math.max.apply(null, _openTimes);
            // console.log(max,'max')
            this.setState({
                Maximumworkinghours: max
            })


        }
    }.bind(this);

    invoke() {
        let devid = String(this.props.location.state.item.dev_id);
        // console.log( typeof devid,888888888888)
        // day_stastistic 稼动率/当天运行/开机时间

        let time = null;
        let today = new Date().toLocaleDateString();
        let times = this.state.shiftDate;
        if (this.state.optiondate === undefined || this.state.optiondate === "") {
            time = times;
        } else if (this.state.optiondate !== "") {
            time = this.state.optiondate;
        }

        AxiosHttp
            // .get('/dayStatistic/getDayEfficiency/' + devid)
            .get('/dayStatistic/getShiftEfficiency/' + devid + '/' + time)
            .then(this.handledaystaticdata)
            .catch((error) => {
                console.log(error);
            });

        // device_monitor 负载/程序名/报警码/报警信息
        AxiosHttp
            .post('/devicemonitor/load', { devid: devid })
            .then(this.handlemonitordata)
            .catch((error) => {
                console.log(error);
            });
    }




    //瀉染完後，在後臺整合數據
    didMount() {
        this.getShiftData()
        this.invoke();
        this.handletAppointDate();
        // this.onSearch()
        timer = setInterval(() => {
            this.invoke()
        }, evn.reRender);
    }

    willUnmount() {
        clearInterval(timer);
    }

    normDate(date, dateStr) {
        console.log("normDate:", date, dateStr);
        if (!date) {
            date = new Date();
        }
        return date.getTime();

    }

    onSearch() {
        let val = this.field.getValues();
        let time = val.datepicker;
        let optiondate = Moment(time).format("YYYY-MM-DD");
        this.refs.dayStatus.handletHeaderDate(optiondate);
        this.setState({
            optiondate: optiondate
        }, () => {
            this.handletAppointDate(optiondate);
        })
        this.refs.DayTypeStatus.handletTypeStatusDate(optiondate);
    }


    // 拿到指定的日期
    handletAppointDate = (optiondate) => {
        let today = new Date().toLocaleDateString();
        let times = Moment(today).format("YYYY-MM-DD")
        if (optiondate === undefined || optiondate === times) {
            this.setState({
                optiondate: times,
            }, () => {
                this.invoke()
            })
        } else {
            this.setState({ optiondate: optiondate }, () => {
                this.invoke()
            })
        }
    }

    getShiftData() {
        AxiosHttp.post('/shift/findAll').then(res => {
            if (res.ok === 1) {
                xMin = res.value[0].begin_time * 60 * 60;
                xMax = (res.value[0].end_time + 24) * 60 * 60;
                this.setState({
                    shift_sTime: (res.value[0].begin_time) * 60 * 60

                })
            }
        })
    }


    willMount() {
        const localState = this.props.location.state;
        moduleId = this.moduleId = localState.moduleId;
    }



    /**
     * 切换部门时
     * @param {*} department 
     */
    switchDepartment(department) {
        let path = '#/index';
        if (this.moduleId == 'deviceBoard') {
            path = '/index';
        }  else if (this.moduleId == 'device') {
            path = '/deviceManager/deviceList';
        }  else if (this.moduleId == 'dayStatistic') {
            path = '/statistic/department';
        }  else if (this.moduleId == 'weekStatistic') {
            path = '/statistic/weekstatistic';
        }  else if (this.moduleId == 'monthStatistic') {
            path = '/statistic/monthstatistic';
        }  else if (this.moduleId == 'yearStatistic') {
            path = '/statistic/yearstatistic';
        }  else if (this.moduleId == 'exceptionList') {
            path = '/exception/list';
        }
        super.goto(path);
    }

    crumbs() {
        if (this.moduleId == 'deviceBoard') {
            return (<Breadcrumb separator="/">
                <Breadcrumb.Item link="#/index"  >设备看板</Breadcrumb.Item>
                <Breadcrumb.Item >设备详情</Breadcrumb.Item>
            </Breadcrumb>);
        } else if (this.moduleId == 'device') {
            return (<Breadcrumb separator="/">
                <Breadcrumb.Item  >设备管理</Breadcrumb.Item>
                <Breadcrumb.Item link="#/deviceManager/deviceList"  >设备列表</Breadcrumb.Item>
                <Breadcrumb.Item >设备详情</Breadcrumb.Item>
            </Breadcrumb>);
        } else if (this.moduleId == 'dayStatistic') {
            return (<Breadcrumb separator="/">
                <Breadcrumb.Item >设备统计</Breadcrumb.Item>
                <Breadcrumb.Item link="#/statistic/department"  >日统计</Breadcrumb.Item>
                <Breadcrumb.Item >设备详情</Breadcrumb.Item>
            </Breadcrumb>);
        } else if (this.moduleId == 'weekStatistic') {
            return (<Breadcrumb separator="/">
                <Breadcrumb.Item >设备统计</Breadcrumb.Item>
                <Breadcrumb.Item link="#/statistic/weekstatistic"  >周统计</Breadcrumb.Item>
                <Breadcrumb.Item >设备详情</Breadcrumb.Item>
            </Breadcrumb>);
        } else if (this.moduleId == 'monthStatistic') {
            return (<Breadcrumb separator="/">
                <Breadcrumb.Item >设备统计</Breadcrumb.Item>
                <Breadcrumb.Item link="#/statistic/monthstatistic"  >月统计</Breadcrumb.Item>
                <Breadcrumb.Item >设备详情</Breadcrumb.Item>
            </Breadcrumb>);
        } else if (this.moduleId == 'yearStatistic') {
            return (<Breadcrumb separator="/">
                <Breadcrumb.Item >设备统计</Breadcrumb.Item>
                <Breadcrumb.Item link="#/statistic/yearstatistic"  >年统计</Breadcrumb.Item>
                <Breadcrumb.Item >设备详情</Breadcrumb.Item>
            </Breadcrumb>);
        } else if (this.moduleId == 'exceptionList') {
            return (<Breadcrumb separator="/">
                <Breadcrumb.Item >报警统计</Breadcrumb.Item>
                <Breadcrumb.Item link="#/exception/list"  >报警详情</Breadcrumb.Item>
                <Breadcrumb.Item >设备详情</Breadcrumb.Item>
            </Breadcrumb>);
        }
    }





    render() {

        let deviceInfo = this.props.location.state.item;
        let devicestatus = this.props.location.state.devicestatus;
        const init = this.field.init;
        return (

            <div className='main-container'>
                <IceContainer className='main-con-head'>

                    {/* 返回设备列表 */}
                    {/* <Button type="primary" onClick={() => {
                        window.history.back();
                    }}>
                        <Icon type="arrow-left" />
                        <span>返回</span>
                    </Button> */}


                    {/* 面包屑↓ */}
                    <div className="head-title">
                        <Breadcrumb separator="/">{this.crumbs()}</Breadcrumb>

                    </div>
                    {/* 面包屑end */}
                    <div className="y-flex y-md">
                        <DatePicker style={{ margin: '0 50px 0 0' }}
                            onChange={(val, str) => console.log(val, str)}
                            format="YYYY-MM-DD "
                            {...init("datepicker", {
                                getValueFromEvent: this.normDate
                            })}
                            // defaultValue={new Date}
                            defaultValue={this.state.shiftDate}
                        />
                        <Button
                            onClick={this.onSearch.bind(this)}
                        >查询</Button>
                    </div>
                </IceContainer>

                <IceContainer className='abc main-con-body' style={styles.detailBody}>
                    <DeviceBasisInfo
                        devid={deviceInfo.dev_id}
                        deviceInfo={deviceInfo}
                        devicestatus={devicestatus}
                        deviceMonitorData={this.state.deviceMonitorData}
                        devDayStaticdata={this.state.devDayStaticdata}
                    />

                    <div className="canvas-group">
                        <Title />
                        <DayStatus devid={deviceInfo.dev_id} ref='dayStatus' shiftSTime={this.state.shift_sTime} xMin={xMin} xMax={xMax} />
                        {/* 当天稼动率 */}
                        {/* <DayEfficiency
                        deviceInfo={deviceInfo}
                            dayStatistic={this.state.devDayStaticdata}
                        /> */}
                        {/* 班别稼动率 */}

                        <ShiftEfficiency
                            deviceInfo={deviceInfo}
                            Maximumworkinghour={this.state.Maximumworkinghours}
                            // dayStatistic={this.state.devfacilitydata}
                            dayStatistic={this.state.devDayStaticdata}
                        />
                    </div>

                    <div className="tables">
                        <DayTypeStatus devid={deviceInfo.dev_id} ref='DayTypeStatus' />
                        <Cutters dev_id={this.props.location.state.item.dev_id} />
                        <DayProduct devID={deviceInfo.dev_id} />
                        <HistoryAlarms devID={deviceInfo.dev_id} />
                        <HistoryProgram devID={deviceInfo.dev_id} />
                        {/* <Class/> */}
                    </div>

                </IceContainer>
            </div>
        )
    }
}
const styles = {
    detailBody: {
        backgroundColor: '#f5f6f7'
    }
}