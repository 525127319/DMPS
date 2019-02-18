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
            selectedKeys:[],
            tree:true
        };
        this.yClick = this.yClick.bind(this);
    }

 
      handleExpand=(keys)=> { //树展开
        this.setState({
          expandedKeys: keys
        });
      }
      onSelect=(keys, info)=> { //选中树节点
        if(keys.length){
            Store.dispatch(Action.changeDepartment(keys[0]));
        }
       // console.log(info.selectedNodes[0].props.label,'info')
      }

    yClick(){
        //更新状态值
        const tree = !this.state.tree;
        this.setState({tree});
    }

      componentWillMount(){
          let departmentIdAarr = [];
          departmentIdAarr.push(DepartmentUtil.changeDepartment())
        this.setState({
            selectedKeys:departmentIdAarr
        }) 

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
    // }

    // componentDidMount() {
    //     const _this = this;
    //     listener = Store.subscribe(this.changeDepartment);
    // }

    // componentWillUnmount(){
    //     if (listener)
    //         listener();
    // }
      
    render(){
        const loop = data =>
        data.map(item => {
          if (item) {
            return (
              <TreeNode label={item.label} key={item.value}>
                 {item.children?item.children.length && loop(item.children):''}
              </TreeNode>
            );
          }
        });
        const { value, expandedKeys, autoExpandParent } = this.state;
        const filterTreeNode = node =>
          value && this.matchedKeys.indexOf(node.props.eventKey) > -1;
        return(
            <div  className={ this.state.tree ? 'dep-tree' : 'y-dep-tree' }>
                {/* <Search
                    type="normal"
                    size="small"
                    searchText=""
                    width='180'
                    value={value}
                    onSearch={this.handleSearch}
                /> */}
                <i  className={ this.state.tree ? 'y-tree-ico' : 'y-tree-ico-l' } onClick={this.yClick}></i>
                <Tree
                    showLine
                    onSelect={this.onSelect}
                    // defaultSelectedKeys={selectedId}
                    defaultSelectedKeys={this.state.selectedKeys}
                    defaultExpandedKeys={arr}
                    // selectedKeys = {this.state.selectedKeys}
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