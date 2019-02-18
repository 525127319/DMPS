import React, { Component } from "react";
import IceContainer from "@icedesign/container";
import { Pagination } from "@icedesign/base";
import ContentHead from "./component/ContentHead.jsx";
import ContentBody from "./component/ContentBody.jsx";
import "./ProgramWrite.scss";
import AxiosHttp from "@/utils/AxiosHttp";
import Loadings from "@/components/Loadings/Loadings";
// import client from "@/utils/WebsocketClient";
// import { msgType } from "@/utils/Config";

export default class ProgramWrite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logCurrent: 1,
      total: 0,
      params: {},
      dataSource: [],
      selectInfo: [],
      show: true
    };
    // let subject = client.on({ msgType: msgType.uploadFile });
    // subject.subscribe(this.monitorMidServer);
  }
  // monitorMidServer = res => {
  //   console.log("websockt");
  //   console.log(res);
  // };
  getSearchValue = resData => {
    this.setState({ params: resData ,logCurrent: 1}, () => {
      this.getProgramWriteInfo();
    });
  };
  onSelect = resData => {
    this.setState({
      selectInfo: resData
    });
  };
  logHandleChange = logCurrent => {
    //弹框分页当前页面
    this.setState({ logCurrent }, () => {
      this.getProgramWriteInfo();
    });
  };
  componentWillMount() {
    this.getProgramWriteInfo();
  }

  getProgramWriteInfo = () => {
    AxiosHttp.post(
      "/device/listInfo",
      Object.assign({}, this.state.params, {
        logCurrent: this.state.logCurrent
      })
    )
      .then(res => {
        this.setState({
          dataSource: res.value.re,
          total: res.value.total,
          show: false
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
  render() {
    return (
      <div className="main-content main-container">
        <ContentHead
          getSearchValue={this.getSearchValue}
          selectInfo={this.state.selectInfo}
        />
        <IceContainer   className='main-con-body'>
          {/* 加载的loading */}
          {/* <Loadings show={this.state.show} /> */}
          <ContentBody
            dataSource={this.state.dataSource}
            onSelect={this.onSelect}
          />
           
          <div className='pagination'>
              <span className='total'>共 {this.state.total} 条</span>
              <Pagination
                total={this.state.total}
                current={this.state.logCurrent}
                onChange={this.logHandleChange}
              />
          </div>
        </IceContainer>
      </div>
    );
  }
}
 