import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Select, Button, Input, Icon, Table, Pagination, Switch,Dialog } from "@icedesign/base";


export default class PartDemand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            current:1,
            pageSize:5,
            total: 0,
            dataSource: [{
                facilityName:'分析设备',
                partNumber: 'S355466',
                partName: '零件1',
                partType: '007',
                demand: 800,
                produceTime: "2018-04-18 2:03:48",  
            },
            {
                facilityName:'医疗设备',
                partNumber: 'B355476',
                partName: '零件2',
                partType: '008',
                demand: 400,
                produceTime: "2018-05-18 2:03:48",  
            },
            {
                facilityName:'自动化设备',
                partNumber: 'X355466',
                partName: '零件3',
                partType: '009',
                demand: 800,
                produceTime: "2018-07-18 2:03:48",  
            }
            ],
            detailData:[{
                facilityName:'分析设备',
                facilityType:'I类',
                needTime:'8'
            },{
                facilityName:'医疗设备',
                facilityType:'II类',
                needTime:'8'
            },
            {
                facilityName:'自动化设备',
                facilityType:'II类',
                needTime:'8'
            }
            ],
           
        };
    }
   
    //关闭弹出框
    onClose = () => {
        this.setState({
          visible:false
        });
    };

    //文本按钮
    renderOperator = ( value,index, record) => {
        return (
            <div>
                 <Button shape="text" onClick={this.handleText}>{record.demand}</Button>
            </div>
        );
    };

    //弹出框
    handleText=()=>{
        this.setState({
            visible:true
          });
    }
    
    handleChange(value) {
        // console.log(value);
    }
     render() {
         //自定义弹出框按钮
        // const footer = (
        //     <a onClick={this.onClose} href="javascript:;">
        //       Close
        //     </a>
        // );
        return (
            <div>
                <IceContainer style={styles.IceContainer}>
                    <span>保养管理>零件需求表</span>
                </IceContainer>
                <IceContainer>
                    <Table
                        dataSource={this.state.dataSource}
                    >
                        <Table.Column title="设备名称" dataIndex="facilityName" />
                        <Table.Column title="零件编号" dataIndex="partNumber" />
                        <Table.Column title="零件名称" dataIndex="partName" />
                        <Table.Column title="零件型号" dataIndex="partType" />
                        <Table.Column 
                            title="需求量"
                            cell={this.renderOperator}
                        />
                         <Table.Column title="产生时间" dataIndex="produceTime" />
                    </Table>
                    <Dialog
                        style={{ width: 600 }}
                        visible={this.state.visible}
                        onClose={this.onClose}
                        footer={false}
                        title="需求量详情"
                        >
                        <Table 
                            dataSource={this.state.detailData}
                            > 
                            <Table.Column title="设备名称" dataIndex="facilityName" />
                            <Table.Column title="设备类型" dataIndex="facilityType" />
                            <Table.Column title="大概需要时间" dataIndex="needTime" />
                        </Table> 
                        <div style={styles.pagination}>
                            <Pagination
                                total={this.state.total}
                                current={this.state.current}
                                pageSize={this.state.pageSize}
                                onChange={this.handleChange}
                            />
                        </div>
                    </Dialog>  
                </IceContainer>
            </div>
        )
    }
}

const styles = {
    IceContainer: {
        marginBottom: "20px",
        minHeight: "auto",
        display: "flex",
        justifyContent: "space-between"
    },
    pagination: {
        float: "right",
        // paddingTop: "26px"
    },
    search: {
        width: '400px',
        float: 'left',
        display: 'flex',
        justifyContent: 'space-between'
    }

};
