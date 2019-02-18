import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Select, Button, Input, Icon, Table, Pagination, Switch } from "@icedesign/base";
import AddStrategy from './AddStrategy';
import EditStrategy from './EditStrategy';
import DeleteStrategy from './DeleteStrategy';
import AxiosHttp from '../../../utils/AxiosHttp';
import Loadings from '@/components/Loadings/Loadings' 
export default class StrategyDefined extends Component {
    static defaultProps = {
        //本界面的默认配置，会合并到props里，但这里的属性为只读
        pageSize: 10
    };

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            selectData: [],
            total: 0,
            company: '',
            devType: '',
            show : true
        };
        this.param = {pageIndex:1}; // 默认第一页
         this.searchObj = {};
        this.handleChange = this.handleChange.bind(this);
    }
    // 下拉框选择
    onSelect(type, value) {
        // console.log(type,value,'下拉框选中的值')
        // this.setState({
        //     company : value.label,
        // })
       
            this.searchObj.company = value.label
        
    }
    onChange(value,obj) {
        // console.log('value', value);
        // console.log('obj', obj.label);
            // this.setState({
            //     devType: obj.label
            // })
            this.searchObj.devType = obj.label
      
      }
    //  回显数据
    componentDidMount(){
        AxiosHttp.get('strategy/list/'+this.param.pageIndex)
        .then(res=>{
            if(res.ok){
                this.setState({
                     dataSource:res.value.rs,
                     total:res.value.total,
                     selectData:res.value.rs,
                     show : false
                })
            }
        }).catch(error=>{
            console.log(error);
        })
    }
    // 激活索引
    handleChange(pageIndex){
        this.param.pageIndex = pageIndex;
        this.componentDidMount();
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
        AxiosHttp.post("/strategy/delete/" + this.param.pageIndex + "/" + record._id, {company: record.company})
        .then(this.handleChange).catch(error=>{
            console.log(error)
        })
        
    };
    // 查询
    handleClick = () => {
        // AxiosHttp.post('/strategy/search',{'company':this.state.company,'devType':this.state.devType})
        AxiosHttp.post('/strategy/search',this.searchObj)
        .then(res=>{
            let {ok} = res;
            if(ok){
                this.setState({
                    dataSource: res.value,
                    
                })
            }
        })
    }


    renderOperator = (value, index, record) => {
        return (
            <div>
                <EditStrategy
                    index={index}
                    record={record}
                    getFormValues={this.getFormValues}
                />
                <DeleteStrategy handleRemove={this.handleRemove.bind(this, record)}>
                    删除
            </DeleteStrategy>
            </div>
        );
    };




    render() {
        const onChangeName = value => {
            // console.log('valueName:', value);
        };
        const onChangeModel = value => {
            // console.log('valueModel:', value);
        };
         const selectData =  this.state.selectData;
        //  console.log('selectData',selectData)
        return (
            <div>
           
                <IceContainer style={styles.IceContainer}>
                    <div style={styles.search}>
                        <Select
                            placeholder="请选择工厂"
                            size='large'
                            onChange={this.onSelect.bind(this)}
                            style={{ width: '180px' }}
                        >
                            {
                            selectData.map(item=>{
                                    return  <Option key={item._id} value={item._id}>{item.company}</Option>
                                })
                            }
                        </Select>
                        <Select
                            placeholder="请选择设备类型"
                            size='large'
                            onChange={this.onChange.bind(this)}
                            style={{ width: '180px' }}
                        >
                            {
                                selectData.map(item=>{
                                    return <Option value={item._id} key={item._id}>{item.devType}</Option>
                                })
                            }
                        </Select>
                        <Button type="normal" size='large' onClick={()=>this.handleClick()}>
                            查询
                        </Button>
                    </div>

                    <AddStrategy handleChange={this.handleChange} param={this.param} />
                </IceContainer>
                <IceContainer>
                    {/* <p>
                        <Button onClick={this.clear.bind(this)}>Clear Selection</Button>&nbsp;
                </p> */}

                     {/* 加载的loading */}
                     {/* <Loadings  show={this.state.show}/>                 */}
                    <Table
                        dataSource={this.state.dataSource}
                        hasBorder={false}
                    >
                        <Table.Column title="工厂" dataIndex="company" />
                        <Table.Column title="设备类型" dataIndex="devType" />
                        <Table.Column title="保养名称" dataIndex="maintenanceName" />
                        <Table.Column title="工作时保养时长(小时)" dataIndex="workingTime" />
                        <Table.Column title="空闲时保养时长(小时)" dataIndex="freeTime" />
                        <Table.Column title="零件" dataIndex="part" />
                        <Table.Column title="启用" dataIndex="enable" />
                        <Table.Column title="备注" dataIndex="note" />
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
        width: '500px',
        float: 'left',
        display: 'flex',
        justifyContent: 'space-between'
    }

};
