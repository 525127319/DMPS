import React, { Component } from "react";
import IceContainer from "@icedesign/container";
import { Search } from "@icedesign/base";
import {
  DatePicker,
  Pagination,
  Button,
  Icon,
  Field,
  moment,
  Input,
  TreeSelect,
  Feedback
} from "@icedesign/base";
const { RangePicker } = DatePicker;
const Toast = Feedback.toast;

const treeData = [
  {
    label: "策维",
    value: "A1",
    selectable: false,
    children: [
      {
        label: "转配部",
        value: "A2"
      },
      {
        label: "CNC",
        value: "A3"
      }
    ]
  },
  {
    label: "艾励美特",
    value: "B1",
    selectable: false,
    children: [
      {
        label: "装配部",
        value: "B2"
      },
      {
        label: "CNC",
        value: "B3"
      }
    ]
  }
];

export default class Navigationhead extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.field = new Field(this);
  }
  queryEvent() {
    console.log("search");
  }
  normRange(date, dateStr) {
    if (moment(dateStr[1]).diff(moment(dateStr[0]), "days") > 30) {
      Toast.prompt("查看的时间范围不能超过一个月");
      return;
    }
    return date;
  }
  onChange(value) {
    // console.log(value);
  }

  handleChange(value, data) {
    // console.log(value, data);
  }

  handleSearch(keyword) {
    // console.log(keyword);
  }
  render() {
    const init = this.field.init;

    const now = moment();
    const start = moment().subtract(1, "weeks");
    const quickRanges = {
      Today: [now, now],
      "previous week": [start, now]
    };
    return (
      <div>
        <IceContainer>
          <div>
            <div style={styles.addbtn}>
              <TreeSelect
                autoWidth
                showSearch
                dataSource={treeData}
                onChange={this.handleChange}
                onSearch={this.handleSearch}
                style={{ width: 200 }}
                placeholder="请选择查看部门"
              />
            </div>

            <RangePicker
              ranges={quickRanges}
              {...init("rangepicker", {
                getValueFromEvent: this.normRange,
                initValue: [
                  moment()
                    .subtract(1, "months")
                    .format("YYYY-MM-DD"),
                  moment().format("YYYY-MM-DD")
                ]
              })}
            />
            <span style={styles.searchBtn}>
              <Search
                size="medium"
                searchText="搜索"
                inputWidth={300}
                placeholder="设备名称"
                onSearch={this.queryEvent}
              />
            </span>
          </div>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  searchBtn: {
    marginLeft: "40px",
    float: "right"
  },
  addbtn: {
    float: "left",
    marginRight: "40px"
  }
};
