import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import Status from './DeviceBasisInfo';
import { Button, Icon,Table ,Pagination,Moment,Dialog} from "@icedesign/base";
import {evn} from '../../../../utils/Config';
import AxiosHttp from "../../../../utils/AxiosHttp";
import ShiftUtil from "@/utils/ShiftUtil";

export default class HistoryProgramDetail extends Component {
    static displayName = 'HistoryProgramDetail';
    static defaultProps = {
        //本界面的默认配置，会合并到props里，但这里的属性为只读
        pageSize: 10
    };
    constructor(props) {
        super(props);
        this.param = {pageIndex: 1};//当前页
        this.state = {
            visible: false,
            hyProDetailData:[],
            total: 0,//总条数
        }
    }

     //发请求获取历史程序详情数据
     getList(){
        let params={
            programName:this.props.programName,
            devID:this.props.devID,
            pageIndex:this.param.pageIndex
        }
        AxiosHttp.post("/singledevprogct/getHyProDetail",params)
        .then(this.handleResponse)
        .catch(error => {
          console.log(error);
        });
      }

      handleResponse=(res)=>{
        this.setState({
            hyProDetailData: res.value.rs,
            total:res.value.total
        });
      } 

    handleChange=(pageIndex)=>{
        this.param.pageIndex = pageIndex;
        this.getList();
      }
      
    // componentWillMount() {
    //     this.getList();
    //  }

    //打开弹窗 
    onOpen = () => {
        this.setState({
          visible: true
        },()=>{
            this.getList();
        });
      };

    // 关闭弹窗
    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    render(){
        const formTime=(value,index,record)=>{
            return (
            //   <span>{Moment(value*1000).format('YYYY-MM-DD')}</span>
            <span>{ ShiftUtil.updateDate2ShiftDate(value)}</span>
            )
          }
        return(
            <div>
                <Button size="small" type="primary" onClick={() => this.onOpen()}>查看详情</Button>
                <Dialog
                    style={{ width: 800}}
                    visible={this.state.visible}
                    onClose={this.onClose}
                    footer={false}
                    title="历史程序详情"
                    onOpen={this.onOpen}
                    >
                    <Table 
                        dataSource={this.state.hyProDetailData}
                        fixedHeader
                        > 
                        <Table.Column title="日期" dataIndex="time" cell={formTime} style={styles.public}/>
                        <Table.Column title="最大CT(s)" dataIndex="data.max_ct" style={styles.public}/>
                        <Table.Column title="最小CT(s)" dataIndex="data.min_ct" />
                        <Table.Column title="平均CT(s)" dataIndex="data.avg_ct" />
                        <Table.Column title="总加工次数" dataIndex="data.count" />
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
                </Dialog>  
            </div>
        )
    }
}
const styles = {
    pagination: {
        float: "right",
        paddingTop: "20px"
    },
    public:{
        cursor:"auto",
    }
}