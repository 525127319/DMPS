import React, {Component} from 'react'
import {moment, Table, Pagination, Moment} from "@icedesign/base";
import {hashHistory} from 'react-router';
import toolInfoUtil from "@/utils/ToolInfoUtil"
import DepartmentUtil from "@/utils/DepartmentUtil"
import DeviceinfoUtil from "@/utils/DeviceinfoUtil"
import TableTree from "react-table-tree";
import './ToolTable.scss';
import Uuid from "@/utils/Uuid.js"
import TimeUtil from '@/utils/TimeUtil';
const styles = {
    minWidth: '2000px'
};
export default class ToolTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
          
        };
        this.type = this.props.type;

    }
            
    render(){
        let sOflag = ['无操作', '只优化', '只滞后', '优化滞后'];
        let sRflag = ['无操作', '优化成功', '优化失败', '滞后成功', '滞后失败', '优化滞后成功', '只优化成功', '只滞后成功', '优化滞后失败'];
        let tlflag = ['无变化', '优化过', '滞后过', '优化滞后过'];
        let oFlag = 0;
        let rFlag = 0;
        styles.minWidth = '2000px';
        if(this.type === 5) {
            styles.minWidth = '2599px';
        }
        let product = null, process = null, cell = null, toolNo = null, cutter = null ,cutter1 = null, cutter2 = null ,block=null;
        const optimize = [
            {
                title:'厂区',
                bodyRender: item => {
                    return DepartmentUtil.getFactory(item.department);
                },
                width: "78px"
            },
            {
                title:'楼层',
                bodyRender: item => {
                    return DepartmentUtil.getBuilding(item.department);
                },
                width: "100px"
            },
            {
                title:'机种',
                bodyRender: item => {
                    product = DepartmentUtil.getProduct(item.department);
                    return product;
                },
                width: "120px"
            },
            {
                title:'夹位',
                bodyRender: item => {
                    process = DepartmentUtil.getPinch(item.department);
                    return process;
                },
                width: "100px"
            },
            {
                title:'CELL',
                bodyRender: item => {
                    cell = DepartmentUtil.getCell(item.department);
                    return cell;
                },
                width: "60px"

            },
            {
                title:'BLOCK',
                bodyRender: item => {
                    return DepartmentUtil.getBlock(item.department);;
                },
                width: "60px"

            },
            // {
            //     title: "部门",
            //     name: "department",
            //     // name: "name",
            //     bodyRender: item => {
            //         let dp = item.department;
            //         if (!dp)return;
            //         dp = dp.split('_');
            //         let name = '', d, tmp;
            //         dp.forEach((element, index) => {
            //             if (index > 0){
            //                 tmp = tmp+'_'+element;
            //                 d = DepartmentUtil.getDepartmentById(tmp);
            //                 if (!name){
            //                     name = d;
            //                 } else {
            //                     name = name + '>' + d;
            //                 }
            //             } else {
            //                 tmp = element;
            //             }
            //         });
            //         return name;
            //     },
            //     width: "300px"
            // },
            // {
            //     title: "品牌",
            //     name: "brand",
            //     bodyRender: item => {
            //         let dd = DeviceinfoUtil.getDeviceByDevid(item.dev_id); 
            //         if (!dd)return ''; 
            //         return dd.brand_name;
            //     },
            //     // name: "name",
            //     width: "100px"
            // },
            {
              title: "设备名称",
              name: "name",
              width: "100px"
            },
            {
                title: "执行类型",
                // name: "opti_flag",
                bodyRender: item => {
                    if(item.hasOwnProperty("isOptReq") && item.hasOwnProperty("isDelayReq")){
                        oFlag = 0;
                        if(item.isOptReq)
                            oFlag |= 1;
                        if(item.isDelayReq)
                            oFlag |= 2;
                        return sOflag[oFlag]
                    }
                  return "";
                },
                width: "100px"
            },
            {
                title: "服务返回",
                // name: "optMsg",
                bodyRender: item => {//shank_type
                   if(item.hasOwnProperty("isOptReq") && item.hasOwnProperty("isDelayReq") && item.hasOwnProperty("optResult") && item.hasOwnProperty("delayResult")){
                        oFlag = 0;
                        if(item.isOptReq)
                            oFlag |= 1;
                        if(item.isDelayReq)
                            oFlag |= 2;
                        switch(oFlag){
                            case 0:
                                rFlag = 0;
                                break;
                            case 1:
                                rFlag = (item.optResult? 1: 2);
                                break;
                            case 2:
                                rFlag = (item.delayResult? 3: 4);
                                break;
                            case 3:
                                if(item.optResult && item.delayResult){
                                    rFlag = 5;
                                } else if(item.optResult){
                                    rFlag = 6;
                                } else if(item.delayResult){
                                    rFlag = 7;
                                } else {
                                    rFlag = 8;
                                }
                                break;
                        }
                        return sRflag[rFlag];
                    }
                    return ""
                },
                width: "100px"
            },
            {
                title: "刀具表现",
                name: "opti_flag",
                bodyRender: item => {//shank_type   
                if(item.hasOwnProperty("opti_flag") ){
                    return tlflag[item.opti_flag];
                }
                return "";                
   
                },
                width: "100px"
            },
            {
              title: "刀具号",
              name: "no",
              bodyRender: item => {
                let n = item.no;
                if (n){

                    // n = parseInt(n);
                    // if (n < 10){
                    //     n = '0'+n;
                    // }
                    toolNo =  'T'+n;
                }
                   
                else 
                    toolNo = '';
                return toolNo;
              },
              width: "120px"
            },
            {
                title: "原始剩余(pcs)",
                name: "origin_count",
                bodyRender: item => {
                    return item.origin_count;       
                },
                width: "110px"
              },
              {
                title: "原始剩余(h)",
                name: "origin_life",
                bodyRender: item => {//knife_name
                    return item.origin_life;
                },
                width: "110px"
              },
              {
                title: "优化后剩余(pcs)",
                name: "optimize_count",
                bodyRender: item => {//shank_type
                    return item.optimize_count;
                },
                width: "110px"
              },
            {
              title: "优化后剩余(h)",
              name: "optimize_life",
              bodyRender: item => {
                  return item.optimize_life;
                },
              width: "110px"
            },
            {
              title: "滞后后剩余(pcs)",
              name: "actual_count",
              bodyRender: item => {
                return item.actual_count;
              },
              width: "110px"
            },
            {
                title: "滞后后剩余(h)",
                name: "actual_life",
                width: "110px",
                bodyRender: item => {
                  return item.actual_life;
                }
              },
              {
                title: "标准寿命(pcs)",
                // name: "total_life",
                width: "100px",
                bodyRender: item => {
                    if(item.total_count){
                        return item.total_count;
                    }
                    return "";  
                }
              },
            {
              title: "标准寿命(h)",
              name: "total_life",
              width: "100px"
            },
          
            // {
            //     title: "当前寿命(次)",
            //     bodyRender: item => {
            //         let total_count = item['total_count'];
            //         let residual_count = item['residual_count'];
            //         if (total_count && residual_count){
            //             return total_count - residual_count;
            //         }
            //         return '';
            //     },
            //     width: "100px"
            //   },
            {
                title: "服务返回优化日志",
                name: "optMsg",
                width: "120px",
                bodyRender: item => {
                    if(item.hasOwnProperty("optMsg")){
                       return item.optMsg
                    }
                    return "";
                }
              },
              {
                title: "服务返回滞后日志",
                name: "delayMsg",
                width: "120px",
                bodyRender: item => {
                    if(item.hasOwnProperty("delayMsg")){
                        return item.delayMsg
                    }
                   return "";
                }
              },

            // {
            //   title: "记录产生时间",
            //   name: "genTime",
            //   width: "150px",
            //   bodyRender: item => {
            //     if(item.genTime){
            //         return TimeUtil.formatDateByFormat(item.genTime*1000, TimeUtil.format4);
            //     }else{
            //         return "";
            //     }
               
            // }
            // },
            {
                title: "更新时间",
                name: "update",
                width: "150px",
                bodyRender: item => {
                    if(item.hasOwnProperty("update")){
                        return TimeUtil.formatDateByFormat(item.update*1000, TimeUtil.format4);
                    }else{
                        return "";
                    }
                    
                }
            },
            // {
            //   title: "原始剩余值更新时间",
            // //   name: "orgTime",
            //   width: "150px",
            //   bodyRender: item => {
            //     if(item.hasOwnProperty("orgTime")){
            //         return TimeUtil.formatDateByFormat(item.orgTime*1000, TimeUtil.format4);
            //     }else{
            //         return ""
            //     }
                
            //     }
            // },
            {
              title: "优化更新时间",
              name: "optTime",
              width: "150px",
              bodyRender: item => {
                  if(item.hasOwnProperty('optTime')){
                    if(item.optTime == 0)
                        return 'NA'
                    else
                        return TimeUtil.formatDateByFormat(item.optTime*1000, TimeUtil.format4);
                  }
                return ""; 
                }
            },
            {
              title: "滞后更新时间",
              name: "delayTime",
              width: "150px",
              bodyRender: item => {
                  if(item.hasOwnProperty('delayTime')){
                    if(item.delayTime == 0){
                        return 'NA'
                     }else {
                        return TimeUtil.formatDateByFormat(item.delayTime*1000, TimeUtil.format4);
                     }
                  }
                return ""; 
                }
            },
            // {
            //     title: "操作",
            //     name: "id",
            //     width: "100px",
            //     bodyRender: item => {
            //         return <a>操作1</a>;
            //     }
            // },
          ];
        const columns = [
            {
                title:'厂区',
                bodyRender: item => {
                    return DepartmentUtil.getFactory(item.department);
                },
                width: "78px"
            },
            {
                title:'楼层',
                bodyRender: item => {
                    return DepartmentUtil.getBuilding(item.department);
                },
                width: "100px"
            },
            {
                title:'机种',
                bodyRender: item => {
                    product = DepartmentUtil.getProduct(item.department);
                    return product;
                },
                width: "120px"
            },
            {
                title:'夹位',
                bodyRender: item => {
                    process = DepartmentUtil.getPinch(item.department);
                    return process;
                },
                width: "100px"
            },
            {
                title:'CELL',
                bodyRender: item => {
                    cell = DepartmentUtil.getCell(item.department);
                    return cell;
                },
                width: "60px"

            },
            // {
            //     title: "部门",
            //     name: "department",
            //     // name: "name",
            //     bodyRender: item => {
            //         let dp = item.department;
            //         if (!dp)return;
            //         dp = dp.split('_');
            //         let name = '', d, tmp;
            //         dp.forEach((element, index) => {
            //             if (index > 0){
            //                 tmp = tmp+'_'+element;
            //                 d = DepartmentUtil.getDepartmentById(tmp);
            //                 if (!name){
            //                     name = d;
            //                 } else {
            //                     name = name + '>' + d;
            //                 }
            //             } else {
            //                 tmp = element;
            //             }
            //         });
            //         return name;
            //     },
            //     width: "300px"
            // },
            {
                title: "品牌",
                name: "brand",
                bodyRender: item => {
                    let dd = DeviceinfoUtil.getDeviceByDevid(item.dev_id); 
                    if (!dd)return ''; 
                    return dd.brand_name;
                },
                // name: "name",
                width: "100px"
            },
            {
              title: "设备名称",
              name: "name",
              // name: "name",
              width: "100px"
            },
            {
              title: "刀库号",
              name: "no",
              bodyRender: item => {
                let n = item.no;
                if (n){

                    // n = parseInt(n);
                    // if (n < 10){
                    //     n = '0'+n;
                    // }
                    toolNo =  'T'+n;
                }
                   
                else 
                    toolNo = '';
                return toolNo;
              },
              width: "120px"
            },
            {
                title: "刀具料号",
                name: "toolMaterial",
                bodyRender: item => {
                    product = DepartmentUtil.getProduct(item._department);
                    process = DepartmentUtil.getPinch(item._department);
                    //getTool(product, process, toolNo)
                    if (!toolNo)
                    return '';
                    cutter = toolInfoUtil.getTool(product, process, toolNo);
                    //rm_no
                    if (cutter){
                        let index =cutter.rm_no.indexOf('\r\n');
                        if(index>-1){
                            return cutter.rm_no.slice(0,index+1);
                        }else{
                            return cutter.rm_no;
                        } 
                    }
                    return '';       
                },
                width: "100px"
              },
              {
                title: "刀具品名",
                name: "toolName",
                bodyRender: item => {//knife_name
                    product = DepartmentUtil.getProduct(item._department);
                    process = DepartmentUtil.getPinch(item._department);
                    //getTool(product, process, toolNo)
                    if (!toolNo)
                    return '';
                     cutter1 = toolInfoUtil.getTool(product, process, toolNo);
                    if (cutter1){
                        let index =cutter1.knife_name.indexOf('\r\n');
                        if(index>-1){
                            return cutter1.knife_name.slice(0,index+1);
                        }else{
                            return cutter1.knife_name 
                        }
                    }
                    return '';
                },
                width: "100px"
              },
              {
                title: "刀具规格",
                name: "toolSpec",
                bodyRender: item => {//shank_type
                    product = DepartmentUtil.getProduct(item._department);
                    process = DepartmentUtil.getPinch(item._department);
                    //getTool(product, process, toolNo)
                    if (!toolNo)
                    return '';
                     cutter2 = toolInfoUtil.getTool(product, process, toolNo);
                    if (cutter2){
                        let index =cutter2.knife_size.indexOf('\r\n');
                        if(index >-1){
                            return cutter2.knife_size.slice(0,index+1);
                        }else{
                            return  cutter2.knife_size;
                        }
                    }
                    return '';
                },
                width: "100px"
              },
            {
              title: "预计换刀时间",
              name: "estimate_time",
              width: "200px"
            },
            {
              title: "剩余寿命(h)",
              name: "residual_life",
              width: "100px"
            },
            {
                title: "剩余寿命(pcs)",
                name: "residual_count",
                width: "110px"
                // bodyRender: item => {
                //   return item.time;
                // }
              },
            {
              title: "标准寿命(pcs)",
              name: "total_count",
              width: "100px"
              // bodyRender: item => {
              //   return item.time;
              // }
            },
            {
                title: "当前寿命(pcs)",
                bodyRender: item => {
                    let total_count = item['total_count'];
                    let residual_count = item['residual_count'];
                    if (total_count && residual_count){
                        return total_count - residual_count;
                    }
                    return '';
                },
                width: "100px"
              },
            // {
            //   title: "预估寿命(h)",
            //   name: "total_life",
            //   width: "80px"
            // },
            {
              title: "机台CT(s)",
              name: "program_ct",
              width: "100px"
            },
            {
                title: "换刀数(把)",
                name: "cuttersLen",
                width: "100px"
            },
            {
              title: "数据导出时间",
              name: "time",
              width: "100px"
            },


            // {
            //     title: "操作",
            //     name: "id",
            //     width: "100px",
            //     bodyRender: item => {
            //         return <a>操作1</a>;
            //     }
            // },
          ];

          const { dataSource } = this.props;
          let column;
          if(this.type === 5){
            column =optimize;
          }else{
            column =columns; 
           
          }

         const data = {
            list: dataSource,
            root: 'root'
        };
      


          const { list, root: rootId } = data;
       
        if(this.type === 3) {
            styles.minWidth = '100%';
            let color = {color: '#666'};
            const formatExpired = (value, index, record) => {
                if(value) {
                    color = {color: '#FF0000'};
                } else {
                    color = {color: '#666'};
                }
                return (
                    <span style={color}>{value}</span>
                )
            };

            const formatIndex = (value, index, record) => {
                return (
                    <span style={color}>{value}</span>
                )
            };

            const formatDevicename = (value, index, record) => {
                return (
                    <span style={color}>{value}</span>
                )
            };

            const formatToolno = (value, index, record) => {
                return (
                    <span style={color}>T{value}</span>
                )
            };

            const formatEstimate_time = (value, index, record) => {

                return (
                    <span style={color}>{value}</span>
                )
            };

            const formatTotal_life = (value, index, record) => {
                return (
                    <span style={color}>{value}</span>
                )
            };

            const formatTotal_count = (value, index, record) => {
                return (
                    <span style={color}>{value}</span>
                )
            };

            return(
                <div className="y-table-max2">
                    <div className="y-table" style={styles}>

                        <Table
                            dataSource={list}
                            isLoading={this.state.isLoading}
                            fixedHeader
                            maxBodyHeight={550}
                        >
                            <Table.Column title="过期" dataIndex="tool.expired" width="20%" cell={formatExpired} style={{ display: "none" }} />
                            <Table.Column title="序号" dataIndex="index" width="20%" cell={formatIndex} />
                            <Table.Column title="设备名称" dataIndex="name" width="20%" cell={formatDevicename} />
                            <Table.Column title="刀具编号" dataIndex="tool.no" width="30%" cell={formatToolno} />
                            <Table.Column title="预计换刀时间" dataIndex="tool.estimate_time" width="20%" cell={formatEstimate_time} />
                            <Table.Column title="剩余寿命(h)" dataIndex="tool.residual_life" width="20%" cell={formatTotal_life} />
                            <Table.Column title="剩余寿命(pcs)" dataIndex="tool.residual_count" width="1%" cell={formatTotal_count} />

                        </Table>

                        <div className='pagination y-pagination'>
                            <span className='total'>共 {this.props.total} 条</span>
                            {/*<Pagination*/}
                                {/*current={this.props.current}*/}
                                {/*onChange={this.props.handleChange}*/}
                                {/*total={this.props.total}/>*/}
                        </div>

                    </div>
                </div>
            )
        } else {
            return (
                <div className="y-table-max2">
                    <div className="y-table2" style={styles}>

                        <TableTree datasets={list} columns={column} rootId={rootId}/>

                        <div className='pagination y-pagination'>
                            <span className='total'>共 {this.props.total} 条</span>
                            <Pagination
                                current={this.props.current}
                                onChange={this.props.handleChange}
                                total={this.props.total}/>
                        </div>
                    </div>
                </div>
            )
        }

    }
}





