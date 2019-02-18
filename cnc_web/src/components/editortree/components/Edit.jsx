import React, { Component } from "react";
import {
  Dialog,
  Button,
  Form,
  Input,
  Field,
  Select,
  Feedback
} from "@icedesign/base";
import AxiosHttp from "../../../utils/AxiosHttp";

const Toast = Feedback.toast;
const FormItem = Form.Item;
let data = {}

export default class Edit extends Component {
  static displayName = "Edit";

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
    componentDidMount() {
      this.getClassList();
    }

    componentWillUnmount = () => {
      this.setState = (state,callback)=>{
        return;
      };
  }

  handleSubmit = (store, data) => {
    this.field.validate((errors, values) => {
      if (errors) {
        console.log("Errors in form!!!");
        return;
      }
      // console.log(this.state.addscalss,'1111')
      values.shift_id = this.state.addscalss
      let shift_id = values.shift_id;

      if (this.state.addscalss === '') {
        Toast.error('班别添加失败')
      }
      let shfitData = this.state.shiftList;
      let name = '';
      shfitData.rs.forEach(val => {
        if(shift_id === val.shift_id){
          name = val.name;
        }
      })
      this.state.addscalss = name;
      let datas = this.state.addscalss;

      this.props.handleEdit(values, store, data);
      this.props.dataEdit(datas, this.props.data.value, store,values.shift_id);
      this.setState({
        visible: false,
      });
    });
  };

  onOpen = (label, data) => {
    this.field.setValues({ label });
    this.setState({
      visible: true
    });
    const _addsclass = this.props.data.addscalss;
    if (this.props.data.parent_id === 'root') {
      this.setState({
        isShow: '',
        addscalss: _addsclass
      })
    }
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  onChange(value, addscalss) {
    this.setState({
      addscalss: value,
    });
  }

  render() {
    const { store, data } = this.props;
    const { label } = this.props.data;
    const { dataSource } = this.props;
    const init = this.field.init;
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
        <Button
          size="small"
          type="primary"
          onClick={() => this.onOpen(label)}
        >
          编辑
        </Button>
        <Dialog
          style={{ width: 640 }}
          visible={this.state.visible}
          onOk={this.handleSubmit.bind(this, store, data)}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="编辑"
        >
          <Form direction="ver" field={this.field}>
            {/* <FormItem label="当前值：" {...formItemLayout} }>
              <Input  {...init("label")} />
            </FormItem> */}

            {/* <FormItem label="当前部门等级：" {...formItemLayout}>
              <Input readOnly={true} {...init("value")} />
            </FormItem> */}

            <FormItem label="当前值修改：" {...formItemLayout}>
              <Input
                trim={true}
                name="label"
                {...init("label", {
                  rules: [{ required: true, message: "必填选项" }]
                })}
              />
            </FormItem>
          </Form>

          <Form direction="ver" field={this.field}
            style={{ display: this.state.isShow }}
            visible={this.state.visible}
          >
            <FormItem label="绑定班别：" {...formItemLayout} required
              style={{ display: this.props.type == 'department' ? 'visible' : 'none' }}
            >
              <Select
                size='small'
                name="addscalss"
                value={this.state.addscalss}
                style={{ width: 355 }}
                placeholder="选择班别"
                onChange={this.onChange.bind(this)}
                dataSource={dataSource}
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
