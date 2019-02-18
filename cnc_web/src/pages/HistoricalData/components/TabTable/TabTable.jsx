import React, { Component } from "react";
import IceContainer from "@icedesign/container";
import CustomTable from "./components/CustomTable";
import { DatePicker, Pagination, Button, Icon, Field } from "@icedesign/base";
import Navigationhead from "./components/Navigationhead";
import AxiosHttp from "@/utils/AxiosHttp";

export default class TabTable extends Component {
  static displayName = "TabTable";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      current: 1,
      pageSize: 10,
      dataSource: [
        {
          deviceName: "AST00-13",
          deviceType: "铣床",
          runningTime: "8:45:10",
          workingHours: "6",
          productionQuantity: "1000",
          mobility: "10%",
          abnormalityTimes: "9",
          historicalProcedure: 10
        },
        {
          deviceName: "AST00-14",
          deviceType: "铣床",
          runningTime: "8:45:10",
          workingHours: "16",
          productionQuantity: "1660",
          mobility: "8%",
          abnormalityTimes: "19",
          historicalProcedure: 10 
        }
      ]
    };
    this.params = {
      current: 0
    };
  }

  componentWillMount() {
    this.getCustomTableList();
  }

  //发请求获取数据
  getCustomTableList(){
    AxiosHttp.get("/dayStatistic/list/" + this.state.current)
    .then(res => {
      console.log(res,'获取数据没有');
      if (res.ok) {
        this.setState({
          dataSource: res.value.rs,
          total: res.value.total
        });
      }
    })
    .catch(error => {
      console.log(error);
    });
  }


  render() {
    return (
      <div className="tab-table">
        <Navigationhead />
        <IceContainer>
          <CustomTable dataSource={this.state.dataSource} />
          <Pagination
            style={styles.pagination}
            total={this.state.total}
            current={this.state.current}
            onChange={this.handleChange}
            pageSize={this.state.pageSize}
          />
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  pagination: {
    textAlign: "right",
    paddingTop: "26px"
  }
};
