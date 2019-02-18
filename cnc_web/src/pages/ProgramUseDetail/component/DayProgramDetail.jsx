import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Button, Icon,Table ,Pagination,Moment,Dialog, moment} from "@icedesign/base";
import AxiosHttp from "@/utils/AxiosHttp";
import DeviceinfoUtil from "@/utils/DeviceinfoUtil";
import { format } from 'path';


export default class DayProgramDetail extends Component {
    static defaultProps = {
        pageSize: 10
    };
    static displayName = 'DayProgramDetail';
    constructor(props) {
        super(props);
        this.param = {pageIndex: 1};//当前页
        // this.props.time = moment(this.props.time*1000).format('YYYY-MM-DD')
        this.state = {
            total: 0,//总条数
            visible: false,
            dayProgramDetailData:[]
        }
    }

   
     //发请求获取当天程序详情
     getList(){
        
        let data ={
            progName:this.props.programName,
            pageIndex:this.param.pageIndex,
            time : this.props._searchDay
        }
        AxiosHttp.post("/singledevprogct/getDayProgramDetail",data)
        .then(this.handleResponse)
        .catch(error => {
          console.log(error);
        });
      }

      handleResponse=(res)=>{
        console.log(res,'res');
        this.setState({
            dayProgramDetailData: res.value.rs,
            total: res.value.total
        });
      } 
    
    //分页
    handleChange=(pageIndex) =>{
        // react 中必须通过 setstate 更新 render才会更新渲染
        this.param.pageIndex = pageIndex;
        this.getList();
    }
     

    //打开弹窗 
    onOpen = () => {
        this.getList();
        this.setState({
          visible: true
        });
      };

    // 关闭弹窗
    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    render(){
        const formatSecond = (value) => {
            if(value){
                return (
                    <span>{value}</span>
                )
            }else{
                return (
                    <span>无</span>
                ) 
            }
            
        }

        const toName = (id) => {
            let node = DeviceinfoUtil.getDeviceByDevid(id);
            return (<span>{node.name}</span>);
        }
        let {deviceCount} = this.props;
        return(
            
            <div>
                <a size="small" type="primary" onClick={() => this.onOpen()}>{deviceCount}</a>
                <Dialog
                    style={{ width: 700}}
                    visible={this.state.visible}
                    onClose={this.onClose}
                    footer={false}
                    title="设备详情"
                    //onOpen={this.onOpen}
                    >
                    <Table 
                        dataSource={this.state.dayProgramDetailData}
                        fixedHeader
                        > 
                        <Table.Column title="设备名称" dataIndex="dev_id" cell={toName}/>
                        <Table.Column title="最大CT(s)" dataIndex="data.max_ct"  cell={formatSecond}/>
                        <Table.Column title="最小CT(s)" dataIndex="data.min_ct" cell={formatSecond}/>
                        <Table.Column title="总加工次数"  dataIndex="data.count"/>
                    </Table>
                    <div className='pagination'>
                         <span className='total'>共 {this.state.total} 条</span>
                        <Pagination   
                        total={this.state.total}
                        pageSize={this.props.pageSize}
                        onChange={this.handleChange} />
                    </div> 
                </Dialog>  
            </div>
        )
    }
}
 