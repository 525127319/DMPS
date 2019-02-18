import React from "react";
import ReactDOM from "react-dom";
import { Button, Tree, Dialog, Form, Input } from "element-react";
import { Moment, Feedback, Select } from "@icedesign/base";
import "element-theme-default";
import AxiosHttp from "../../../utils/AxiosHttp";
import Add from "./Add";
import Delete from "./Delete";
import Edit from "./Edit";
import DepartmentUtil from "@/utils/DepartmentUtil";
import DeviceinfoUtil from "@/utils/DeviceinfoUtil";

const Toast = Feedback.toast;

export default class EditorTree extends React.Component {
  constructor(props) {
    super(props);
    this.parent = {
      value: "root",
      label: "集团",
      children: [],
    };
    this._map = new Map();
    this._map.set(this.parent.value, this.parent);
    this.state = {
      dataSource: [],
      data: [this.parent],
      options: {
        children: "children",
        label: "label"
      },
      isShowClass: 'none',
      dataButton: '',
      valueEdit: ''
    };
    this.retrieve();
    this.getClassList();
  }

  handleResponse(response) {
    if (response.ok) {
      this.setState({
        data: [response.value]
      });
      this.parent = response.value;
      this.resetMap(response.value);
      DepartmentUtil.cacheDepartment();
    }
  }

  retrieve() {
    AxiosHttp.get("/department/get/" + this.props.type)
      .then(response => {
        this.handleResponse(response);
      })
      .catch(error => {
        console.error(error);
      });
  }

  getClassList() {
    AxiosHttp.get("/shift/list/" + this.state.value)
      .then(res => {
        res.value.rs.forEach(val => {
          let dataName = {}
          dataName.label = val.name;
          dataName.value = val.shift_id;
          this.state.dataSource.push(dataName)
        })
      })
      .catch(error => {
        console.log(error);
      });
  }

  /**
     * {
  value: "root",
  label: "集团",
  children: [
  ]
}
     * @param {*} response
     */
  resetMap(response) {
    this._map.clear();
    this._map.set(response.value, response);
    this.set2Map(response.children);
  }

  set2Map(children) {
    if (children.length <= 0) return;
    children.map(node => {
      this._map.set(node.value, node);
      if (node.children.length > 0) {
        this.set2Map(node.children);
      }
    });
  }

  save() {
    //删除： __watch_cache
    this._map.forEach((value, key) => {
      delete value["__watch_cache"];
    });
    AxiosHttp.post("/department/updateAndCreate", {
      type: this.props.type,
      data: this.parent
    })
      .then(response => {
        // console.log("update success!");
        this.handleResponse(response);
      })
      .catch(error => {
        console.log("update error!");
      });
  }

  //检查本父节点是否有相同的名称
  check(label, parentNode) {
    let isExist = false;
    let pNode = this._map.get(parentNode.value);
    let children = pNode.children;
    children.forEach(node => {
      if (node.label == label) {
        isExist = true;
      }
    });
    return isExist;
  }

  handleAppend(curNode, store, parentNode) {
    if (this.check(curNode.label, parentNode)) {
      let showError = () => Toast.error("名称" + curNode.label + " 重复!");
      showError();
      return;
    }
    let _value = parentNode.value + "_" + Moment().format("YYYYMMDDhmmssSSS");
    store.append(
      { value: _value, label: `${curNode.label}`, children: [] },
      parentNode
    );
    curNode["parent_id"] = parentNode.value;
    curNode["value"] = _value;
    curNode["children"] = [];
    this._map.set(_value, curNode);
    let tmp = this._map.get(parentNode.value);
    tmp.children.push(curNode);
    store.currentNode.refresh();
    this.save();
  }

  //updateValue: {label: originalV, setValue: newV}
  //values: original node
  handleEdit(updateValue, store, originalNode) {
    let parentNode = this._map.get(originalNode.value);
    if (this.check(updateValue.label, parentNode)) {
      let showError = () =>
        Toast.error("名称" + updateValue.label + " 重复!");
      showError();
      return;
    }
    let tmp = this._map.get(originalNode.value);
    tmp.label = originalNode.label = updateValue.label;
    store.currentNode.refresh();
    this.save();
  }

  //删除所有的相关的node，在map里
  removeAllchild(child) {
    let children = child.children;
    if (children || children.length <= 0) {
      return;
    }
    for (let i = 0; i < children.length; i++) {
      if (children[i].children.length > 0) {
        this.removeAllchild(children[i].children);
      }
      this._map.delete(children[i].value);
    }
  }

  //删除选中的节点，在map中
  removeFromMap(children, value) {
    let index = 0;
    for (let i = 0; i < children.length; i++) {
      if (children[i].value == value) {
        index = i;
        break;
      }
    }
    children.splice(index, 1);
    let child = this._map.get(value);
    this.removeAllchild(child);
    this._map.delete(value);
  }

  //删除节点
  handleRemove(store, curNodeData) {
    let value = curNodeData.value;
    let currentData = this._map.get(value);
    let devicelist = JSON.parse(localStorage.getItem('deviceinfo'));
    for (let i = 0; i < devicelist.length; i++) {
      if (devicelist[i].location === currentData.value) {
        Toast.error(`${currentData.label}位置被${devicelist[i].name}设备使用中`, 6000);
        return;
      } else if (devicelist[i].department === currentData.value) {
        Toast.error(`${currentData.label}部门被${devicelist[i].name}设备使用中`);
        return;
      }
    }
    let parentId = currentData.parent_id;
    let children = this._map.get(parentId).children;
    this.removeFromMap(children, value);
    this.save();
  }

  appendEditAndRemove(nodeModel, data, store) {
    if (data.value == "root") {
      return;
    }
    return (
      <span>
        <Edit
          size="small"
          handleEdit={this.handleEdit.bind(this)}
          store={store}
          data={data}
          dataSource={this.state.dataSource}
          dataEdit={this.dataEdit.bind(this)}
          onAdd={this.onAdd.bind(this)} type={this.props.type}
        />
        <Delete
          size="small"
          handleRemove={this.handleRemove.bind(this)}
          store={store}
          data={data}
        />
      </span>
    );
  }

  dataEdit(datas, valueEdit, store,updateValue) {
    this.state.valueEdit = valueEdit
    this.setState({
      dataButton: datas
    })
    let tmp = this._map.get(valueEdit);
    tmp.addscalss = datas;
    tmp.shift_id = updateValue;
    store.currentNode.refresh();
    this.save();
  }

  operation(nodeModel, data, store, dataButton) {
    return (
      <span style={{ float: "right", marginRight: "20px" }}>
        <span style={{ marginRight: "5px", size: "small", display: this.props.type == 'department' ? 'visible' : 'none' }}>
          {
            data.parent_id && data.parent_id === 'root' ?
              (<Button plain disabled
                style={styles.Buttonsytle}
              >
                {
                  this.state.dataButton !== data.addscalss && data.value === this.state.valueEdit ?
                    (this.state.dataButton) :
                    (data.addscalss)
                }
              </Button>) :
              (<Button style={{ display: "none" }}></Button>)
          }
        </span>
        <Add
          size="small"
          handleAppend={this.handleAppend.bind(this)}
          store={store}
          data={data}
          dataSource={this.state.dataSource}
          onAdd={this.onAdd.bind(this)} type={this.props.type}
        />
        {this.appendEditAndRemove(nodeModel, data, store)}
      </span>
    );
  }

  renderContent(nodeModel, data, store) {
    return (
      <span>
        <span>
          <span>{data.label}</span>
        </span>
        {this.operation(nodeModel, data, store)}
      </span>
    );
  }
  onAdd(Treepanel){
    this.Treepanel = Treepanel;
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  search(searchObj) {
    this.tree.filter(searchObj.key.trim());
    // this.tree.filter(searchObj.key);
  }

  render() {
    const { data, options } = this.state;
    return (
      <div className="main-con-body">
        <Tree
          dataSource={this.state.dataSource}
          data={this.state.data}
          ref={e => (this.tree = e)}
          // options={options}
          // isShowCheckbox={true}
          nodeKey="value"
          defaultExpandAll={true}
          expandOnClickNode={false}
          renderContent={(...args) => this.renderContent(...args)}
          filterNodeMethod={(value, data) => {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
          }}
        />
      </div>
    );
  }
}
const styles = {
  Buttonsytle: {
    size: "mini",
    color: "#333333",
    fontSize: "12px",
    width: "62px",
    height: "23px",
    padding: "1px 12px",
    display: "inline-block",
    verticalAlign: "middle",
  }
};
