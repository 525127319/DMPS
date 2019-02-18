import React, { Component } from 'react';
import echarts from 'echarts';
import { Button, Icon,  Search } from "@icedesign/base";
import './StatisticDetail.scss'
// let workshopMess = JSON.parse(sessionStorage.getItem("el2"))
// console.log( workshopMess)
// let macNumber =0
//
// for(let i=0;i<workshopMess.el2.data.length;i++){
//     macNumber += workshopMess.el2.data[i].value*1;
// }
// let workingPersent = (workshopMess.el2.data[0].value *100/ macNumber).toFixed(0);
// let errorPersent = (workshopMess.el2.data[1].value *100/ macNumber).toFixed(0);
// let resetPersent = (workshopMess.el2.data[2].value *100/ macNumber).toFixed(0);
// let offLinePersent =(workshopMess.el2.data[3].value*100/ macNumber).toFixed(0);
// console.log(
//   macNumber,
//   workingPersent,
//   errorPersent,
//   offLinePersent,
//   resetPersent
// );
let allOption = {
  color: ["#2bcda2", "#ffbd0d", "#ff6565", "#e4e4e4"],
  title: {
    text: 400,
    subtext: "机台数量",
    x: "center",
    y: "center",
    itemGap: 0,
    textStyle: {
      fontSize: 24,
      fontWeight: "600",
      color: "white"
    },
    subtextStyle: {
      color: "rgba(0,0,0,0.53)",
      fontSize: 12,
      color: "white"
    }
  },

  series: [
    {
      type: "pie",
      clickable: false,
      hoverAnimation: false,
      legendHoverLink: false,
      radius: ["70%", "85%"],
      labelLine: { normal: { show: false } },
      data: [
        { value: 200 },
        { value:50},
        { value:100 },
        { value: 50}
      ]
    }
  ]
};
let workingOption = {
  color: ["#2bcda2", "#4d515c"],
  title: {
    text:"50%",
    x: "center",
    y: "center",
    itemGap: 0,
    textStyle: {
      fontSize: 20,
      fontWeight: "600",
      color: "white",
      fontFamily: "Arial"
    }
  },

  series: [
    {
      type: "pie",
      clickable: false,
      hoverAnimation: false,
      legendHoverLink: false,
      radius: ["75%", "100%"],
      labelLine: { normal: { show: false } },
      data: [
        { value:100},
        { value: 300 }
      ]
    }
  ]
};
let errorOption = {
  color: ["#ff6565", "#4d515c"],
  title: {
    text: "12.5%",
    x: "center",
    y: "center",
    itemGap: 0,
    textStyle: {
      fontSize: 16,
      fontWeight: "600",
      color: "white",
      fontFamily: "Arial"
    }
  },

  series: [
    {
      type: "pie",
      clickable: false,
      hoverAnimation: false,
      legendHoverLink: false,
      radius: ["75%", "100%"],
      labelLine: { normal: { show: false } },
      data: [
        { value: 50 },
        { value:350 }
      ]
    }
  ]
};
let resetOption = {
  color: ["#ffbd0d", "#4d515c"],
  title: {       
    text:"25%",
    x: "center",
    y: "center",
    itemGap: 0,
    textStyle: {
      fontSize: 16,
      fontWeight: "600",
      color: "white",
      fontFamily: "Arial"
    }
  },

  series: [
    {
      type: "pie",
      clickable: false,
      hoverAnimation: false,
      legendHoverLink: false,
      radius: ["75%", "100%"],
      labelLine: { normal: { show: false } },
      data: [
        { value: 100},
        { value: 300}
      ]
    }
  ]
};
let offLineOption = {
  color: ["#bfbfbf", "#4d515c"],
  title: {
    text:"12.5%",
    x: "center",
    y: "center",
    itemGap: 0,
    textStyle: {
      fontSize: 16,
      fontWeight: "600",
      color: "white",
      fontFamily: "Arial"
    }
  },

  series: [
    {
      type: "pie",
      clickable: false,
      hoverAnimation: false,
      legendHoverLink: false,
      radius: ["75%", "100%"],
      labelLine: { normal: { show: false } },
      data: [
        { value: 50 },
        { value:350}
      ]
    }
  ]
};
 
let cncMessList=[]
for (let i =1; i < 301; i++) {
  cncMessList.push({     
    name: `CNC-A0${i}`,
    programName: `EX000${i}`,
    cropMobility: `${(Math.random() * 100).toFixed(0)}%`,
    status: `${
      ["working", "error", "off-line", "reset"][(Math.random() * 3).toFixed(0)]
    }`
  });
}
// console.log(cncMessList)
export default class LayoutDetail extends Component {
                componentDidUpdate() {
                           // 基于准备好的dom，初始化echarts实例
                           let allMac = echarts.init(document.getElementById("allMac"));
                           let working = echarts.init(document.getElementById("working"));
                           let error = echarts.init(document.getElementById("error"));
                           let reset = echarts.init(document.getElementById("reset"));
                           let offLine = echarts.init(document.getElementById("offLine"));
                           // 绘制图表
                           allMac.setOption(allOption);
                           working.setOption(workingOption);
                           error.setOption(errorOption);
                           reset.setOption(resetOption);
                           offLine.setOption(offLineOption);
                         }
                 componentDidMount() {
                   // 基于准备好的dom，初始化echarts实例
                    let allMac = echarts.init(document.getElementById("allMac"));
                    let working = echarts.init(document.getElementById("working"));
                    let error = echarts.init(document.getElementById("error"));
                    let reset = echarts.init(document.getElementById("reset"));
                    let offLine = echarts.init(document.getElementById("offLine"));
                   // 绘制图表
                    allMac.setOption(allOption);
                    working.setOption(workingOption);
                    error.setOption(errorOption);
                    reset.setOption(resetOption);
                    offLine.setOption(offLineOption);
                 }
                 render() {
                     function MapCncMess(){
                        let lists = cncMessList.map(
                          (val, index) => (
                            <li className={`cnc-item   ${val.status}`} key={index}>
                              <ul className="mess">
                                <li>
                                  <span className="name">
                                    机台名称：
                                  </span>
                                  <span className="val">
                                    {val.name}
                                  </span>
                                </li>
                                <li>
                                  <span className="name">
                                    程序名称：
                                  </span>
                                  <span className="val">
                                    {val.programName}
                                  </span>
                                </li>
                                <li>
                                  <span className="name">
                                    稼动率：
                                  </span>
                                  <span className="val">
                                    {val.cropMobility}
                                  </span>
                                </li>
                              </ul>
                            </li>
                          )
                        );
                        return <ul className="cnc-list">
                            {lists}
                          </ul>;
                     }
                   return <div className="mac-panel">
                       <div className="panel-header">
                         <Button type="primary" onClick={()=>{
                             window.history.back();
                             }}>
                           <Icon type="arrow-left" />
                           <span>返回</span>
                         </Button>
                         <h3 className="title">
                           策维科技 A区 1F
                         </h3>
                         <Search type="primary" searchText='搜索' inputWidth={240} placeholder="请输入设备名称查找" />
                       </div>
                       <div className="panel-body">
                         <div className="canvas-panel">
                           <div id="allMac" className="canvas-item" />
                           <div className="canvas-item">
                             <div id="working" className="items" />
                             <p className="item-num">
                               {
                                 200
                               }
                             </p>
                             <p className="txt">生产中</p>
                           </div>
                           <div className="canvas-item">
                             <div id="error" className="items" />
                             <p className="item-num">
                               {
                                 50
                               }
                             </p>
                             <p className="txt">异常中</p>
                           </div>
                           <div className="canvas-item">
                             <div id="reset" className="items" />
                             <p className="item-num">

                               {
                                100
                               }
                             </p>
                             <p className="txt">空闲中</p>
                           </div>
                           <div className="canvas-item">
                             <div id="offLine" className="items" />
                             <p className="item-num">
                               {
                                50
                               }
                             </p>
                             <p className="txt">离线中</p>
                           </div>

                           <div className="canvas-item">
                             <p className="total-product">
                               {
                                 860000
                                   
                               }
                             </p>
                             <p className="txt">离线中</p>
                           </div>
                         </div>

                         <MapCncMess />
                       </div>
                     </div>;
                 }
               }

 