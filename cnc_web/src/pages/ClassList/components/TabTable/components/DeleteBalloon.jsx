import React, { Component } from "react";
import { Button, Balloon ,Feedback} from "@icedesign/base";
import PropTypes from "prop-types";
import AxiosHttp from "@/utils/AxiosHttp.js";
const Toast = Feedback.toast;
export default class DeleteBalloon extends Component {
  // static propTypes = {
  //   handleRemove: PropTypes.func
  // };

  // static defaultProps = {
  //   handleRemove: () => {}
  // };
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  handleHide = (visible, code) => {
    const {shiftArr,id,record} =this.props;
    let shift_id=shiftArr.shift_id;
    let attrbute =record.attrbute;
    let params={id,shift_id,attrbute};
    if (code === 1) {
      AxiosHttp.post("/shift/delete/",params)
      .then(res => {
        let { ok } = res;
        if (ok === 1) {
          Toast.success("删除成功");
          this.props.handleRemove();
        }
      })
      .catch(error => {
        console.log(error);
      });
    }
    this.setState({
      visible: false
    });
  };

  handleVisible = visible => {
    this.setState({ visible });
  };

  render() {
    const visibleTrigger = (
      <Button size="small" type="secondary" shape="warning">
        删除
      </Button>
    );

    const content = (
      <div>
        <div style={styles.contentText}>确认删除？</div>
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
