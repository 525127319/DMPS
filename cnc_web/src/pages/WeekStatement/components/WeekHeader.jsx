import React, { Component } from "react";
import { Button, Field, Select, DatePicker, moment } from "@icedesign/base"
import ShiftUtil from '@/utils/ShiftUtil';
let date = new Date();
let yeardate = moment(date).format('YYYY');

export default class WeekHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year_no: yeardate,
            week_start: '',
            week_end:'',
            shift: '',
            dataSource: [],
        }
        this.field = new Field(this);
    }

    // 今年的今天的第几周
    getWeekOfYear() {
        var today = new Date();
        var firstDay = new Date(today.getFullYear(), 0, 1);
        var dayOfWeek = firstDay.getDay();
        var spendDay = 1;
        if (dayOfWeek != 0) {
            spendDay = 7 - dayOfWeek + 1;
        }
        firstDay = new Date(today.getFullYear(), 0, 1 + spendDay);
        var d = Math.ceil((today.valueOf() - firstDay.valueOf()) / 86400000);
        var result = Math.ceil(d / 7);
        return result + 1;
    };

    // 日期控件年
    yearChange(val, str) {
        this.year_no = str
    }

    // 开始周
    onSelectWeekStart(value){
        this.setState(
            { week_start: value }
        )
    }
    // 结束周
    onSelectWeekEnd(value) {
        this.setState(
            { week_end: value }
        )
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

    // 查询
    onSearch = (ctype) => {
        let val = this.field.getValues();
        let data = {
            year_no: this.year_no,
            week_start: this.state.week_start,
            week_end:this.state.week_end,
            shift: this.shift,
        }
        this.props.handletHeaderWeekSearch(data, ctype);
    };

    render() {
        const dataSource = [
            { label: '1', value: '1' }, { label: '2', value: '2' },
            { label: '3', value: '3' }, { label: '4', value: '4' },
            { label: '5', value: '5' }, { label: '6', value: '6' },
            { label: '7', value: '7' }, { label: '8', value: '8' },
            { label: '9', value: '9' }, { label: '10', value: '10' },
            { label: '11', value: '11' }, { label: '12', value: '12' },
            { label: '13', value: '13' }, { label: '14', value: '14' },
            { label: '15', value: '15' }, { label: '16', value: '16' },
            { label: '17', value: '17' }, { label: '18', value: '18' },
            { label: '19', value: '19' }, { label: '20', value: '20' },
            { label: '21', value: '21' }, { label: '22', value: '22' },
            { label: '23', value: '23' }, { label: '24', value: '24' },
            { label: '25', value: '25' }, { label: '26', value: '26' },
            { label: '27', value: '27' }, { label: '28', value: '28' },
            { label: '29', value: '29' }, { label: '30', value: '30' },
            { label: '31', value: '31' }, { label: '32', value: '32' },
            { label: '33', value: '33' }, { label: '34', value: '34' },
            { label: '35', value: '35' }, { label: '36', value: '36' },
            { label: '37', value: '37' }, { label: '38', value: '38' },
            { label: '39', value: '39' }, { label: '40', value: '40' },
            { label: '41', value: '41' }, { label: '42', value: '42' },
            { label: '43', value: '43' }, { label: '44', value: '44' },
            { label: '45', value: '45' }, { label: '46', value: '46' },
            { label: '47', value: '47' }, { label: '48', value: '48' },
            { label: '49', value: '49' }, { label: '50', value: '50' },
            { label: '51', value: '51' }, { label: '51', value: '52' },
            { label: '53', value: '53' }, { label: '54', value: '54' },
        ]

        const { YearPicker } = DatePicker;
        return (
            <div className='main-con-head' style={styles.y}>
                <div style={styles.search}>
                     <span className="jt">集团_日沛_T2-3F_WestPoint_WF_夹位CNC4_CELL1</span>
                    <YearPicker
                        style={{ width: 150 }}
                        style={styles.year}
                        onChange={this.yearChange.bind(this)}
                        defaultValue={this.state.year_no}
                    />
                    <Select
                        showSearch
                        hasClear
                        style={{ width: 150 }}
                        style={styles.week}
                        dataSource={dataSource}
                        onChange={this.onSelectWeekStart.bind(this)}
                        // defaultValue={this.state.week_start}
                        placeholder="起始周"
                    />
                    <Select
                        showSearch
                        hasClear
                        style={{ width: 150 }}
                        style={styles.week}
                        dataSource={dataSource}
                        onChange={this.onSelectWeekEnd.bind(this)}
                        // defaultValue={this.state.week_end}
                        placeholder="结束周"
                    />
                    <Select
                        hasClear
                        style={{ width: 150 }}
                        dataSource={this.state.dataSource}
                        onChange={this.onSelectShift.bind(this)}
                        defaultValue={this.state.shift}

                    />
                    <Button onClick={this.onSearch.bind(this)} style={styles.btn} >查询</Button>
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
    year: {
        marginRight: "40px",
        marginLeft: "40px",
    },
    week: {
        marginRight: "40px",
    },
    y: {
        padding: "20px",
        background: "#fff"
    }
};