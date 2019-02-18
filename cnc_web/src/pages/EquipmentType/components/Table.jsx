import React, { Component } from "react";
import { Pagination, Table, Button } from "@icedesign/base";
import IceContainer from "@icedesign/container";

import AddEquipmentType from "./AddEquipmentType";

import DeleteButton from "./DeleteButton";
import EditType from "./EditType";

import AxiosHttp from "../../../utils/AxiosHttp";
import DevicetypeUtil from "@/utils/DevicetypeUtil";
import Loadings from '@/components/Loadings/Loadings'
import BrandUtil from "@/utils/BrandUtil";
import EquipmentUtil from "@/utils/EquipmentUtil"
export default class Tables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      current: 1,
      pageSize: 10,
      dataSource: [],
      show: true
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentWillMount() {
    this.getEquipmentTypeList();
  }

  // 发起获取数据的请求
  getEquipmentTypeList() {
    AxiosHttp.get("/equipmentType/list/" + this.state.current)
      .then(res => {
        if (res.ok) {
          this.setState({
            dataSource: res.value.rs,
            total: res.value.total,
            show: false,
            visible: false,
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  addEquipmentTypeList = () => {
    // 发起获取数据的请求
    this.getEquipmentTypeList();
  };
  handleChange(resCurrent) {
    // react 中必须通过 setstate 更新 render才会更新渲染
    this.setState(
      {
        current: resCurrent
      },
      () => {
        // 发起获取数据的请求
        this.getEquipmentTypeList();
      }
    );
  }

  handleRemove = (value, index, record) => {
    AxiosHttp.get("/equipmentType/delete/" + index + "/" + record._id)
      .then(res => {
        let { ok } = res;
        if (ok === 1) {
          this.getEquipmentTypeList();
          DevicetypeUtil.cacheDeviceType();
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  editTypeInfo = (dataIndex, data) => {
    //编辑
    const { dataSource } = this.state;
    dataSource[dataIndex] = data;
    this.setState({
      dataSource
    });
  };

  //编辑删除
  ControllBtns = (value, index, record) => {
    return (
      <div className="con-btns">
        <EditType
          index={index}
          record={record}
          editTypeInfo={this.editTypeInfo}
        />
        <DeleteButton
          styles={styles.delete}
          handleRemove={() => this.handleRemove(value, index, record)}
        />
      </div>
    );
  };

  openNew=(value)=>{
    window.open(value)
  }
  // 公司网站
  aLabeljumpUrl = (value, index, record) => {
    return <span className='link' onClick={()=>this.openNew(value)}>{value}</span>
  }

  // 下载说明书
  Cpecification = (value, index, record) => {
    return <Button
      type="primary"
      size="small"

      onClick={() => this.GetFile(value, index, record)}
    > 下载
        </Button>;
  }

  // 下载
  GetFile(value, index, record) {
    window.open(AxiosHttp.downloadfeilurl() + record.UploadFileUrl);
  }

  render() {
    const formatDevBrandName = (value, index, record) => {
      return (
        <span>{BrandUtil.getBrandLabelById(value)}</span>
      )
    }
    const formatDevicetype = (value, index, record) => {
      return (
        <span>{EquipmentUtil.getEquipmentUtilLabelById(value)}</span>
      )
    }
    return (
      <div className='main-container'>
        <AddEquipmentType addEquipmentTypeList={this.addEquipmentTypeList} />
        <IceContainer className='main-con-body'>
          {/* 加载的loading */}
          {/* <Loadings show={this.state.show} /> */}
          <Table hasBorder={false} dataSource={this.state.dataSource}>
            <Table.Column title="品牌名" dataIndex="name" cell={formatDevBrandName} />
            <Table.Column title="设备类型" dataIndex="type" cell={formatDevicetype} />
            <Table.Column title="设备型号" dataIndex="model" />
            <Table.Column title="联系人" dataIndex="contact" />
            <Table.Column title="公司网站" dataIndex="website" cell={this.aLabeljumpUrl} />
            <Table.Column title="说明书" dataIndex="website" cell={this.Cpecification} />
            <Table.Column title="操作" cell={this.ControllBtns} />
          </Table>
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
  },
  addbtn: {
    float: "right"
  },
  //   astyle:{
  //     width: "156px",
  //     minHeight: "24px",
  //     display:"block",
  //     color:"#666666"
  // }
};
