import React ,{Component} from "react"
import { Table, Button, Icon, Pagination,Dialog} from "@icedesign/base";
export default class ContentBody extends Component {
                 constructor(props) {
                   super(props);
                   this.state = { 
                     current: 1 ,//分页当前页面
                     };
                 }
                 handleChange=(current)=> { //分页当前页面
                   this.setState({ current });
                 }
                 downLoadProgram=(value, index, record)=>{//下载程序
                 }
                 render() {
                   const onChange = function(...args) { //获取选中元素
                     },
                     getData = () => { //模拟数据
                       let result = [];
                       for (let i = (this.state.current-1) * 10 + 1; i < this.state.current*10+1; i++) {
                         result.push({
                           id: `ABC${i}`,
                           name: `CNC机床${i}`,
                           program: "split",
                           beta: `${i}.2.01`,
                           author: "程序员",
                           writeTime: `${new Date().toLocaleString()}`,
                           writeStatus: `${
                             i % 2
                               ? "正在读取"
                               : "读取完成"
                           }`
                         });
                       }
                       return result;
                     },
                     rowSelection = { onChange: onChange, getProps: record => {} };
                     const downLoad=(value, index, record)=>{
                        return <Button type='primary' onClick={()=>{this.downLoadProgram(value, index, record)}}>下载</Button>
                     }
                   return <div className="main-body">
                            {/* 设备列表 */}
                            <Table dataSource={getData()} rowSelection={rowSelection}>
                              <Table.Column title="设备名称" dataIndex="name" />
                              <Table.Column title="现有程序" dataIndex="program" />
                              <Table.Column title="版本" dataIndex="beta" />
                              <Table.Column title="开发者" dataIndex="author" />
                              <Table.Column title="写入时间" dataIndex="writeTime" />
                              <Table.Column title="读取进度" dataIndex="writeStatus" />
                              <Table.Column title="操作" cell={downLoad} />
                            </Table>
                            {/* 分页 */}
                            <Pagination total={110}   current={this.state.current} onChange={this.handleChange} />
                     </div>;
                 }
               } 