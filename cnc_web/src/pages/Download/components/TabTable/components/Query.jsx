import React, { Component } from "react";
import { Search, Button ,Input} from "@icedesign/base";
import UploadingFiles from "./UploadingFiles";

export default class Query extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
  }
  onSearch= ()=> {
    this.props.getSearchValue(this.state.value);
  }
  // onSearch= (value)=> {
  //   console.log(value.key,9999);
  //   this.props.getSearchValue(value.key);
  // }
  onChange(value) {
    this.setState({
      value: value
    });
  }
  addFiles = () => {
    this.props.addFilesEvent();
  };

  render() {
    return (
      <div className="con-bar">
        {/* <Search
          onChange={this.onChange.bind(this)}
          onSearch={this.onSearch.bind(this)}
          placeholder="输入查询的程序名"
          searchText="搜索"
        /> */}
        <div style={styles.search}>
            <Input placeholder="输入查询的程序名" onChange={this.onChange.bind(this)} trim value={this.state.value} style={{ width: 200 }} hasClear={true}/>
            <Button onClick={this.onSearch} style={styles.btn}>查询</Button>
        </div>
        <UploadingFiles addFiles={this.addFiles} />
      </div>
    );
  }
}
const styles = {
  search: {
      display: "flex",
  },
  btn: {
      marginLeft: "40px",
  }
};
