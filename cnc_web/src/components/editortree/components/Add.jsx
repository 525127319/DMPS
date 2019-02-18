import React, { Component } from "react";
import {
  Dialog,
  Button,
  Form,
  Input,
  Field,
  Icon,
  Select,
  Feedback
} from "@icedesign/base";
import AxiosHttp from "../../../utils/AxiosHttp";

const FormItem = Form.Item;
const Toast = Feedback.toast;

export default class Add extends Component {
  static displayName = "AddDepartment";

  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      addscalss: "",
      isShow: 'none',
      shift_id:"",
      shiftList:''
      
    };
    this.field = new Field(this);
  }
  componentDidMount() {
    this.getClassList();
  }

  componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
}

  // 请求班别
  getClassList() {
    AxiosHttp.get("/shift/list/" + this.state.value)
      .then(res => {

         this.setState({
           shiftList:res.value
         })
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleSubmit = (store, data) => {
    this.field.validate((errors, values) => {
      if (errors) {
        console.log("Errors in form!!!");
        return;
      }
      if (this.state.addscalss === '') {
        Toast.error('班别添加失败')
      }
    
      
      values.shift_id = this.state.addscalss
      let shift_id = values.shift_id;
      
      let shfitData = this.state.shiftList;
      let name = '';
      shfitData.rs.forEach(val => {
        if(shift_id === val.shift_id){
          name = val.name;
        }
      })
      values.addscalss = name;
      this.props.handleAppend(values, store, data);
      this.setState({
        visible: false,
      });
      this.field.reset();
    });
  };

  onOpen = () => {
    if (this.props.data.value === 'root') {
      this.setState({
        isShow: '',
      })
    }
    this.setState({
      visible: true
    });
  }

  onClose = () => {
    this.setState({
      visible: false
    });
  }

  onChange(value) {
    this.setState({
      addscalss: value
    });
  }

  render() {
    const { store, data } = this.props;
    const { dataSource } = this.props;
    // const init = this.field.init;
    const { init, getValue, reset } = this.field;
    const formItemLayout = {
      labelCol: {
        fixedSpan: 6
      },
      wrapperCol: {
        span: 14
      }
    };
    return (
      <div style={styles.editDialog}>
        <Button size="small" onClick={this.onOpen}>
          <Icon type="add" />增加
        </Button>

        <Dialog
          style={{ width: 640 }}
          visible={this.state.visible}
          onOk={this.handleSubmit.bind(this, store, data)}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="新增"
        >
          <Form direction="ver" field={this.field} >
            <FormItem label="新增：" {...formItemLayout}>
              <Input
                trim={true}
                size="small"
                {...init("label", {
                  rules: [{ required: true, message: "必填选项" }]
                })}
              />
            </FormItem>
          </Form>

          <Form direction="ver" field={this.field}
            style={{ width: 355, display: this.state.isShow }}
            visible={this.state.visible}
          >
            <FormItem label="绑定班别：" {...formItemLayout} required
              style={{ display: this.props.type == 'department' ? 'visible' : 'none' }}
            >
              <Select
                hasClear
                size='small'
                name="addscalss"
                value={this.state.addscalss}
                style={{ width: 355 }}
                placeholder="选择班别"
                dataSource={dataSource}
                onChange={this.onChange.bind(this)}
              >
              </Select>
            </FormItem>
          </Form>

        </Dialog>
      </div>
    );
  }
}

const styles = {
  editDialog: {
    display: "inline-block",
    marginRight: "5px"
  }
};
