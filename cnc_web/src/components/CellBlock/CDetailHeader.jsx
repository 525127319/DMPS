import React, { Component } from "react";
import CComponent from "@/components/Common/CComponent";

export default class CDetailHeader extends CComponent {
    constructor(props) {
        super(props);
        this.state={
            department: props.department
        }
    }


    willReceiveProps(newProps, oldProps){
        // console.log('department', newProps.department);
        this.setState({
            department: newProps.department
        });
    }

    getCellAndBlock(){
       
        if (this.props.type == 'block'){
            return (
                <div>
                {this.convertProduct(this.state.department)}
                <i class="next-icon next-icon-arrow-right next-icon-xs"></i>
                {this.convertPinch(this.state.department)}
                <i class="next-icon next-icon-arrow-right next-icon-xs"></i>
                {this.convertCell(this.state.department)}
                <i class="next-icon next-icon-arrow-right next-icon-xs"></i>
                {this.convertBlock(this.state.department)}
        </div>
            );
        } else { return (
            <div>
                {this.convertProduct(this.state.department)}
                <i class="next-icon next-icon-arrow-right next-icon-xs"></i>
                {this.convertPinch(this.state.department)}
                <i class="next-icon next-icon-arrow-right next-icon-xs"></i>
                {this.convertCell(this.state.department)}
                {/* <i class="next-icon next-icon-arrow-right next-icon-xs"></i>
                {this.convertBlock(this.state.department)} */}
        </div>

        )

        }
    }

    render() {
       return this.getCellAndBlock()
    }
}