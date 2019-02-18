import React, { Component } from "react";
import Header from './components/Header'
import Title from './components/Title'
import OutputEcharts from './components/OutputEcharts'
import WeeklyEcharts from '../PublicEcharts/WeeklyEcharts'
import CapacityEcharts from '../PublicEcharts/CapacityEcharts'
import "./Devicestatement.scss";
export default class Devicestatement extends Component {
    constructor(props){
        super(props)
        this.state = {
          
        }
    }
    render(){
        return(
              <div className='main-container'>
                    <Header/>
                    <div className='con-body main-con-body  '>
                    {/* 头部数据 */}
                    <Title/>
                    <div className='echats'>
                        {/* 产出数 */}
                        <OutputEcharts/>
                        {/* 周报 */}
                        <div className='echats-left'>
                            <WeeklyEcharts />
                            {/* top5 产能损失 */}
                            <CapacityEcharts />
                        </div>
                    </div>
                    </div>
              </div>
        )
    }
}