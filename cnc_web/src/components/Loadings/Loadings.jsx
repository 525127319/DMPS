import React, { Component } from 'react';
import { Loading } from "@icedesign/base";
import './Loading.scss';
export default class Loadings extends Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }
    // setVisible(){
    //     this.setState({
    //         show
    //       });
    // }
    // showLoadings=()=>{
    //     this.setVisible.bind(this, true)
    // }
    // hideLoading=()=>{
    //     this.setVisible.bind(this, false)
    // }
    render(){
        // let rm =() =>{
        //     this.setState({show:this.state.show = false});
        // }	
        // // 自动隐藏
        // setTimeout(rm,1500)         
          return(
                <div className="mc" style={{display: this.props.show ? "block" : "none"}}>
                    <p>
                        <i></i>
                        <i></i>
                        <i></i>
                    </p>
                </div>
        )
    }
}