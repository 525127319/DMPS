import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import Status from './DeviceBasisInfo';
import { Button, Icon, Table, Pagination, Moment, Dialog, Loading } from "@icedesign/base";
import { evn } from '../../../../utils/Config';
import AxiosHttp from "../../../../utils/AxiosHttp";
import DayProductDetail from './DayProductDetail';
import '../../sass/cutters.scss';
let timer = null;
let cutter_no = null;
let status = null;
export default class Cutters extends Component {
    static defaultProps = {
        //本界面的默认配置，会合并到props里，但这里的属性为只读
        pageSize: 11
    };
    constructor(props) {
        super(props);
        this.param = { pageIndex: 1 }//当前页

        this.state = {
            deviceMonitorData: [],
            cutters: [], // 刀具数组
            cuttersData: [], // 刀具数组用于表格
            total: 0,//总条数,
            isShowLoading: '',
            payload: null
        }
    }

    //发请求获取刀具量数据
    // getMonitorData() {
    //     AxiosHttp.get("/devicemonitor/getMonitorData/" + this.props.dev_id + "/" + this.param.pageIndex)
    //         .then(this.handleResponse)
    //         .catch(error => {
    //             console.log(error);
    //         });
    // }

    // handleResponse = (res) => {
    //     // console.log(res.value.rs[0].data.payload, 'res1111111111')
    //     this.setState({
    //         total: res.value.rs[0].data.cutters.length
    //     });
    //     this.setState({
    //         payload: res.value.rs[0].data.payload
    //     })
        
    // }

    //发请求获取负载
    // devicepayloaddata() {
    //     AxiosHttp.get("/devicepayloaddata/getdevicepayloaddata/" + this.props.dev_id)
    //         .then(this.handlepayloaddata)
    //         .catch(error => {
    //             console.log(error);
    //         });
    // }

    // handlepayloaddata = (response) => {
    //     if (response.ok == 1 && response.value.length > 0) {
    //         this.setState({
    //             payload:response.value[response.value.length - 1].data
    //         })
    //     }
    // }

    handleCutters = function (deviceMonitorData) {

        let _payload = deviceMonitorData.data.payload;
        this.setState({
            payload: _payload
        });
        // 当前正在使用的刀号
        cutter_no = deviceMonitorData.data.cutter_no;
        if (cutter_no == 0) {
            this.state.payload = null;
        }
        this.setState(
            {
                cutters: deviceMonitorData.data.cutters,
                total: deviceMonitorData.data.cutters.length
            }
        );

        switch (this.param.pageIndex) {
            case 1:
                this.setState(
                    {
                        cuttersData: this.state.cutters.slice(0, 11)
                    }
                );
                break;
            case 2:
                this.setState(
                    {
                        cuttersData: this.state.cutters.slice(11, 22)
                    }
                );
                break;
            case 3:
                this.setState(
                    {
                        cuttersData: this.state.cutters.slice(22, 33)
                    }
                );
        }


    }.bind(this)

    handlemonitordata = function (response) {
        if (response.ok) {
            if(!response.value[0] || !response.value[0].data) {
                return
            }
            this.setState({
                deviceMonitorData: response.value[0]
            });
            
            this.handleCutters(this.state.deviceMonitorData);

            status = response.value[0].data.status;
        }

    }.bind(this);

    invoke() {
        let devid = this.props.dev_id;
        // device_monitor 这里取得道具数据
        AxiosHttp
            .post('/devicemonitor/load', { devid: devid })
            .then(this.handlemonitordata)
            .catch((error) => {
                console.log(error);
            });
        // if(status === 2){
        //     this.devicepayloaddata()
        // }
    }
    // componentWillMount() {
    //         this.devicepayloaddata();
    // }

    //瀉染完後，在後臺整合數據
    componentDidMount() {
        this.invoke();
        // this.getMonitorData();

        timer = setInterval(() => {
            this.invoke()

        }, evn.reRender);
    }

    componentWillUnmount() {
        clearInterval(timer);
    }

    //刀具分页
    handleChange = (pageIndex) => {
        this.param.pageIndex = pageIndex;
        this.invoke()
    }

    renderOperator = (value, index, record) => {
        return (
            <div>
                <Button type="primary">编辑</Button>

            </div>
        );
    };

    render() {
        const spentTime = (value) => {
            return (
                <span>{(value / 3600).toFixed(2)}</span>
            )
        }
        const Cutters_status = (value) => {
            return (
                <Button className='custom'>正常</Button>
            )
        }

        //  cell={life_time}  预估寿命
        const life_time = (value) => {
            return (
                <div>10000</div>
            )
        }

        const tipLoader1 = (
            <div className="load-container load1">
                <div className="loader">loading...</div>
            </div>
        );

        return (
            <div>
                <IceContainer>
                    <p>
                        当前使用刀号：<Button type="primary">{cutter_no}</Button>
                        <span style={{ marginLeft: 20 }}>主轴负载：<Button type="primary">{this.state.payload}</Button></span>
                    </p>
                    <Table
                        dataSource={this.state.cuttersData}
                        maxBodyHeight={100}
                        className='Cutters'
                    // isLoading = {this.state.cuttersData.length>0?false:true}
                    >
                        <Table.Column title="状态" dataIndex="" cell={Cutters_status} style={styles.public} />
                        <Table.Column title="刀具号" dataIndex="no" style={styles.public} />
                        {/* <Table.Column title="使用时间(小时)" dataIndex="spent" cell={spentTime} /> */}
                        <Table.Column title="使用次数" dataIndex="counter" />
                        <Table.Column title="预估寿命" dataIndex="life" />
                        {/* <Table.Column title="操作"  cell={this.renderOperator}/> */}
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