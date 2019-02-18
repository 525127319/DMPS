import React, { Component } from "react";
import ShiftUtil from '@/utils/ShiftUtil';
import AxiosHttp from '@/utils/AxiosHttp.js'
import { DatePicker, Form, Button, Field, Moment, Select} from "@icedesign/base"


export default class DeaprmentHeader extends Component {
    constructor(props) {
        super(props);
        this.props.shift = 0;
        this.state = {
            dataSource: []
        }
        this.shift = null;
        this.field = new Field(this);
    }

    onSearch = (ctype) => {
        let val = this.field.getValues();
        let time = val.datepicker;
        let optiondate = Moment(time).format("YYYY-MM-DD");
        if ('export' != ctype)ctype = null;
        this.props.handletHeaderDate(this.shift, optiondate, ctype);
    };

    onExport = (value) => {
        this.onSearch('export');
    };

    normDate(date, dateStr) {
        return dateStr;
    }

    onSelect(value){
        console.log(value,'value');
        this.shift = value;
    }

    componentDidMount(){
        ShiftUtil.getShift().then(res=>{
            let shifts = res.data;
            let values = [{'label': '全部', 'value': ''}];

            if (shifts){
                shifts.forEach(shift=>{
                    values.push({'label': shift.name,'value': shift.id});
                });
            }

            this.setState({
                dataSource: values
            });
        });
    }

    render() {
        const init = this.field.init;

        return (
            //  <div className='con-top main-con-head'>
            //      <p>数据统计 &gt; 根据部门 </p>
            //  </div>
            <div className='main-con-head'>
                <div style={styles.search}>
                    <span className="jt">集团_日沛_T2-3F_WestPoint_WF_夹位CNC4_CELL1</span>
                    <DatePicker
                        format="YYYY-MM-DD"
                        {...init("datepicker", {
                            getValueFromEvent: this.normDate
                        })}
                        defaultValue={new Date}
                        style={styles.date}
                    />
                    <Select dataSource={this.state.dataSource} style={{ width: 150 }} onChange={this.onSelect.bind(this)}/>
                    <Button onClick={this.onSearch.bind(this)} style={styles.btn} >查询</Button>
                    {/* <Button onClick={this.onExport.bind(this)} style={styles.btn} >导出</Button> */}
                    {/* <Button onClick={this.onExportCSV.bind(this)} style={styles.btn} >导出CSV</Button> */}
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
    date: {
        marginRight: "40px",
        marginLeft: "40px",
    },
    title:{
        marginRight: "40px",
        lineHeight:'28px',
    }
};