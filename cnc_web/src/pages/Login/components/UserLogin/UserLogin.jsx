/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { Input, Button, Checkbox, Grid, Feedback, Form, Field } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import AxiosHttp from '@/utils/AxiosHttp';
import IceIcon from '@icedesign/icon';
import './UserLogin.scss';
import qs from "qs";

import DeviceinfoUtils from '@/utils/DeviceinfoUtil';
import DepartmentUtils from '@/utils/DepartmentUtil';
import DevicetypeUtils from '@/utils/DevicetypeUtil';

const FormItem = Form.Item;
const Toast = Feedback.toast;

const { Row, Col } = Grid;

// 寻找背景图片可以从 https://unsplash.com/ 寻找
const backgroundImage =
  'https://img.alicdn.com/tfs/TB1zsNhXTtYBeNjy1XdXXXXyVXa-2252-1500.png';

export default class UserLogin extends Component {
  static displayName = 'UserLogin';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    // sessionStorage.clear();
    this.state = {
      value: {
        account: undefined,
        password: undefined,
        checkbox: false,
      },
    };
  }

  formChange = (value) => {
    this.setState({
      value,
    });
  };

  handle = function (res) {
    //提交成功
    if (res && res.code == 200 && res.msg == 'OK') {
    //   sessionStorage.setItem('tocken', 'Bearer ' + res.data)
    //   sessionStorage.setItem('username', this.state.value.account)
    //   //跳转
    //   hashHistory.push({
    //     pathname: '/',
    //   })
      DeviceinfoUtils.cacheDeviceinfo();
      DepartmentUtils.cacheDepartment();
      DevicetypeUtils.cacheDeviceType();
      AxiosHttp.loginSeccessful(res.data, this.state.value.account);
    } else {
      if (res) {
        Toast.show({
          type: "error",
          content: res.msg,
          afterClose: () => console.error(res.msg)
        });
      }
    }
  }.bind(this)

   componentDidMount() {
     document.addEventListener('keydown',(e)=>{
      if(!this.form)return;
      if(e.keyCode===13){
        return this.handleSubmit(e)
      }
    })
   };

  handleSubmit = function (e) {
    e.preventDefault();
    this.form.validateAll((errors, values) => {
      if (errors) {
        console.log('errors', errors);
        return;
      }
      let _loginData = {
        'encData': JSON.stringify({
          "loginName": values.account,
          "password": values.password,
          "appId": AxiosHttp.getAPPId(),
          "appSecret": AxiosHttp.getAppSecret()
        })
      };
      _loginData = qs.stringify(_loginData);
      AxiosHttp.post(AxiosHttp.getApiGate(), _loginData).then(this.handle);


      //   console.log('values:', values);
      //   console.log(this.props);
      //hashHistory.push('/');
    });
  }.bind(this);

  render() {
    const formItemLayout = {
      labelCol: {
        fixedSpan: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };
    return (
      <div style={styles.userLogin} className="user-login">
        <div
          style={{
            ...styles.userLoginBg,
            backgroundImage: `url(${backgroundImage})`,
          }}
        />
        <div style={styles.contentWrapper} className="content-wrapper">
          <h2 style={styles.slogan} className="slogan">
            DMPS系统
          </h2>
          <div style={styles.formContainer}>
            <h4 style={styles.formTitle}>登录</h4>
            <IceFormBinderWrapper
              value={this.state.value}
              onChange={this.formChange}
              ref={
                (input)=>this.form=input
              }
            >
              <div style={styles.formItems}>
                <Row style={styles.formItem}>
                  <Col>
                    <IceIcon
                      type="person"
                      size="small"
                      style={styles.inputIcon}
                    />
                    <IceFormBinder name="account" required message="必填">
                      <Input maxLength={20} placeholder="会员名" />
                    </IceFormBinder>
                  </Col>
                  <Col>
                    <IceFormError name="account" />
                  </Col>
                </Row>

                <Row style={styles.formItem}>
                  <Col>
                    <IceIcon
                      type="lock"
                      size="small"
                      style={styles.inputIcon}
                    />
                    <IceFormBinder name="password" required message="必填">
                      <Input htmlType="password" placeholder="密码" />
                    </IceFormBinder>
                  </Col>
                  <Col>
                    <IceFormError name="password" />
                  </Col>
                </Row>
                <Row style={styles.formItem}>
                  <Button
                    type="primary"
                    onClick={this.handleSubmit}
                    style={styles.submitBtn}
                  >
                    登 录
                  </Button>
                </Row>
              </div>
            </IceFormBinderWrapper>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  userLogin: {
    position: 'relative',
    height: '100vh',
  },
  userLoginBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundSize: 'cover',
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '30px 40px',
    background: '#fff',
    borderRadius: '6px',
    boxShadow: '1px 1px 2px #eee',
  },
  formItem: {
    position: 'relative',
    marginBottom: '25px',
    flexDirection: 'column',
  },
  formTitle: {
    margin: '0 0 20px',
    textAlign: 'center',
    color: '#3080fe',
    letterSpacing: '12px',
  },
  inputIcon: {
    position: 'absolute',
    left: '0px',
    top: '3px',
    color: '#999',
  },
  submitBtn: {
    width: '240px',
    background: '#3080fe',
    borderRadius: '28px',
  },
  checkbox: {
    marginLeft: '5px',
  },
  tips: {
    textAlign: 'center',
  },
  link: {
    color: '#999',
    textDecoration: 'none',
    fontSize: '13px',
  },
  line: {
    color: '#dcd6d6',
    margin: '0 8px',
  },
};
