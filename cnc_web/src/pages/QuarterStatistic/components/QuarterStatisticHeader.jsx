import React, { Component } from "react";
import ShiftUtil from '@/utils/ShiftUtil';
import CalendarQuarter from './CalendarQuarter.jsx';
import AxiosHttp from '@/utils/AxiosHttp.js'
import { DatePicker, Form, Button, Field, Moment, Select} from "@icedesign/base"
const { MonthPicker, YearPicker, RangePicker } = DatePicker;


export default class DeaprmentHeader extends Component {
    constructor(props) {
        super(props);
        // this.props.shift = 0;
        this.state = {
            dataSource: [],
            showQuarter:false,
            quarterText:'',
            quarterVal:'',
            _shift:'',
        }
        this.shift = null;
        this.field = new Field(this);
    }
    inputOnFocus(){
        this.setState({
            showQuarter:true
        })
        
    }

    handleChange(label,value,showQu){
        this.setState({
            showQuarter:showQu,
            quarterText:label,
            quarterVal:value,
        })
        // this.props.handletHeaderDate(this.state.quarterVal);
    }

    handleCancel(val){
        this.setState({
            showQuarter:val    
        })
    }

    onSearch = (ctype) => {
        let val = this.field.getValues();
        let time = val.datepicker;
        let optiondate = Moment(time).format("YYYY-MM");
        if ('export' != ctype)ctype = null;
        this.props.handletHeaderDate(this.shift, this.state.quarterVal, ctype);
    };

    onExport = (value) => {
        this.onSearch('export');
    };

    // 导出CSV
    onExportCSV = (value) => {
        // this.onSearch('export');
    };

    normDate(date, dateStr) {
        return dateStr;
    }

    onSelect(value){
        this.shift = value;
        this.setState({
           _shift:value 
        })
    }
    componentWillMount(){
       
        let curQuarterText = new Date().getMonth()+1;
        let curYear =new Date().getFullYear();
        if(this.state.quarterText =='' && this.state.quarterVal ==''){
                if(curQuarterText<=3){
                    this.setState({
                        quarterText:curYear+'年第一个季度',
                        quarterVal:curYear+'-1'
                    })
                }else if(curQuarterText>3 && curQuarterText<=6 ){
                    this.setState({
                        quarterText:curYear+'年第二个季度',
                        quarterVal:curYear+'-2'
                    })
                }else if(curQuarterText>6 && curQuarterText<=9){
                    this.setState({
                        quarterText:curYear+'年第三个季度',
                        quarterVal:curYear+'-3'
                    })
                }else{
                    this.setState({
                        quarterText:curYear+'年第四个季度',
                        quarterVal:curYear+'-4'
                    })
                }
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

    render() {
        const init = this.field.init;
        const {showQuarter,quarterText,_shift} =this.state;
        return (
            //  <div className='con-top main-con-head'>
            //      <p>数据统计 &gt; 根据部门 </p>
            //  </div>
            <div className='main-con-head'>
                <div style={styles.search}>
                    {/* <MonthPicker
                        format="YYYY-MM"
                        {...init("datepicker", {
                            getValueFromEvent: this.normDate
                        })}
                        defaultValue={new Date}
                        style={styles.date}
                    /> */}
                     <div className='y-max-in' >
                        <input type="text" style={styles.input} placeholder="请选择季度" value={quarterText} className='y-in' readOnly   
                        onFocus={this.inputOnFocus.bind(this) }/>
                        { showQuarter && <CalendarQuarter  handleChange ={this.handleChange.bind(this)} quarterVal={this.state.quarterVal} handleCancel ={this.handleCancel.bind(this)}/>}
                     </div>
                    
                    <Select dataSource={this.state.dataSource} style={{ width: 150 }} defaultValue={'全部'} value={_shift} onChange={this.onSelect.bind(this)}/>
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
    },
    input:{
        paddingLeft: "10px", 
        height: "29px",
        minWidth: "100px", 
        lineHeight: "38px",
        border: "1px solid #e6e6e6",  
        backgroundColor: "#fff",  
        borderRadius: "2px",
    }
    
};