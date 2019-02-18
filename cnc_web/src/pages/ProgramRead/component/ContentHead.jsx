import React, {Component} from 'react'
import { Form, Input, Select, Field ,Button,Icon , Dialog,Table,Pagination, TreeSelect } from "@icedesign/base";
import './ContentHead.scss'
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
};
const treeData = [
  {
    label: "设备名称1",
    value: "A1",
    selectable: false,
    children: [
      {
        label: "设备1",
        value: "A2"
      },
      {
        label: "设备2",
        value: "A3"
      }
    ]
  },
  {
    label: "设备名称2",
    value: "B1",
    selectable: false,
    children: [
      {
        label: "名称3",
        value: "B2"
      },
      {
        label: "名称4",
        value: "B3"
      }
    ]
  }
];
 
export default class ContentHead extends Component {
                 constructor(props) {
                   super(props);
                   this.state = {
                      visible: false, //写入状态
                       };
                    this.field = new Field(this);
                 }
                 readProgram=()=>{ //读取
                  this.setState({ visible: true });
                 }
                 onClose = () => { //关闭读取弹框
                   this.setState({ visible: false });
                 };
                 onChange = (ids, records) => { //获取选中的值
                   let { rowSelection } = this.state;
                   rowSelection.selectedRowKeys = ids;
                  //  console.log("onChange", ids, records);
                   this.setState({ rowSelection });
                 };
                 handleChange(value, data) {
                  // console.log(value, data);
                }
              
                handleSearch(keyword) {
                  // console.log(keyword);
                }
          
                 search=()=>{ //查询数据
                    // console.log(123)
                    // console.log(this.field.getValues())
                 }
                 render() {
                  const init = this.field.init;
                  const footer = (
                    <Button onClick={this.onClose}  type='primary'>
                        确认
                    </Button>
                  );
                   return <div className="control-bar">
                            <div className="search">
                              <Form direction="hoz" className="demo-ctl" field={this.field}>
                                <FormItem {...formItemLayout}>
                                  {/* <Select placeholder="设备名称" {...init("equipmentName")}>
                                        <div value="CNC机床1">CNC机床1</div>
                                        <div value="CNC机床2">CNC机床2</div>
                                        <div value="CNC机床3">CNC机床3</div>
                                    </Select> */}
                                    <TreeSelect {...init('equipmentName')}
                                    autoWidth
                                    showSearch
                                    treeDefaultExpandAll
                                    dataSource={treeData}
                                    onChange={this.handleChange}
                                    onSearch={this.handleSearch}
                                    style={{ width: 200 }}
                                    placeholder="设备名称"
                                  />
                                </FormItem>
                                <FormItem {...formItemLayout}>
                                  {/* <Select placeholder="程序名称" {...init("projectName")}>
                                      <div value="program1">program1</div>
                                      <div value="program2">program2</div>
                                      <div value="program3">program3</div>
                                      <div value="program4">program4</div>
                                  </Select> */}
                                  <TreeSelect {...init('progrramName')}
                                    autoWidth
                                    showSearch
                                    treeDefaultExpandAll
                                    dataSource={treeData}
                                    onChange={this.handleChange}
                                    onSearch={this.handleSearch}
                                    style={{ width: 200 }}
                                    placeholder="程序名称"
                                  />
                                </FormItem>
                                <FormItem {...formItemLayout}>
                                  <Select placeholder="部门" {...init("deparment")} style={{ width: 200 }}>
                                      <div value="IT部">IT部</div>
                                      <div value="人事部">人事部</div>
                                      <div value="事业部">事业部</div>
                                  </Select>
                                </FormItem>
                                <FormItem {...formItemLayout}>
                                    <Button onClick={ this.search}>查询</Button>
                                </FormItem>
                              </Form>
                            </div>

                            <Button className="write-btn" onClick={this.readProgram}>读取  </Button>
                              <Dialog className='confirm'
                                visible={this.state.visible}
                                footer={footer}
                              >
                                <p>读取请求已发送，请耐心等待...</p>
                              </Dialog>
                     </div>;
                 }
               }