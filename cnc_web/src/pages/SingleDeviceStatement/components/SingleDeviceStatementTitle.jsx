import React, { Component } from "react";
export default class Title extends Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }
    render(){
        return(
            <div className="y-title">
                {/* <h3>
                    <span>位置：从完成完成卧槽卧槽我吃完从</span>
                    <span>班别：白班</span>
                    <span>日期：2018/10/11</span>
                </h3> */}
                <nav className="title-nav">
                    {/* 兔子与乌龟 */}
                    {/* 兔子添加.rabbit */}
                    <div className="title-img rabbit"></div>
                    <ul>
                        <li>
                            <p>目标产出数<span>11</span></p>
                            <p>实际产出数<span>11</span></p>
                        </li>
                        <li>
                            <p>排配机台<span>11</span></p>
                            <p>生产机台<span>22</span></p>
                        </li>
                        {/* <li>
                            <p>目标产出总数<span>11</span></p>
                            <p>实际目标产出总数<span>22</span></p>
                        </li>
                        <li>
                            <p>生产达成率<span>77%</span></p>
                        </li> */}
                    </ul>
                </nav>
            </div>
        )
    }
}
