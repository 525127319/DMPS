import React, { Component } from "react";
import {Table, Pagination, Loading} from "@icedesign/base";
import { hashHistory } from "react-router";
import AxiosHttp from "@/utils/AxiosHttp";
import CComponent from "@/components/Common/CComponent";
import DepartmentUtils from "@/utils/DepartmentUtil";
/** 
 * block列表
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
        hashHistory.push({
            pathname: '/technical/opdetail/' + record.dID,
            state: {
                condition: this.props.condition,
                department: record.dID,
                record: record
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
            let ss = product+ '>'+pinch+'>'+cell+'>'+block;
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
            let totalCount = record.reload.totalCount;
            value = parseFloat(value);
            value = ((value/totalCount)*100).toFixed(2);//比例
          
            return value;
        }

        this.convertIdleNormalPer = (value, index, record) => {
            if (!value)return 0;
            let totalCount = record.idle.totalCount;
            value = parseFloat(value);
            value = ((value/totalCount)*100).toFixed(2);//比例
          
            return value;
        }

        this.convertNormalTimePer = (value, index, record)=>{
            if (!value)return 0;
            let totalTime = record.reload.totalTime;
            value = parseFloat(value);
            value = ((value/totalTime)*100).toFixed(2);//比例
            return value;
        }

        this.convertIdleNormalTimePer = (value, index, record)=>{
            if (!value)return 0;
            let totalTime = record.idle.totalTime;
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
        let url = '/block/getBlockWorkSummaryByShift/' + department + '/'+selectedDate+'/'+shift + '/0/0';
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
                style = {{width:"1915px"}}
                >
                <p className="Block-text op-Block-text">
                    <span>换料信息</span>
                    <span>待料信息</span>
                </p>
                <Table dataSource={this.state.dataSource}  onSort={this.sort.bind(this)} fixedHeader maxBodyHeight={550}>
                    <Table.Column title="Block" width={250}  dataIndex="dID" cell={this.convertBlock}/>
                    <Table.Column title="总次数(pcs)" width={100}  dataIndex="reload.totalCount"  sortable/>
                    <Table.Column title="有效产出" width={85}  dataIndex="validCount"/>
                    <Table.Column title="无效产出数" width={95}  dataIndex="invalidCount"/>
                    {/* <Table.Column title="标准时长比例(%)" width={140}  dataIndex="reload.normalTime" cell={this.convertNormalTimePer}/> */}
                    <Table.Column title="高于上限比例(%)" width={140}  dataIndex="reload.upCount" cell={this.convertNormalPer}/>
                    {/* <Table.Column title="标准比例(%)" width={110}  dataIndex="reload.normalCount" cell={this.convertNormalPer}/> */}
                    <Table.Column title="低于下限比例(%)" width={140}  dataIndex="reload.lowCount" cell={this.convertNormalPer}/>
                    {/* <Table.Column title="高于上限次数(pcs)" width={150} dataIndex="reload.upCount"  sortable/>
                    <Table.Column title="标准次数(pcs)" width={130} dataIndex="reload.normalCount"  sortable/>
                    <Table.Column title="低于下限次数(pcs)"width={150}  dataIndex="reload.lowCount"  sortable/> */}
                    {/* <Table.Column title="高于标准时长(s)"width={140}  dataIndex="reload.upTime"  sortable/>
                    <Table.Column title="标准总时长(s)" width={140} dataIndex="reload.normalTime"  sortable/>
                    <Table.Column title="低于标准时长(s)"width={140} dataIndex="reload.lowTime"  sortable/> */}
                    <Table.Column title="最高时长(s)" width={120}  dataIndex="reload.max" sortable/>
                    <Table.Column title="最低时长(s)" width={120}  dataIndex="reload.min" sortable/>

                    <Table.Column title="总次数(pcs)"  width={100} dataIndex="idle.totalCount" sortable/>
                    <Table.Column title="高于标准比例(%)"width={140}   dataIndex="idle.upCount" cell={this.convertIdleNormalPer}/>
                    {/* <Table.Column title="标准比例(%)"width={130}   dataIndex="idle.normalCount" cell={this.convertIdleNormalPer}/> */}
                    <Table.Column title="低于标准比例(%)"width={140}   dataIndex="idle.lowCount" cell={this.convertIdleNormalPer}/>
                    {/* <Table.Column title="标准时长比例(%)" width={150}  dataIndex="idle.normalTime" cell={this.convertIdleNormalTimePer}/> */}
                    {/* <Table.Column title="高于上限次数(pcs)" width={150}  dataIndex="idle.upCount" sortable/>
                    <Table.Column title="标准次数(pcs)" width={140}  dataIndex="idle.normalCount" sortable/>
                    <Table.Column title="低于下限次数(pcs)" width={150}  dataIndex="idle.lowCount" sortable/>
                    <Table.Column title="超时时长(s)"width={130}  dataIndex="idle.upTime" sortable/>
                    <Table.Column title="标准总时长(s)" width={140}  dataIndex="idle.normalTime" sortable/> */}
                    <Table.Column title="最高时长(s)"  width={120}  dataIndex="idle.max" sortable/>
                    <Table.Column title="最低时长(s)"  width={120}  dataIndex="idle.min" sortable/>
                    <Table.Column title="冲突时间(s)"  width={120}  dataIndex="idle.conflictTime" sortable/>
                    <Table.Column title="冲突次数(s)"  width={120}  dataIndex="idle.conflict" sortable/>
                                        
                    {/* <Table.Column title="品名" width="100px"   dataIndex="dID" cell={this.convertProduct}  {this.convertPinch} {this.convertCell}  />
                    <Table.Column title="夹位" width="100px"  dataIndex="dID" cell={this.convertPinch} sortable/>
                    <Table.Column title="CELL" width="100px"   dataIndex="dID" cell={this.convertCell}/> */}
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
