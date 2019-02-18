import React, { Component } from "react";
import CTable from './components/CTable';
import CHeader from './components/CHeader';
import CComponent from "@/components/Common/CComponent";
import TimeUtil from '@/utils/TimeUtil';

const type = 4;
export default class AlarmHandler extends CComponent {
    static displayName = "AlarmHandler";
    constructor(props) {
        super(props);
        this.state = {
            condition: {
                selectedDate: TimeUtil.getCurDate(TimeUtil.format3),
            }
        };
    }

    reset(condition){
        this.setState({
            condition: condition
        });
    }

    render() {
        return (
            <div className='main-container'>
                <CHeader reset={this.reset.bind(this)} type={type}/>
                <div className='con-body main-con-body Block-max'>
                    <CTable condition = {this.state.condition} type={type}/>
                </div>
            </div>
        );
    }

}