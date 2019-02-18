import React, { Component } from "react";
// import YearHeader from './components/YearHeader'
import StatisticHeader from '@/components/StatisticHeader/PublicHeader.jsx'
import YearTable from './components/YearTable'
import AxiosHttp from '@/utils/AxiosHttp.js'
import IceContainer from '@icedesign/container';
import { moment , Loading} from "@icedesign/base";

import DepartmentUtil from '@/utils/DepartmentUtil.js';
import Store from '@/redux/Store';
let departmentId = 'root';
let listener = null, isLestener = false;
if (!isLestener)
    listener = Store.subscribe(DepartmentUtil.changeDepartment);

export default class Year extends Component {
    static defaultProps = {
        //本界面的默认配置，会合并到props里，但这里的属性为只读
        pageSize: 10
    };
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],//渲染数据
            current: 1,  //分页
            total: 0,    //数据总条数
            year_no: '', //指定年
            shift: '',   //查询班别
            yearpartmentdata: {}, //部门年的数据
            flag: true,  //加载
        };
        departmentId = DepartmentUtil.changeDepartment();
    }

    //获取到部门信息 
    getDepartment = (val) => {
        this.setState({
            department: val,
        }, () => {
            this.getYeardata()
        })
    }

    //瀉染完後，在後臺整合數據
    componentDidMount() {
        this.getDepartment(departmentId);
        listener = Store.subscribe(this.changeDepartment.bind(this));
    }

    changeDepartment = () => {
        let state = Store.getState();
        departmentId = state.departmentId
        this.setState({ current: 1, dataSource: [] }, () => {
            this.getDepartment(departmentId);
        })
    }

    componentWillUnmount() {
        if (listener) {
            listener()
        }
    }

    // 年数据
    getYeardata = () => {
        let date = new Date();
        let yeardate = moment(date).format('YYYY');
        this.setState({
            flag: true
        })
        // 请求设备年列表统计的数据
        AxiosHttp.post('/yearStatistic/yearlist',
            {
                current: this.state.current,
                year_no: !this.state.year_no ? yeardate : this.state.year_no,
                shift: this.state.shift,
                department: this.state.department,
            })
            .then(this.handleyeardevices)
            .catch(error => {
                console.log(error);
            });

        // 请求部门年统计的数据
        AxiosHttp.post('/departmentyearstatistic/yeardepartment',
            {
                year_no: !this.state.year_no ? yeardate : this.state.year_no,
                department: this.state.department,
            })
            .then(this.handleyeardepartment)
            .catch(error => {
                console.log(error);
            });
    }

    // 设备年统计
    handleyeardevices = (response) => {
        let filterData =[];
        response.value.monthList.forEach(ele =>{
            delete ele.id;
            filterData.push(ele);
        })
        this.setState({
            dataSource:filterData,
            total: response.value.total,
            flag: false
        })
    }

    // 部门年统计
    handleyeardepartment = (response) => {
        if (response.value.length > 0) {
            this.setState({
                yearpartmentdata: response.value[0].data,
              
            })
        } else {
            this.setState({
                yearpartmentdata: {},
            })
        }
        if(response.ok == 0){
            this.setState({
                flag: false
            })
        }
    }

    //分页
    handleChange = (current) => {
        this.setState({
            current: current, 
        }, () => {
            this.getYeardata()
        });
    }

    // 拿到指定的年和周
    handletHeaderDate = (shift, optiondate, ctype) => {
     if (optiondate  || shift) {
        this.setState({
            // current: 1,
            year_no:optiondate,
            shift:shift
        },()=>{this.getYeardata()})
     }
      
        // this.state.year_no = optiondate;
        // this.state.shift = shift;
    }

    render() {
        return (
            <div className='main-container' >
               
                    <StatisticHeader
                        handletHeaderDate={this.handletHeaderDate}
                        department={departmentId}
                        type ={3}
                    />
                     <div className='con-body main-con-body  '>
                     <Loading
                        shape="fusion-reactor"
                        color="#ccc"
                        visible={this.state.flag}
                    >
                    <YearTable
                        yearpartmentdata={this.state.yearpartmentdata}
                        shift={this.state.shift}
                        dataSource={this.state.dataSource}
                        handleChange={(current) => {
                            this.handleChange(current)
                        }}
                        current={this.state.current}
                        total={this.state.total}
                    />
                    </Loading>
                </div>

            </div>
        )
    }
}