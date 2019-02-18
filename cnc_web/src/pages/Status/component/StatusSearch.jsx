import React, { Component } from 'react'
import IceContainer from '@icedesign/container';
import { Button, Icon, Select, Form, Field, Search, DatePicker, Breadcrumb } from "@icedesign/base";
import DeviceinfoUtil from "@/utils/DeviceinfoUtil";
import Devicename from "@/components/Devicename/Devicename";
import ShiftUtil from '@/utils/ShiftUtil';
const FormItem = Form.Item;

export default class StatusSearch extends Component {
    constructor(props) {
        super(props)
        let shiftDate = ShiftUtil.getShiftDate();
        this.state = {
            shiftDate: shiftDate
        }
        this.field = new Field(this);
    }

    onSearch = (value) => {
        let val = this.field.getValues()
        // let myDevicename = this.refs.myDevicename;
        let device = null;
        // if (myDevicename){
        //     let deviceid = myDevicename.getValue();
        //     device = DeviceinfoUtil.getDeviceByDevid(deviceid);
        // }

        this.props.search(device, val);
    };
    normDate(date, dateStr) {
        return dateStr;
    }

    render() {
        const init = this.field.init;
        return (
            <div className='main-con-head'>

                {/* 面包屑↓ */}
                <div className="head-title">
                    <Breadcrumb separator="/">
                        <Breadcrumb.Item >设备统计</Breadcrumb.Item>
                        <Breadcrumb.Item >状态统计</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <div style={styles.search}>
                    {/* <Devicename ref="myDevicename"/> */}
                    <DatePicker
                        format="YYYY-MM-DD"
                        {...init("datepicker", {
                            getValueFromEvent: this.normDate
                        })}
                        // defaultValue={new Date} 
                        defaultValue={this.state.shiftDate}
                    />
                    <Button onClick={this.onSearch} style={styles.btn} >查询</Button>
                </div>

            </div>
        )
    }
}
const styles = {
    search: {
        display: "flex",
    },
    btn: {
        marginLeft: "40px",

    }
};