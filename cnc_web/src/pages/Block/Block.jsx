import React, { Component } from "react";
import CTable from './components/CTable';
import CHeader from './components/CHeader';
import CComponent from "@/components/Common/CComponent";
import DepartmentUtils from "@/utils/DepartmentUtil";
import TimeUtil from '@/utils/TimeUtil';


export default class Block extends CComponent {
    static displayName = "Block";
    constructor(props) {
        super(props);
        this.state = {
            condition: {
                selectedDate: TimeUtil.getCurDate(TimeUtil.format3),
                shift: null
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
                <CHeader reset={this.reset.bind(this)}/>
                <div className='con-body main-con-body Block-max'>
                    <CTable condition = {this.state.condition}/>
                </div>
            </div>
        );
    }

}