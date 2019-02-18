import React, {Component} from 'react'
import {moment, Table, Pagination} from "@icedesign/base";
import {hashHistory} from 'react-router';
import toolInfoUtil from "@/utils/ToolInfoUtil"
import DepartmentUtil from "@/utils/DepartmentUtil"
import DeviceinfoUtil from "@/utils/DeviceinfoUtil"
import DepartmentStatusUtil from "@/utils/DepartmentStatusUtil"
import TableTree from "react-table-tree";
import { div } from 'gl-matrix/src/gl-matrix/vec3';

import './ToolTable.scss';
const styles = {
    minWidth: '2000px'
};
export default class ToolTable extends Component {
    constructor(props) {
        super(props);
        this.state = {}

    }
    componentDidMount(){
    
    

    }
 
            
    render(){
        let product = null, process = null, cell = null, toolNo = null, cutter = null,  cutter1 = null, cutter2 = null ;
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
                if (n)
                    toolNo =  'T'+n;
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
                name: "counter",
                width: "100px"
            },
            {
              title: "数据生成时间",
              name: "time",
              width: "100px"
            },


            // {
            //   title: "操作",
            //   name: "id",
            //   textAlign: "right",
            //   bodyRender: item => {
            //     return <a>操作1</a>;
            //   }
            // }
          ];

          const { dataSource } = this.props;

          const data = {
        
            list: dataSource,
            root: 'root'
          };
      


          const { list, root: rootId } = data;

        // console.log(dataSource,22222222222)
        return (


            <div className="y-table-max y-table-max3">
              <div className="y-table"  style={styles}>
                <TableTree datasets={list} columns={columns} rootId={rootId}/>
                {/* <TableTree datasets={dataSource} columns={columns} /> */}

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





