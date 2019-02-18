import React, { PureComponent } from "react";
import { Grid,Pagination } from "@icedesign/base";
import IceContainer from "@icedesign/container";
import Card from "./components";
import AxiosHttp from "../../utils/AxiosHttp";
// import Clien from "../../utils/WebsocketClient";
import { evn } from "../../utils/Config";
import CardOverView from "./components/CardOverView";
let timer = null;
const { Row } = Grid;

export default class CardList extends PureComponent {
  static displayName = "CardList";

  constructor(props) {
    //上層組件傳進來的屬性。
    super(props);
    this.state = {
      dataSource: [],
      curTimeArr: [],
      deviceStatusArr: [],
      devtype: ""
    };
    this.invoke();
  }

  handleCurTime = function(response) {
    if (response.ok) {
      this.setState({
        curTimeArr: response.value
      });
    }
  }.bind(this);

  handleDevsum = function(response) {
    if (response.ok) {
      this.setState({
        dataSource: response.value
      });
    }
  }.bind(this);

  handleDevStatus = function(response) {
    if (response.ok) {
      this.setState({
        deviceStatusArr: response.value
      });
    }
  }.bind(this);

  invoke() {
    // 当天工作时间、开机时长
    AxiosHttp.get("/devicemonitor/status")
      .then(this.handleDevStatus)
      .catch(error => {
        console.log(error);
      });

    // 当天工作时间、运行时间
    AxiosHttp.get("/dayStatistic/curtime")
      .then(this.handleCurTime)
      .catch(error => {
        console.log(error);
      });

  //   // 设备总数
  //   AxiosHttp.get("/device/devicesum")
  //     .then(this.handleDevsum)
  //     .catch(error => {
  //       console.log(error);
  //     });
   }
  // initMonitorStatus() {
  //     AxiosHttp
  //         .get('/device/initdevice')
  //         .then()
  //         .catch((error) => {
  //             console.log(error);
  //         });
  // }

  //瀉染完後，在後臺整合數據
  componentDidMount() {
    timer = setInterval(() => {
      this.invoke();
    }, evn.reRender);

    // 初始化设备状态
    // this.initMonitorStatus();
  }

  componentWillUnmount() {
    clearInterval(timer);
  }

  handleDataSource(type) {
    this.setState({
      devtype: type
    });
  }

  render() {
    //瀉染

    return (
   
        <IceContainer className="card-body main-container">
          <CardOverView
            dataSource={this.state.dataSource}
            deviceStatus={this.state.deviceStatusArr}
            handleDataSource={this.handleDataSource.bind(this)}
          />
          <Row className='realtime-body main-con-body' wrap gutter={20}>
            <Card
              dataSource={this.state.dataSource}
              curTimeArr={this.state.curTimeArr}
              deviceStatusArr={this.state.deviceStatusArr}
              devtype={this.state.devtype}
            />
          </Row>
        </IceContainer>
      
    );
  }
}
