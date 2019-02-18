import React, { Component } from "react";
import IceContainer from "@icedesign/container";
import CustomTable from "./components/CustomTable";
import { Pagination, Button, Icon, Feedback, moment } from "@icedesign/base";

import Query from "./components/Query";
import DeleteBalloon from "./components/DeleteBalloon";
import AxiosHttp from "@/utils/AxiosHttp.js";
import Loadings from "@/components/Loadings/Loadings";
const Toast = Feedback.toast;
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
      dataSource: [],
      searchValue: "",
      show: true
    };
    this.params = {};
    this.handleChange = this.handleChange.bind(this);
    this.columns = [
      {
        title: "程序名",
        dataIndex: "programName",
        key: "programName"
      },
      {
        title: "版本",
        dataIndex: "edition",
        key: "edition"
      },
      {
        title: "开发者",
        dataIndex: "developer",
        key: "developer"
      },
      {
        title: "上传时间",

        dataIndex: "writeTime",
        key: "writeTime"
      },
      {
        title: "描述",
        dataIndex: "describe",
        key: "describe"
      },
      {
        title: "操作",
        key: "action",

        render: (value, index, record) => {
          return (
            <span>
              <Button
                type="primary"
                size="small"
                style={styles.batchBtn}
                //  onCilck={() => this.handleButton(value, index, record)}>
                onClick={() => this.handleButton(value, index, record)}
              >
                下载
              </Button>
              <DeleteBalloon
                handleRemove={() => this.handleRemove(value, index, record)}
              />
            </span>
          );
        }
      }
    ];
  }
  // 下载
  handleButton(value, index, record) {
    window.open(AxiosHttp.downloadfeilurl() + record.fileUrl);
  }
  handleRemove(value, index, record) {
    const { dataSource } = this.state;

    AxiosHttp.get("/programlist/delete/" + index + "/" + dataSource[index]._id)
      .then(res => {
        if (res.ok === 1) {
          Toast.success("删除成功");
          this.getProgramlistInfo();
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleChange(current) {
    this.setState(
      {
        current
      },
      () => {
        this.getProgramlistInfo();
      }
    );
    // react 中必须通过 setstate 更新 render才会更新渲染
    this.setState({
      current
    });
  }
  componentWillMount() {
    this.getProgramlistInfo();
  }
  // 搜索
  getSearchValue = resData => {
    this.setState(
      {
        searchValue: resData,
        current: 1
      },
      () => {
        this.getProgramlistInfo();
      }
    );
  };

  getProgramlistInfo = () => {
    if (!this.state.searchValue) {
      this.state.searchValue = null;
    }
    this.params = {
      pageIndex: this.state.current,
      programName: this.state.searchValue
    };
    AxiosHttp.post("/programlist/list", this.params).then(res => {
      let { ok, desc } = res;
      if (ok === 1) {
        this.setState({
          dataSource: res.value.rs,
          total: res.value.total,
          show: false
        });
      } else {
        // console.log(desc);
      }
    });
  };

  componentWillUnmount() {
    ////当组件卸载时
  }

  addFilesEvent = () => {
    this.getProgramlistInfo();
  };

  render() {
    return (
      <div className="tab-table main-container">
        <IceContainer className="main-con-head">
          <Query
            getSearchValue={this.getSearchValue}
            addFilesEvent={this.addFilesEvent}
          />
        </IceContainer>

        <IceContainer className="main-con-body">
          {/* 加载的loading */}
          {/* <Loadings show={this.state.show} /> */}
          <CustomTable
            dataSource={this.state.dataSource}
            columns={this.columns}
            hasBorder={false}
          />
          <div className='pagination'>
              <span className='total'>共 {this.state.total} 条</span>
              <Pagination
                total={this.state.total}
                current={this.state.current}
                onChange={this.handleChange}
                pageSize={this.state.pageSize}
              />
          </div>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
 
  batchBtn: {
    marginRight: "10px"
  }
};
