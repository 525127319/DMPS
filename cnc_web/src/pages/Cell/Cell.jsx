import React, { Component } from "react";
import CTable from './components/CTable';
import CHeader from './components/CHeader';
import CComponent from "@/components/Common/CComponent";
import DepartmentUtils from "@/utils/DepartmentUtil";
import TimeUtil from '@/utils/TimeUtil';

const type = 41;
export default class Cell extends CComponent {
    static displayName = "Cell";
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
                    <CTable condition = {this.state.condition}  type={type}/>
                </div>
            </div>
        );
    }

}