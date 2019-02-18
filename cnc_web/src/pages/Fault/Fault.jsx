import React, { Component } from 'react';
import './fault.scss';
export default class Fault extends Component {
    static displayName = 'Fault';
    constructor(props){
        super(props);
        this.state = {
                show : true,
                date: 20,
                title:"报警"  
            };	
    }
    render(){
        // 点击隐藏
        let rm =() =>{
            this.setState({show:this.state.show = false});
        }	
        // 自动隐藏
        setTimeout(rm,5000) 
            return(
                <div className="fault" style={{display: this.state.show ? "block" : "none"}}>
                    <p>{this.state.title}</p>
                    <span>{this.state.date}</span>		
                    <i className="remo" onClick={rm}>x</i>
                </div>
            )
        }
    }