import React, { Component } from "react";
export default class WeekTitle extends Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }
    render(){
        return(
            <div className="y-title" 
            style={styles.rabbit }
            >
                {/* <h3>
                    <span>位置：高尔夫</span>
                </h3> */}
                <nav className="title-nav">
                    {/* 兔子与乌龟 */}
                    {/* 兔子添加.rabbit */}
                    <div className="title-img rabbit"></div>
                    <ul>
                        <li>
                            <p>目标产出数<span>500</span></p>
                            <p>实际产出数<span>400</span></p>
                        </li>
                        <li>
                            <p>排配机台<span>E10</span></p>
                            <p>生产机台<span>E10</span></p>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
};
const styles = {
    rabbit: {
        display: "flex",
    },
   
};

