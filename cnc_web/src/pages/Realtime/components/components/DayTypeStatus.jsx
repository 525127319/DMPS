import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Table, Pagination, Moment, Button } from "@icedesign/base";
import AxiosHttp from "../../../../utils/AxiosHttp";
import ShiftUtil from '@/utils/ShiftUtil';

import '../../sass/daytypestatus.scss';

export default class DayTypeStatus extends Component {
    // static displayName = 'DayTypeStatus';
    static defaultProps = {
        //本界面的默认配置，会合并到props里，但这里的属性为只读
        pageSize: 10
    };
    constructor(props) {
        super(props);
        this.param = { pageIndex: 1 }//当前页
        this.state = {
            total: 0,//总条数
            datas: [],
            optiondate:''
        }
    }
    
         // 拿到指定的日期
         handletTypeStatusDate = (optiondate) => {
            let times = ShiftUtil.getShiftDate();
            if (optiondate === undefined || optiondate === "" || optiondate === times) {
                this.setState({
                    optiondate: times,
                }, () => {
                    this.getStatusList()
                })
    
            } else {
                this.setState({ optiondate: optiondate}, () => {
                    this.getStatusList()
                })
            }
        }

    // 请求实时运行类型情况
    getStatusList() {
        let time = null;
        let times = ShiftUtil.getShiftDate();
        if (this.state.optiondate === undefined || this.state.optiondate === "") {
            time = times;
        } else{
            time = this.state.optiondate;
        }
        // console.log(this.props.devid,this.param.pageIndex,time,'this.props.devid')
        AxiosHttp
            .get('/deviceStatusData/getStatusByData/' + this.props.devid + "/" + this.param.pageIndex + '/' + time)
            .then(this.handleResponse)
            .catch((error) => {
                console.log(error);
            });
    }

    handleResponse = (res) => {
        // console.log(res,'res')
        let dayTypeStatusData = res.value.rs;
        this.phaseTime(dayTypeStatusData);
        this.setState({
            total: res.value.total,
        });
    }

    //日状态分页
    handleChange = (pageIndex) => {
        this.param.pageIndex = pageIndex;
        this.getStatusList();
    }

    componentDidMount() {
        this.handletTypeStatusDate();
        this.getStatusList();
    }

    statusType(value) {
        if (value === 1) {
            return <Button className='statusIdle'>空闲</Button>
        } else if (value === 2) {
            return <Button className='statusRun'>运行中</Button>
        } else if (value === 4) {
            return <Button className='statusAlarm '>报警</Button>
        } else if (value === 41) {
            return <Button className='statusToolChangerAlarm'>换刀报警</Button>
        } else if (value === 42) {
            return <Button className='statusFirstPieceAlarm'>首件报警</Button>
        }
        else if (value === 7) {
            return <Button className='statusDebug'>调机中</Button>
        } 
        else if (value === 8) {
            return <Button className='statusUnunited '>离线</Button>
        }else if (value === 11) {
            return <Button className='statusWaitingMaterial '>待料</Button>
        }else if (value === 12) {
            return <Button className='statusUpAndDownMaterial '>上下料</Button>
        }
        // else if (value === 10) {
        //     return <Button className='statusUnknown'>自定义异常</Button>
        // }
    }

    phaseTime = (value) => {
        let data = []
        value.forEach(val => {
            let item = {}
            item.startTime = val.data.start_time; //开始时间

            item.endTime = val.data.end_time; //结束时间

            let endstarttime = (item.endTime * 1000) - (item.startTime * 1000);

            item.status = val.data.status;

            // 计算出小时数
            let leave1 = endstarttime % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
            let hours = Math.floor(leave1 / (3600 * 1000))
            //计算相差分钟数
            let leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
            let minutes = Math.floor(leave2 / (60 * 1000))
            //计算相差秒数
            let leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
            let seconds = Math.round(leave3 / 1000)
            let stage_time = ((hours < 10 ? '0' + hours : hours) + ":" + (minutes < 10 ? '0' + minutes : minutes) + ":" + (seconds < 10 ? '0' + seconds : seconds))
            item.time = stage_time

            data.push(item)

        })
        this.setState({ datas: data })
    }

    render() {
        const formatDatestatus = (value) => {
            return (
                <span>{this.statusType(value)}</span>
            )
        }
        const formatDatestart_time = (value) => {
            return (
                <span>{Moment(value * 1000).format(' HH:mm:ss')}</span>
            )
        }
        const formatDateend_time = (value) => {
            return (
                <span>{Moment(value * 1000).format(' HH:mm:ss')}</span>
            )
        }
        const formatDaphase_time = (value) => {
            return (
                <Button type="primary">{value}</Button>
            )
        }
        //
        return (
            <div>
                <IceContainer>
                    <p>状态类型运行情况</p>
                    <Table dataSource={this.state.datas} maxBodyHeight={100}>
                        <Table.Column title="状态" dataIndex="status" cell={formatDatestatus} style={styles.public} />
                        <Table.Column title="开始时间" dataIndex="startTime" cell={formatDatestart_time} style={styles.public} />
                        <Table.Column title="结束时间" dataIndex="endTime" cell={formatDateend_time} />
                        <Table.Column title=" 阶段时长(h)" dataIndex='time' cell={formatDaphase_time} />
                    </Table>
                    <div className='pagination'>
                        <span className='total'>共 {this.state.total} 条</span>
                        <Pagination
                            size="small"
                            total={this.state.total}
                            pageSize={this.props.pageSize}
                            onChange={this.handleChange}
                        />
                    </div>
                </IceContainer>
            </div>
        )
    }
}
const styles = {

    public: {
        cursor: "auto",
    }
}