import React, { Component } from "react";
import { Button, Field, Select, DatePicker, moment,Input  } from "@icedesign/base"
import ShiftUtil from '@/utils/ShiftUtil';
export default class WeekHeader extends Component {
    constructor(props){
        super(props)
        this.state = {
            dataSource: [],
        }
    }
    // 下拉框班别
    onSelectShift(value) {
        this.shift = value
    }
    // 请求班别shift
    componentDidMount() {
        ShiftUtil.getShift().then(res => {
            let shifts = res.data;
            let values = [{ 'label': '全部', 'value': '' }];
            if (shifts) {
                shifts.forEach(shift => {
                    values.push({ 'label': shift.name, 'value': shift.id });
                });
            }
            this.setState({
                dataSource: values
            });
        });
    }
    render() {
        return(
             <div className='main-con-head' style={styles.y}>
                <div style={styles.search}>
                    {/* <Input disabled placeholder="disabled" size="medium" /> */}
                    <span className="jt">集团_日沛_T2-3F_WestPoint_WF_夹位CNC4_CELL1</span>
                    <DatePicker onChange={(val, str) => console.log(val, str)}  style={styles.btn}/>
                    <Select
                        hasClear
                        style={{ width: 150 }}
                        dataSource={this.state.dataSource}
                        onChange={this.onSelectShift.bind(this)}
                        defaultValue={this.state.shift}
                        style={styles.btn}
                    />
                    <Button style={styles.btn} >查询</Button>
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
    },
    y: {
        padding: "20px",
        background: "#fff"
    }
};