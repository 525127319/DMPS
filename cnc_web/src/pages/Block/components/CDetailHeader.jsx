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

    render() {
        return (
            // <div style={styles.y}>
                <div>
                    {this.convertProduct(this.state.department)}
                    <i class="next-icon next-icon-arrow-right next-icon-xs"></i>
                    {this.convertPinch(this.state.department)}
                    <i class="next-icon next-icon-arrow-right next-icon-xs"></i>
                    {this.convertCell(this.state.department)}
                    <i class="next-icon next-icon-arrow-right next-icon-xs"></i>
                    {this.convertBlock(this.state.department)}
                </div>
            // </div>
        )
    }
}

// const styles = {
//     search: {
//         display: "flex",
//     },
//     btn: {
//         marginLeft: "40px",
//     },
//     date: {
//         marginRight: "40px",
//     },
//     year: {
//         marginRight: "40px",
//     },
//     y: {
//         padding: "20px",
//         background: "#fff"
//     }
// };