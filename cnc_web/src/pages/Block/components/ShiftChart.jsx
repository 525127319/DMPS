import React, { Component } from "react";
import Chart from './Chart';
import { Feedback } from "@icedesign/base";
const Toast = Feedback.toast;
import CComponent from "@/components/Common/CComponent";
import AxiosHttp from "@/utils/AxiosHttp";
import TimeUtil from "@/utils/TimeUtil";
import './index.css';

/** 
 * block详情
*/
export default class ShiftChart extends CComponent {
    
    constructor(props){
        super(props);
        this.state = {
            flag: true, // 加载
            record: {}
        }
    }

    didMount(){
       this.load();
    }

    willReceiveProps(newProps, oldProps){
        this.props.condition = newProps.condition;
        this.load();
    }

    //加载block详情
    load(){        
        //let localState = this.props.location.state
        let condition = this.props.condition;
        let department = this.props.department;
        let record = this.props.record;//block的统计信息
        let selectedDate = condition.selectedDate;
        let shift = condition.shift;
        let eTime = TimeUtil.getCurDate(TimeUtil.format4);
        let sTime = TimeUtil.addHour(eTime, -2);
       // let pageIndex = this.state.current;
       //block/getBlockWorkStaticByTime/root_2018081411941458_2018081412340056_2018081412636566_20181017154620436_7302/2018-11-21 11:00:00/2018-11-21 13:00:00/1/0/0
        //let url = '/block/getBlockWorkStaticByTime/' + department + '/'+sTime+'/'+eTime +'/1/0/1';
       // http://127.0.0.1:3000/api/block/getBlockWorkStaticByShift/root_2018081411941458_2018081412340056_2018081412636566_20181017154620436_7302/2018-11-20/20180824001/1/0/0

         let url = 'block/getBlockWorkStaticByShift/'+department+'/'+selectedDate+'/'+shift;
        this.setState({
            flag:true
        })
        AxiosHttp.get(url).then((res)=>{
            this.setState({
                flag:false
            })
            if (res.ok){
                if (res.value.length <= 0){
                    Toast.prompt('没有找到任何数据！');
                    return;
                }
                this.setState({
                    res: res.value,
                    record: record
                });
              // this.update(res.value, record);
            }
        });
    }


    render() {
        return (
            <Chart res={this.state.res} record={this.state.record} chartId="shiftChart"></Chart>
        )
    }
}
