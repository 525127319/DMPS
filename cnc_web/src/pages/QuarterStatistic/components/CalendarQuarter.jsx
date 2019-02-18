import React, { Component } from "react";


export default class CalendarQuarter extends Component {
    constructor(props) {
        super(props);
        this.props.shift = 0;
        this.state = {
            dataSource: [],
            showQuarter:false,
            now: new Date(),
            quarterArr:[
                {label:'第一季度',value:'1'},
                {label:'第二季度',value:'2'},
                {label:'第三季度',value:'3'},
                {label:'第四季度',value:'4'}, 
            ]
        }
       
    }

    yearClick(flag){
        let newNow =new Date(this.state.now.setFullYear(this.state.now.getFullYear() + flag));
        this.setState({
            now:newNow
        });
    }

    handleQuarter(item){
        let newQuarter =this.state.now.getFullYear()+"年"+item.label;
        let quarterVal =this.state.now.getFullYear()+"-"+item.value;
        this.props.handleChange(newQuarter,quarterVal,this.state.showQuarter);
    }
    handleCancel(){
        this.props.handleCancel(this.state.showQuarter); 
    }

    renderQuarterData(){
        let i = this.props.quarterVal.indexOf('-');
        let val =this.props.quarterVal.slice(i+1,this.props.quarterVal.length);
        let findindex = this.state.quarterArr.findIndex(items =>{
            return items.value ==val;
        })
        return this.state.quarterArr.map((item,index) =>{
            return (
                <li key={index}  className={findindex == index?'active':''} onClick={this.handleQuarter.bind(this,item)} >{item.label}</li>
            )
        })
    }

    render() {
        const now =this.state.now
        return (
                <nav >
                    <p>
                        <span onClick={this.yearClick.bind(this,-1)}>&lt;&lt;</span>
                        <span>{now.getFullYear()}</span>
                        <span onClick={this.yearClick.bind(this,1)}>&gt;&gt;</span>
                    </p>
                    <ul className='y-hide' >
                        {
                            this.renderQuarterData()
                        }
                    </ul>
                    <div className='y-fots'  onClick={this.handleCancel.bind(this)} >取消</div>
                </nav>
  
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