import React, { Component } from "react";
import {Table, Pagination, Loading} from "@icedesign/base";
import { hashHistory } from "react-router";
import AxiosHttp from "@/utils/AxiosHttp";
import CComponent from "@/components/Common/CComponent";
import DepartmentUtils from "@/utils/DepartmentUtil";
/** 
 * 换刀列表
*/
export default class CTable extends CComponent {

    static displayName = "Block";

    constructor(props) {
        super(props);
        this.state = {
            dataSource:[],
            total:0,
            current: 1,
            flag: true, // 加载
        };
        this.convert();
    }

    //跳转到详情
    forward2Detail(record) {
        let dID = record.dID;
        dID = dID.substring(0, dID.lastIndexOf('_'));
        hashHistory.push({
            pathname: '/technical/celldetail/' + dID,
            state: {
                condition: this.props.condition,
                department: dID,
                record: record,
                type: this.props.type
            }
        });
    }

    /**
     * 转换函数定义
     */
    convert(){
        //转换block
        this.convertBlock = (value, index, record)=>{

            let product = this.convertProduct(value)
            let pinch = this.convertPinch(value);
            let cell = this.convertCell(value);
            let block = DepartmentUtils.getBlock(value);
            let ss = product+ '>'+pinch+'>'+cell;
            return (
                <span
                    style={styles.colorstyle}
                    onClick={this.forward2Detail.bind(this, record)}
                > {ss}
                </span>
            )
        };

        this.convertNormalPer = (value, index, record) => {
            if (!value)return 0;
            let totalCount = record.deal.totalCount;
            value = parseFloat(value);
            value = ((value/totalCount)*100).toFixed(2);//比例
          
            return value;
        }

        this.convertIdleNormalPer = (value, index, record) => {
            if (!value)return 0;
            let totalCount = record.wait.totalCount;
            value = parseFloat(value);
            value = ((value/totalCount)*100).toFixed(2);//比例
            return value;
        }

        this.convertNormalTimePer = (value, index, record)=>{
            if (!value)return 0;
            let totalTime = record.deal.totalTime;
            value = parseFloat(value);
            value = ((value/totalTime)*100).toFixed(2);//比例
            return value;
        }

        this.convertIdleNormalTimePer = (value, index, record)=>{
            if (!value)return 0;
            let totalTime = record.wait.totalTime;
            value = parseFloat(value);
            value = ((value/totalTime)*100).toFixed(2);//比例
            return value;
        }
    }

    /**
     * 分页
     */
    page(current){
        this.setState({
            current
        }, () => {
            this.load()
        });
    }

    /**
     * 切换部门时
     * @param {*} department 
     */
    switchDepartment(department){
       this.load();
    }

    //http://127.0.0.1:3000/api/block/getBlockWorkStatic/
    //root_2018081411941458_2018081412340056_2018081412636566_20181017154620436_7302/2018-11-20/20180824001/1/0/0
    /**
     * 加载数据
     */
    load(){
        let department = DepartmentUtils.changeDepartment();
        let condition = this.props.condition;
        let selectedDate = condition.selectedDate;
        let shift = condition.shift;
        let pageIndex = this.state.current;
        ///block/getBlockWorkSummaryByShift/:departmentid/:date/:shiftID
        let url = '/cell/getWorkSummaryByShift/'+this.props.type + '/' + department + '/'+selectedDate+'/'+shift + '/0/0';
        this.setState({
            flag:true
        })
        AxiosHttp.get(url).then((res)=>{
            this.setState({
                flag:false
            })
            if (res.ok){
                this.update(res.value);
            }
        });
    }

    /**
     * 获取远程数据更新到表格上
     * @param {*} rs 
     */
    update(res){
        if (!res)return;
        let total = res?res.length:0;
        let rs  = res?res:[];
        this.setState({
            dataSource:rs,
            total:total,
        });
    }

    /**
     * 当查询条件被改变
     * @param {*} newProps 
     * @param {*} oldProps 
     */
    willReceiveProps(newProps, oldProps){
        this.props = newProps;
        this.load();
    }

    sort(dataIndex, order){
        let dataSource = this.state.dataSource;
        dataSource.sort(function(a, b) {
            let s = dataIndex.split('.');
            let _a = a[s[0]];
            let _b = b[s[0]]; 
            if(order == "asc"){
                return _a[s[1]] - _b[s[1]];
            }
            else {
                return _b[s[1]] - _a[s[1]];
            }
          });
          this.setState({
            dataSource
          });
    }

    render() {

        return (
            <div className='dev-table'>
            <Loading 
                color="#ccc"
                shape="fusion-reactor"
                visible = {this.state.flag}
                style={{ width: "2595px" }}
                >
                <p className="Block-text hd-Block-text">
                    <span>换刀信息</span>
                    <span>待机信息</span>
                </p>
                
                <Table dataSource={this.state.dataSource}  onSort={this.sort.bind(this)} fixedHeader maxBodyHeight={550}>
                    <Table.Column title="CELL" width={250}   dataIndex="dID" cell={this.convertBlock}/>
                    <Table.Column title="总次数(pcs)" width={120}   dataIndex="deal.totalCount"  sortable/>
                    <Table.Column title="标准时长比例(%)" width={150}  dataIndex="deal.normalTime" cell={this.convertNormalTimePer}/>
                    <Table.Column title="超过上限占比(%)" width={150}  dataIndex="deal.upCount" cell={this.convertNormalPer}/>
                    <Table.Column title="标准比例(%)" width={150}  dataIndex="deal.normalCount"  cell={this.convertNormalPer}/>
                    <Table.Column title="低于下限比例(%)" width={150}  dataIndex="deal.lowCount" cell={this.convertNormalPer}/>
                    {/* <Table.Column title="高于上限次数(pcs)"width={150}  dataIndex="deal.upCount" sortable/> */}
                    {/* <Table.Column title="标准次数(pcs)" width={150}  dataIndex="deal.normalCount" sortable/> */}
                    {/* <Table.Column title="低于下限次数(pcs)" width={150}  dataIndex="deal.lowCount" sortable/>
                    <Table.Column title="高于标准时长(s)" width={150}  dataIndex="deal.upTime" sortable/> */}
                    {/* <Table.Column title="标准总时长(s)" width={150}  dataIndex="deal.normalTime" sortable/>
                    <Table.Column title="低于标准总时长(s)" width={150}  dataIndex="deal.lowTime" sortable/> */}
                    <Table.Column title="最高时长(s)" width={150}  dataIndex="deal.max" sortable/>
                    <Table.Column title="最低时长(s)" width={150}  dataIndex="deal.min" sortable/>
                   

                   <Table.Column title="总次数(pcs)" width={120} dataIndex="wait.totalCount"  sortable/>
                   <Table.Column title="标准时长比例(%)" width={150}  dataIndex="wait.normalTime" cell={this.convertIdleNormalTimePer}/>
                   <Table.Column title="高于标准比例(%)" width={150}  dataIndex="wait.upCount" cell={this.convertIdleNormalPer}/>
                   <Table.Column title="标准比例(%)" width={150}  dataIndex="wait.normalCount" cell={this.convertIdleNormalPer}/>
                   <Table.Column title="低于标准比例(%)" width={150}  dataIndex="wait.lowCount" cell={this.convertIdleNormalPer}/>
                   {/* <Table.Column title="高于上限次数(pcs)" width={150}  dataIndex="wait.upCount"/>
                    <Table.Column title="标准次数(pcs)" width={150}  dataIndex="wait.normalCount"/>
                    <Table.Column title="低于下限次数(pcs)" width={150}  dataIndex="wait.lowCount"/>
                    <Table.Column title="超时时长(s)"width={150}  dataIndex="wait.upTime"/>
                    <Table.Column title="标准总时长(s)"width={150}  dataIndex="wait.normalTime"/> */}
                    <Table.Column title="最高时长(s)" width={150}  dataIndex="wait.max"/>
                    <Table.Column title="最低时长(s)" width={150}  dataIndex="wait.min"/>
                    <Table.Column title="冲突时间(s)" width={150}  dataIndex="wait.conflictTime"/>
                    <Table.Column title="冲突次数(s)" width={150}  dataIndex="wait.conflict"/>
 
                </Table>     
                <div className='pagination'>
                    <span className='total'>共 {this.state.total} 条</span>
                    {/* <Pagination
                        current={this.state.current}
                        onChange={this.page.bind(this)}
                        total={this.state.total}/> */}
                </div>
                </Loading>
            </div>
        );
    }
}

const styles = {
    colorstyle: {
        color: "#2a64e8"
    }
};
