import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import AddPart from './AddPart';
import EditPart from './EditPart';
import DeletePart from './DeletePart';
import { Select, Button, Input, Icon, Table, Pagination } from "@icedesign/base";

export default class PartDefined extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [{
                type: '制动系配件',
                partName: '制动阻力器',
                model: 'N288',
                version: 'V1.0',
                contact: '黎帅',
                website: 'www.zhidong.com',
                instructions: '制动阻力器说明书',
                img: '1.jpg',
                supplier: '博世bosch'
            },
            {
                type: '传动系配件',
                partName: '离合器拉线套管',
                model: 'N289',
                version: 'V2.0',
                contact: '超帅',
                website: 'www.liheqi.com',
                instructions: '离合器拉线套管说明书',
                img: '2.jpg',
                supplier: '博格华纳borgwarner'

            },
            {
                type: '发动系统配件',
                partName: '涡轮增压器',
                model: 'H866',
                version: 'V5.0',
                contact: '里德里克',
                website: 'www.zyq.com',
                instructions: '涡轮增压器说明书',
                img: '3.jpg',
                supplier: '大陆集团 continental'

            }
            ],
            total: 0
            
        };
    }
    // 下拉框选择
    onSelect(type, value) {

    }


    renderOperator = (value, index, record) => {
        return (
            <div>
                <EditPart
                    index={index}
                    record={record}
                    getFormValues={this.getFormValues}
                />
                <DeletePart handleRemove={this.handleRemove.bind(this, record)}>
                    删除
            </DeletePart>
            </div>
        );
    };
    // 父组件的函数给子组件回调传参（新增）
    updateData(newArray) {
        this.setState({
            dataSource: newArray
        })
    }
    // 获取表单值（编辑）
    getFormValues = (dataIndex, values) => {
        const { dataSource } = this.state;
        dataSource[dataIndex] = values;
        this.setState({
            dataSource
        });
    };
    // 删除
    handleRemove = record => {
        console.log(record, 'oopp')
        const { dataSource } = this.state;
        let index = -1;
        dataSource.forEach((item, i) => {
            if (item === record) {
                index = i;
            }
        });
        if (index !== -1) {
            dataSource.splice(index, 1);
            this.setState({
                dataSource
            });
        }
    };


    render() {
        const aLabeljump = (value, index, record) =>{
            // console.log(aLabeljump)
            return <a href={value} style={styles.astyle}>{value}</a>;
        }
        const onChangeName = value => {
            // console.log('valueName:', value);
        };
        const onChangeModel = value => {
            // console.log('valueModel:', value);
        };
        return (
            <div>
                <IceContainer style={styles.IceContainer}>
                    <div style={styles.search}>
                        <Select
                            placeholder="请选择类型"
                            size='large'
                            onChange={this.onSelect.bind(this)}
                            style={{ width: '180px' }}
                        >
                            <Option value="one">制动系配件</Option>
                            <Option value="two">传动系配件</Option>
                            <Option value="three">发动系统配件</Option>
                        </Select>
                        <Input defaultValue="名称" size='large' hasClear onChange={onChangeName} />
                        <Input defaultValue="型号" size='large' hasClear onChange={onChangeModel} />
                        <Button type="normal" size='large'>
                            查询
                        </Button>
                    </div>


                    <AddPart updateData={newArray => this.updateData(newArray)} dataSource={this.state.dataSource} />
                </IceContainer>
                <IceContainer>
                    {/* <p>
                        <Button onClick={this.clear.bind(this)}>Clear Selection</Button>&nbsp;
                     </p> */}
                    <Table
                        dataSource={this.state.dataSource}
                        hasBorder={false}
                    >
                        <Table.Column title="类型" dataIndex="type" />
                        <Table.Column title="名称" dataIndex="partName" />
                        <Table.Column title="型号" dataIndex="model" />
                        <Table.Column title="版本" dataIndex="version" />
                        <Table.Column title="联系人" dataIndex="contact" />
                        <Table.Column title="网址" dataIndex="website" cell={aLabeljump}/>
                        <Table.Column title="说明书" dataIndex="instructions" />
                        <Table.Column title="图片" dataIndex="img" />
                        <Table.Column title="供应商" dataIndex="supplier" />
                        <Table.Column
                            title="操作"
                            cell={this.renderOperator}
                            lock="right"
                            width={140}
                        />

                    </Table>
                    <div style={styles.pagination}>
                        <Pagination
                            total={this.state.total}
                            pageSize={this.props.pageSize}
                            onChange={this.handleChange}
                        />
                    </div>
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
        textAlign: "right",
        paddingTop: "26px"
    },
    search: {
        width: '700px',
        float: 'left',
        display: 'flex',
        justifyContent: 'space-between'
    },
    astyle:{
        width: "156px",
        minHeight: "24px",
        display:"block",
        color:"#666666"
    }

};
