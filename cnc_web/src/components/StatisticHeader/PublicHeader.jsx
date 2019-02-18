import React, { Component } from "react";
import ShiftUtil from '@/utils/ShiftUtil';
import AxiosHttp from '@/utils/AxiosHttp.js';
import { DatePicker, Form, Button, Field, Moment, Select, Breadcrumb} from "@icedesign/base";
import DepartmentUtil from '@/utils/DepartmentUtil.js';
import TimeUtil from '@/utils/TimeUtil';
import { Feedback,Loading } from "@icedesign/base";
const Toast = Feedback.toast;
const { MonthPicker, YearPicker, RangePicker } = DatePicker;

export default class DeaprmentHeader extends Component {
    constructor(props) {
        super(props);
        this.props.shift = 0;
        let shiftDate = ShiftUtil.getShiftDate();
        this.state = {
            dataSource: [],
            shift: '',
            show:false,
            optiondate:"",
            ctype:"",
            week_no: this.getWeekOfYear(),
            name :'',
        }
        this.shift = null;
        this.field = new Field(this);
        this.type =this.props.type;
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

    onSearch = (ctype) => {
        let val = this.field.getValues();
        let time = val.datepicker;
        let optiondate;
        if(this.type === 3 || this.type === 4){
            optiondate =TimeUtil.formatDateByFormat(time,"YYYY");
        }else{
            optiondate =TimeUtil.formatDateByFormat(time,"YYYY-MM-DD") 
        }
        this.setState({
            optiondate:optiondate
        })
        this.props.handletHeaderDate(this.shift, optiondate,this.state.week_no);
    };



    onExport = (value) => {
        // this.onSearch('export');
        this.setState({
            show: true,
        })
        let params
        if(this.type === 4){
            params={ value: this.props.department , stime:this.state.optiondate, shift:this.shift,week:this.state.week_no,ctype:'export'}
        }else {
            params={ value: this.props.department , stime:this.state.optiondate, shift:this.shift,ctype:'export'}
        }
        
        AxiosHttp.exportExcel('/departmentstatuses/getdepartmentstatuses',params,DepartmentUtil.getDepartmentById(this.props.department)+'_'+this.state.name+'_'+this.state.optiondate)
        .then((res)=>{
            if (res == 0) {
                Toast.success('没有可导出数据！');
            } else {
                Toast.success('下载成功！');
                this.setState({
                    show: false,
                })
            }
        }).catch(error => {
            console.log(error)
        })
    };

    normDate(date, dateStr) {
        return dateStr;
    }
   

    onSelect(value){
        console.log(value,'value');
        this.shift = value;
    }

     // 下拉框周
     onSelectWeek(value) {
        this.setState(
            { week_no: value }
        )
    }

    componentWillMount(){
        if(this.type === 1 && this.state.optiondate == ''){
            this.setState({
                name :'日统计',
                optiondate:ShiftUtil.getShiftDate() 
            })
        }else if(this.type === 2){
            this.setState({
                name :'月统计',
                optiondate:TimeUtil.getCurDate("YYYY-MM")
            })
        }else if(this.type === 3){
            
            this.setState({
                name :'年统计',
                optiondate:TimeUtil.getCurDate("YYYY")
            })
        }else if(this.type === 4){
            this.setState({
                name :'周统计',
                optiondate:TimeUtil.getCurDate("YYYY")
            })
        }
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

    getDateType(){
        const init = this.field.init;
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
        if(this.type ===1){
            return(
                <DatePicker
                    format="YYYY-MM-DD"
                    {...init("datepicker", {
                        getValueFromEvent: this.normDate
                    })}
                    defaultValue={new Date}
                    style={styles.date}
                /> 
            )
        }else if(this.type === 2){
            return(
                <MonthPicker
                    format="YYYY-MM"
                    {...init("datepicker", {
                        getValueFromEvent: this.normDate
                    })}
                    defaultValue={new Date}
                    style={styles.date}
                /> 
            )
        }else if(this.type === 3){
            return(
                <YearPicker
                    format="YYYY"
                    {...init("datepicker", {
                        getValueFromEvent: this.normDate
                    })}
                    defaultValue={new Date}
                    style={styles.date}
                />
            )  
        }else{
            return(
                <div style={styles.search}>
                    <YearPicker
                        format="YYYY"
                        {...init("datepicker", {
                            getValueFromEvent: this.normDate
                        })}
                        defaultValue={new Date}
                        style={styles.year}
                        style={styles.date}
                    />
                    <Select
                        showSearch
                        hasClear
                        style={{ width: 150 }}
                        style={styles.week}
                        dataSource={dataSource}
                        onChange={this.onSelectWeek.bind(this)}
                        defaultValue={this.state.week_no}
                        style={styles.date}
                    />
                </div>
            )
           
        }
    }

    render() {
        const init = this.field.init;
        
        return (
            //  <div className='con-top main-con-head'>
            //      <p>数据统计 &gt; 根据部门 </p>
            //  </div>
            <div className='main-con-head'>
                {/* 面包屑↓ */}
                <div className="head-title">
                    <Breadcrumb separator="/">
                        <Breadcrumb.Item >设备统计</Breadcrumb.Item>
                        <Breadcrumb.Item >日统计</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                {/* 面包屑end */}
                <div style={styles.search}>
                    {this.getDateType()}
                    <Select 
                    hasClear
                    dataSource={this.state.dataSource} 
                    style={{ width: 150 }} 
                    defaultValue={this.state.shift}
                    onChange={this.onSelect.bind(this)}/>
                    <Button onClick={this.onSearch.bind(this)} style={styles.btn} >查询</Button>
                    <Button onClick={this.onExport.bind(this)}  style={{display: this.type == 1 ? "block" : "none",marginLeft:40}}>导出</Button>
                    {/* <Button onClick={this.onExportCSV.bind(this)} style={styles.btn} >导出CSV</Button> */}

                </div>
                <div className="load" style={{display: this.state.show ? "block" : "none"}}>
                    导出中,请稍等<i>...</i>
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
    },
    year:{
        marginTop:'10px',
    }
    
};
