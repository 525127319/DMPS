import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import Status from './DeviceBasisInfo';
import { Button, Icon,Table ,Pagination,Moment} from "@icedesign/base";
import {evn} from '../../../../utils/Config';
import AxiosHttp from "../../../../utils/AxiosHttp";
import HistoryProgramDetail from './HistoryProgramDetail';

export default class HistoryProgram extends Component {
    static displayName = 'HistoryProgram';
    static defaultProps = {
        //本界面的默认配置，会合并到props里，但这里的属性为只读
        pageSize: 10
    };
    constructor(props) {
        super(props);
        this.param = {pageIndex: 1};//当前页
        this.state = {
            historyProgramData:[],
            total: 0,//总条数
        }
    }

    //发请求获取历史程序数据
    getHistoryProgram(){
        AxiosHttp.get("/singledevprogct/getHistoryProgram/"+this.props.devID+"/"+this.param.pageIndex)
        .then(this.handleResponse)
        .catch(error => {
        console.log(error);
        });  
    }

    handleResponse = (res)=> {
        this.setState({
            //更主狀態，必須通這此方法，這樣react才能監聽到，重新調用render方法。
            historyProgramData: res.value.rs,
            total: res.value.total
        });
    };

    //分页
    handleChange=(pageIndex) =>{
        // react 中必须通过 setstate 更新 render才会更新渲染
        this.param.pageIndex = pageIndex;
        this.getHistoryProgram();
    }
      
    componentDidMount() {
        this.getHistoryProgram();
     }

     renderOperator = (value, index, record) => {
        return (
            <div>
                <HistoryProgramDetail devID={this.props.devID} programName={record._id}/>
            </div>   
        );
    };

    render(){
        return(
            <div>
                <IceContainer>
                    <p>历史程序</p>
                    <Table dataSource={this.state.historyProgramData}  maxBodyHeight={100}>
                        <Table.Column title="程序名" dataIndex="_id" style={styles.public}/>
                        <Table.Column title="最大CT(s)" dataIndex="max_ct" style={styles.public}/>
                        <Table.Column title="最小CT(s)" dataIndex="min_ct"/>
                        <Table.Column title="总加工次数" dataIndex="count" />
                        <Table.Column title="操作"  cell={this.renderOperator}/>
                    </Table>
                    <div className='pagination'>
                        <span  className='total'>共 {this.state.total} 条</span>
                        <Pagination
                        size="small"
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
 
    public:{
        cursor:"auto",
    }
}