import React, { Component } from "react";
import { Dialog, Button, Form, Input, Field, Switch ,Table, Slider} from "@icedesign/base";
import AxiosHttp from "../../../utils/AxiosHttp";
import IceContainer from '@icedesign/container';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';


export default class DetailForecast extends Component {
  static displayName = "DetailForecast";

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      slides:[1, 2, 3, 4, 5, 6, 7, 8, 9],
      facilityMaintainDetail: [{
        spindleSpeed: '0.3mm',
        spindleSwing: '0.2mm',
        dynamicBalance: '0.3',
        ballbarData: '4um',
        ballScrewAccuracy: '0.014mm',
        aluspanClear: '已清理',
        boxAndCircuitNeaten: '已整理',
        affirmLubricatingDevice: '正常',
        allRadiatorFanClear:'已清理',
        remark:''
    },
    {
      spindleSpeed: '0.4mm',
      spindleSwing: '0.2mm',
      dynamicBalance: '0.6',
      ballbarData: '7um',
      ballScrewAccuracy: '0.014mm',
      aluspanClear: '已清理',
      boxAndCircuitNeaten: '已整理',
      affirmLubricatingDevice: '异常',
      allRadiatorFanClear:'未清理',
      remark:'清理过程有难度'
    },
    {
      spindleSpeed: '0.2mm',
      spindleSwing: '0.6mm',
      dynamicBalance: '0.3',
      ballbarData: '4um',
      ballScrewAccuracy: '0.015mm',
      aluspanClear: '未清理',
      boxAndCircuitNeaten: '已整理',
      affirmLubricatingDevice: '正常',
      allRadiatorFanClear:'已清理',
      remark:''
    }],
  changePartsDetail:[{
      damagePartsDetail:'20',
      changePartsNumber:'40'
    },
    {
      damagePartsDetail:'10',
      changePartsNumber:'20'
    },
    {
      damagePartsDetail:'50',
      changePartsNumber:'100'
    }],
    };
  }

 
// 打开弹窗
  onOpen = (index, record) => {
    this.setState({
      visible: true,
      dataIndex: index
    });
  };
// 关闭弹窗
  onClose = () => {
    this.setState({
      visible: false
    });
  };
 
  render() {
    const { index, record } = this.props;
    const slides=[1, 2, 3, 4, 5, 6, 7, 8, 9];
    return (
      <div style={styles.editDialog}>
        <Button
          size="small"
          type="primary"
          onClick={() => this.onOpen(index, record)}
        >
          查看上次保养
        </Button>
        <Dialog
          style={ {width: 800} }
          visible={this.state.visible}
          footer={false}
          onClose={this.onClose}
          title="保养详情"
        >
            <p>设备保养明细</p>
            <Table
              dataSource={this.state.facilityMaintainDetail}
             > 
              <Table.Column title="主轴转速水平(标准0.02mm)" dataIndex="spindleSpeed" width={200}/>
              <Table.Column title="主轴摆动(标准0.02mm)" dataIndex="spindleSwing" lock  width={200}/>
              <Table.Column title="动平衡(0.5)" dataIndex="dynamicBalance"  width={200}/>
              <Table.Column title="球杆仪数据(标准20um)" dataIndex="ballbarData"  width={200}/>
              <Table.Column title="丝杆精度(标准0.015mm)" dataIndex="ballScrewAccuracy" width={200}/>
              <Table.Column title="刀库铝屑清理" dataIndex="aluspanClear"  width={200}/>
              <Table.Column title="电柜箱及周边路线整理" dataIndex="boxAndCircuitNeaten"  width={200} />
              <Table.Column title="润滑装置确认" dataIndex="affirmLubricatingDevice"  width={200}/>
              <Table.Column title="各部位散热风扇清理" dataIndex="allRadiatorFanClear" lock="right"  width={200} />
              <Table.Column title="备注" dataIndex="remark"  width={200}/>
            </Table>
          {/* </div> */}
          <div style={{ width: "300px",marginTop:"20px" }}>
           <p>保养更换配件明细</p>
           <Table 
              dataSource={this.state.changePartsDetail}
             > 
              <Table.Column title="配件损坏明细" dataIndex="damagePartsDetail" />
              <Table.Column title="更换配件数量" dataIndex="changePartsNumber"  />
           </Table>
           </div>
           <div style={{ width: "600px",marginTop:"20px" }}>
              <p>前后图片对比</p>
              <Slider slidesToShow={4} arrowPos="outer" dots={false}>
                    {slides.map(item => (
                    <div style={{ width: "25%" }} key={item}>
                      <h4 style={styles.h4}>1</h4>
                    </div>
                    ))}
              </Slider> 
           </div>
        </Dialog>
      </div>
    );
  }
}

const styles = {
  editDialog: {
    display: "inline-block",
    marginRight: "5px"
  },
  h4: {
    margin: "0 5px",
    background: "#4F74B3",
    color: "#fff",
    lineHeight:"150px",
    textAlign: "center",
    marginTop: "0",
    marginBottom: "0",
  }
};
