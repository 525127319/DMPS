import React, { Component } from "react";
import { Button, Balloon } from "@icedesign/base";
import PropTypes from "prop-types";
import AxiosHttp from "@/utils/AxiosHttp.js";

export default class DeletePanel extends Component {
  static propTypes = {
    handleRemove: PropTypes.func
  };

  static defaultProps = {
    handleRemove: () => {}
  };
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  
  handleHide = (visible, code) => {
    const {shiftArr} =this.props;
    if (code === 1) {
        this.props.handleRemove();
      }
    this.setState({
      visible: false
    });
  };

  handleVisible = visible => {
    this.setState({ visible });
  };

  render() {
    const {shiftArr} =this.props;
    const visibleTrigger = (
      <Button size="small" type="secondary" shape="warning">
        删除{shiftArr.name}
      </Button>
    );

    const content = (
      <div>
        <div style={styles.contentText}>确认删除{shiftArr.name}？</div>
        <Button
          id="confirmBtn"
          size="small"
          type="normal"
          shape="warning"
          style={{ marginRight: "5px" }}
          onClick={visible => this.handleHide(visible, 1)}
        >
          确认
        </Button>
        <Button
          id="cancelBtn"
          size="small"
          onClick={visible => this.handleHide(visible, 0)}
        >
          关闭
        </Button>
      </div>
    );

    return (
      <Balloon
        trigger={visibleTrigger}
        triggerType="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisible}
      >
        {content}
      </Balloon>
    );
  }
}

const styles = {
  contentText: {
    padding: "5px 0 15px"
  }
};
