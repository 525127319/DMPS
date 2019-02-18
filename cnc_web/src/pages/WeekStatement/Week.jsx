import React, { Component } from "react";
import WeekHeader from './components/WeekHeader'
import WeekTitle from './components/WeekTitle'
import WeekEcharts from './components/WeekEcharts'
import AxiosHttp from '@/utils/AxiosHttp.js'
import { moment, Loading } from "@icedesign/base";
import "./sass/index.scss";

export default class Week extends Component {
    static defaultProps = {
        //本界面的默认配置，会合并到props里，但这里的属性为只读
        pageSize: 10
    };
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    // 拿到指定的起始周和结束周, 班别
    handletHeaderWeekSearch = (data, ctype) => {
        this.setState({
            current: 1,
            dataSource: []
        }, () => { this.getWeekdata() })
        this.state.year_no = data.year_no;
        this.state.week_start = data.week_start;
        this.state.week_end = data.week_end;
        this.state.shift = data.shift;
    }

    render() {
        return (
            <div className='main-container' >
                <WeekHeader
                    handletHeaderWeekSearch={this.handletHeaderWeekSearch}
                />
                <div className='con-body main-con-body  '>
                    {/* 头部数据 */}
                    <WeekTitle />
                    {/* 产出数 */}
                    <WeekEcharts/>
                </div>

            </div>


        )
    }
}