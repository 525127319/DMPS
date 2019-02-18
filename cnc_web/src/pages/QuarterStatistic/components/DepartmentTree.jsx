import React ,{Component} from "react"
import { Tree, Search } from "@icedesign/base";
import DepartmentUtil from '@/utils/DepartmentUtil';
import {queryList} from '@/utils/GetTreeData';

import Store from '@/redux/Store';
import Action from '@/redux/Action';
const { Node: TreeNode } = Tree;
let arr = [];
let selectedId = ['root'];
let listener = null;
let departmentId = 'root';
export default class DepartmentTree extends Component{
    constructor(props){
        super(props);
        this.state={
            expandedKeys: ["集团", "root"],
            autoExpandParent: true,
            expend: false,
            treeData:[],
            selected:'',
           
        };
    }

 
      handleExpand=(keys)=> { //树展开
        this.setState({
          expandedKeys: keys
         
        });
      }
      onSelect=(keys, info)=> { //选中树节点
        if(keys.length){
            this.props.getDepartment(keys[0]);
            // Store.dispatch(Action.changeDepartment(keys[0]));
        }
      }



      componentWillMount(){

        var self = this;
        DepartmentUtil.getDepartmentTree().then((res) => {
            this.setState({treeData:res},()=>{
               this.setState({expend: true});
               queryList(this.state.treeData,arr)
            })
        });
      }

    //通过redux拿到部门信息
    // changeDepartment(arg){
    //     let state = Store.getState();
    //     departmentId = state.departmentId
    //     selectedId[0]=departmentId
    //     console.log(departmentId,'departmentId212121122')

    // }

    componentDidMount() {
        const _this = this;
        // listener = Store.subscribe(this.changeDepartment);
    }

    componentWillUnmount(){
        if (listener)
            listener();
    }
      
    render(){
      
        const loop = data =>
        data.map(item => {
          if (item) {
            return (
              <TreeNode label={item.label} key={item.value}>
                 {item.children.length && loop(item.children)}
              </TreeNode>
            );
          }
          console.log(loop,"00")
        });
        const { value, expandedKeys, autoExpandParent } = this.state;
        const filterTreeNode = node =>
          value && this.matchedKeys.indexOf(node.props.eventKey) > -1;
        return(
            <div className='dep-tree'>
                {/* <Search
                    type="normal"
                    size="small"
                    searchText=""
                    width='180'
                    value={value}
                    onSearch={this.handleSearch}
                /> */}
                <Tree
                    showLine
                    onSelect={this.onSelect}
                    defaultSelectedKeys={selectedId}
                    defaultExpandedKeys={arr}
                    // expandedKeys={expandedKeys}
                    // autoExpandParent={autoExpandParent}
                    // filterTreeNode={filterTreeNode}
                    // onExpand={this.handleExpand}

               
                    >
                    {loop(this.state.treeData)}
                </Tree>

            </div>
        )
    }
}