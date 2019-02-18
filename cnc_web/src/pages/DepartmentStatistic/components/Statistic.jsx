import React, { Component } from "react";
import { hashHistory } from "react-router";
import { Select } from "@icedesign/base";
import echarts from "echarts";
// import "./DepartmentStatistic.scss";
import "./Statistic.scss";
import Department from '@/components/Department/Department'
export default class DepartmentStatistic extends Component {
  constructor(props) {
    super(props);
    this.state = {
        positionList:[
            {
              value: 1,
              label: "深圳市策维科技有限公司",
              children: [
                {
                  value: 3,
                  label: "A区1栋",
                  children: [
                    {
                      value: 9,
                      label: "1F",
                      data: [
                        { value: 79, name: "生产中" },
                        { value: 156, name: "空闲中" },
                        { value: 122, name: "报警中" },
                        { value: 199, name: "离线中" }
                      ],
                      total: 8600
                    },
                    {
                      value: 11,
                      label: "2F",
                      data: [
                        { value: 180, name: "生产中" },
                        { value: 156, name: "空闲中" },
                        { value: 148, name: "报警中" },
                        { value: 99, name: "离线中" }
                      ],
                      total: 7600
                    },
                    {
                      value: 13,
                      label: "3F",
                      data: [
                        { value: 110, name: "生产中" },
                        { value: 89, name: "空闲中" },
                        { value: 106, name: "报警中" },
                        { value: 170, name: "离线中" }
                      ],
                      total: 9845
                    }
                  ]
                },
                {
                  value: 5,
                  label: "B区2栋",
                  children: [
                    {
                      value: 15,
                      label: "1F",
                      data: [
                        { value: 110, name: "生产中" },
                        { value: 89, name: "空闲中" },
                        { value: 106, name: "报警中" },
                        { value: 170, name: "离线中" }
                      ],
                      total: 4665
                    },
                    {
                      value: 17,
                      label: "2F",
                      data: [
                        { value: 180, name: "生产中" },
                        { value: 156, name: "空闲中" },
                        { value: 148, name: "报警中" },
                        { value: 99, name: "离线中" }
                      ],
                      total: 1524
                    },
                    {
                      value: 19,
                      label: "3F",
                      data: [
                        { value: 210, name: "生产中" },
                        { value: 50, name: "空闲中" },
                        { value: 60, name: "报警中" },
                        { value: 70, name: "离线中" }
                      ],
                      total: 9948
                    }
                  ]
                },
                {
                  value: 7,
                  label: "C区3栋",
                  children: [
                    {
                      value: 21,
                      label: "1F",
                      data: [
                        { value: 180, name: "生产中" },
                        { value: 156, name: "空闲中" },
                        { value: 148, name: "报警中" },
                        { value: 99, name: "离线中" }
                      ],
                      total: 9555
                    },
                    {
                      value: 23,
                      label: "2F",
                      data: [
                        { value: 180, name: "生产中" },
                        { value: 156, name: "空闲中" },
                        { value: 148, name: "报警中" },
                        { value: 99, name: "离线中" }
                      ],
                      total: 7899
                    },
                    {
                      value: 25,
                      label: "3F",
                      data: [
                        { value: 210, name: "生产中" },
                        { value: 50, name: "空闲中" },
                        { value: 60, name: "报警中" },
                        { value: 70, name: "离线中" }
                      ],
                      total: 6559
                    }
                  ]
                }
              ]
            }
          ]
    }
   
  }
  componentDidMount() {
    let sum = 0;
    this.state.positionList.map((val, index) => {
      val.children.map((el, cIndex) => {
        el.children.map((element, dIndex) => {
          const data = element.data;
          sum = 0;
          data.forEach(val => {
            sum += val.value;
          });

          let option = {
            color: ["#2bcda2", "#ffbd0d", "#ff6565", "#e4e4e4"],
            title: {
              text: sum,
              subtext: "机台数量",
              x: "center",
              y: "center",
              itemGap: 0,
              textStyle: {
                fontWeight: "600",
                fontSize: 24,
                fontWeight: "600"
              },
              subtextStyle: {
                color: "rgba(0,0,0,0.53)",
                fontSize: 12
              }
            },
            tooltip: {
              trigger: "item",
              showContent: false,
              formatter: function(params, ticket, callback) {
                var res = params.seriesName;
                res += "<br/>" + params.name + " : " + params.percent + "%";
                return res;
              },
              position: function(pos, params, dom, rect, size) {
                // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
                var obj = { top: 0 };
                obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 5;
                return obj;
              }
            },
            series: [
              {
                hoverAnimation: false,
                name: "消费",
                type: "pie",
                selectedMode: "single",
                radius: ["80%", "100%"],
                label: {
                  normal: {
                    show: false,
                    position: "inner",
                    textStyle: { color: "#fff", fontSize: 14 }
                  }
                },
                labelLine: { normal: { show: false } },
                data: data
              }
            ]
          };
          // 基于准备好的dom，初始化echarts实例
          var myChart = echarts.init(
            document.getElementById(`main${index}+${cIndex}+${dIndex}`)
          );
          // 绘制图表
          myChart.setOption(option);
        });
      });
    });
  }
handleSearchCondition=(res)=>{
  console.log(res.department,'部门')
}
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
  render() {
    const _this = this;
    function drawSecond(el, index, cIndex) {
      let item = el.children.map((item, dIndex) => (
        <li
          className="mac-list-item"
          key={item.label}
          onClick={() => {
            sessionStorage.setItem('item',JSON.stringify({item}))
            hashHistory.push("statistic/department/departmentDetail/?");
          }}
        >
          <h3 className="area">{item.label}</h3>
          <div className="main-mess">
            <div id={`main${index}+${cIndex}+${dIndex}`} className="chrats" />
            <ul className="main-mess-list">
              <li>
                <span className="status">生产中</span>
                <span className="persent">
                  {(
                    item.data[0].value /
                    (item.data[0].value +
                      item.data[1].value +
                      item.data[2].value +
                      item.data[3].value) *
                    100
                  ).toFixed(0) + "%"}
                </span>
                <span className="num">{item.data[0].value}</span>
              </li>
              <li>
                <span className="status">空闲中</span>
                <span className="persent">
                  {(
                    item.data[1].value /
                    (item.data[0].value +
                      item.data[1].value +
                      item.data[2].value +
                      item.data[3].value) *
                    100
                  ).toFixed(0) + "%"}
                </span>
                <span className="num">{item.data[1].value}</span>
              </li>
              <li>
                <span className="status">报警中</span>
                <span className="persent">
                  {(
                    item.data[2].value /
                    (item.data[0].value +
                      item.data[1].value +
                      item.data[2].value +
                      item.data[3].value) *
                    100
                  ).toFixed(0) + "%"}
                </span>
                <span className="num">{item.data[2].value}</span>
              </li>
              <li>
                <span className="status">离线中</span>
                <span className="persent">
                  {(
                    item.data[3].value /
                    (item.data[0].value +
                      item.data[1].value +
                      item.data[2].value +
                      item.data[3].value) *
                    100
                  ).toFixed(0) + "%"}
                </span>
                <span className="num">{item.data[3].value}</span>
              </li>
            </ul>
          </div>
          <p className="total-product">{item.total}</p>
        </li>
      ));
      return <ul className="mac-list">{item}</ul>;
    }
    function Draw() {
      const item = _this.state.positionList.map((val, index) =>
        val.children.map((el, cIndex) => (
          <li className="mac-con-item" key={el.label}>
            <p className="location-name">{el.label}</p>
            {drawSecond(el, index, cIndex)}
          </li>
        ))
      );
      return <ul className="mac-con">{item}</ul>;
    }

    // function SelectItem() {
    //   const select = _this.state.positionList.map((val, index) => (
    //     <option key={index} >{val.label}</option>
    //   ));
    //   return <select className = "sel">{select}</select>;
    // }

    return (
      <div className="location-contents">
        <div className="container-block ">
        {/* <SelectItem positionList={this.state.positionList} /> */}
        <Department handleSearchCondition={ (res)=>this.handleSearchCondition(res)}/>
        </div>
        <div className="content-panel">
          <Draw />
        </div>
      </div>
    );
  }
}
