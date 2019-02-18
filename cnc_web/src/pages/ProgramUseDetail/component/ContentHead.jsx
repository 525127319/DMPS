import React, { Component } from 'react'
import IceContainer from '@icedesign/container';
import { Button, Icon, Select, Form, Field, Search, Input,DatePicker} from "@icedesign/base";
import './ContentHead.scss'
import ShiftUtil from '@/utils/ShiftUtil';
const FormItem = Form.Item;

export default class ContentHead extends Component {
    constructor(props) {
        super(props)
        let shiftDate = ShiftUtil.getShiftDate();
        this.state = {
            value: "",
            shiftDate: shiftDate
        }
        this.field = new Field(this);
    }

    onChange(value) {
        this.setState({
            value
        });
    }

    onSearch = () => {
        let val=this.field.getValues()
        let day =val.datepicker;
        this.props.getSearchValue(this.state.value,day);
    };

    normDate(date, dateStr) {
        return dateStr;
    }
    handleClick(){
        window.history.back();
        sessionStorage.setItem('flag',true);
    }
    
    render() {
        const init = this.field.init;
        return (
           
                <IceContainer className='main-con-head'>
                    <div style={styles.search}>
                        
                            <Button type="primary"  style={styles.btnIcon} onClick={this.handleClick.bind(this)}>
                            <Icon type="arrow-left" /> 
                            <span>返回</span>
                            </Button>  
                       
                            <DatePicker
                                format="YYYY-MM-DD"
                                {...init("datepicker", {
                                    getValueFromEvent: this.normDate
                                })}
                                // defaultValue={new Date} 
                                defaultValue={this.state.shiftDate}
                                size="large"
                                style={styles.date}
                            />
                            <Input placeholder="输入查询的程序名" onChange={this.onChange.bind(this)} trim value={this.state.value} style={{ width: 200 }} hasClear={true} />
                            <Button onClick={this.onSearch} style={styles.btn}>查询</Button>
                    </div>
                </IceContainer>
           
        )
    }
}
const styles = {
    search: {
        display: "flex",
        alignItems:'center',
    },
    btn: {
        marginLeft: "40px",
        marginTop: "3px",
    },
    date:{
        marginRight:"40px",
        marginLeft: "40px",
    },
   
   
};