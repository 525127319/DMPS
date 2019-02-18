"use strict";
import axios from "axios";
import { hashHistory } from "react-router";
import { Feedback } from "@icedesign/base";
const Toast = Feedback.toast;
const showError = () => Toast.error("你还没有登录");
let dialog = null;
let toLogin = dialog => {
  //跳转到登录
  // dialog.hide();

  //if (!sessionStorage.getItem('tocken')){
  //跳转
  hashHistory.push({
    pathname: "/login"
  });
  //}
};

let checkTocken = url => {
    if(url == "/device/devicesum" || url == "/department/get" || url == "/toolinfo/getAllToolDefine" || url.indexOf("token/create.do") > 0
        || url == "/shift/getShiftDefineTime" || url == "/appconfig/getEfficientConfig" || url == "/appconfig/getCutterAutoReportConfig/0"
        || url == "/appconfig/getCutterAutoReportConfig/1" || url == "/appconfig/getCutterAutoReportConfig/2"){
        return false;
}
  if (!sessionStorage.getItem("tocken")) {
    //跳转
    hashHistory.push({
      pathname: "/login"
    });
    return true;
  } else {
    return false;
  }
};

let checkResult = response => {
  var resultData = response.data;
  if (
    resultData.code == 10002 ||
    resultData.code == 10005 ||
    resultData.code == 20001
  ) {
    // dialog = Dialog.alert({
    //     needWrapper: false,
    //     content: "您的账号在其它的地方登入，请重新登入!",
    //     title: "警告",
    //     footer: (
    //       <Button type="primary" onClick={() => toLogin()}>
    //         确定
    //       </Button>
    //     )
    //   });

    showError();
    toLogin();
  } else if (!resultData){
    response.data = {};
  }
};

axios.interceptors.request.use(
  config => {
    if (config.data instanceof FormData) {
      // 如果是FormData类型，表示为上传图片
      return config;
    }
    if (config.headers.UseFormData == false) {
      return config;
    }

    // checkTocken();
    //处理不同的请求类型
    config.headers["Authorization"] = sessionStorage.getItem("tocken");
    // config.headers['username']=sessionStorage.getItem('username');

    //    if (config.method === 'post') {
    //         config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    //         // config.data = qs.stringify(config.data);
    //     }
    // if (config.method === 'get') {
    //     config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    //     if (config.data) {
    //         // config.url += "?" + qs.stringify(config.data);
    //     }
    // }
    return config;
  },
  error => {
    // _.toast("错误的传参", 'fail');
    return Promise.reject(error);
  }
);
let defaultRes = {ok:0, value:{}, rs:{}};

class AxiosHttp {
  init = () => {
    axios.defaults.timeout = 20000; //响应时间
    //配置请求头
    axios.defaults.headers.get["Content-Type"] =
      "application/x-www-form-urlencoded";
    axios.defaults.headers.post["Content-Type"] =
      "application/x-www-form-urlencoded";
    //axios.defaults.baseURL = "http://127.0.0.1:3000/api";
    
      axios.defaults.baseURL =
        "https://traceapp.casetekcorp.com:9001/gateway/dms/api";
  };
  // 程序上传的 baseURL
  feilurl() {
    //return "http://127.0.0.1:3000/api/";

      return "https://traceapp.casetekcorp.com:9001/gateway/dms/api/";
  }
  // 程序下载的 baseURL
  downloadfeilurl() {
    //return "http://127.0.0.1:3000/";

      return "https://traceapp.casetekcorp.com:9001/gateway/dms/";
  }

  getApiGate(){
      return 'https://traceapp.casetekcorp.com:9001/gateway/api/token/create.do';
  }


getAPPId(){
    return "ks-imcloudep-1wWE1";
}

getAppSecret(){
    return "FckASVVXcPfIk0Gd0SGk2M7JWQjEGMwc6gEfpc6O1D69I22A5T3JFYf9pt2ahGaH";
}


  post(uri, data) {
    if (checkTocken(uri)) {
      return Promise.reject("你还没登录");
    }
    return axios
      .post(uri, data)
      .then(res => {
        if (!res) return defaultRes;
        checkResult(res);
        console.log("res:   " + res);
        return res.data;
      })
      .catch(error => {
        console.error("error:   " + error);
        return defaultRes;
      });
  }

  exportExcel(uri, data, name) {
    if (checkTocken(uri)) {
      return Promise.reject("你还没登录");
    }

    return axios
      .post(uri, data,{ responseType: 'blob'})
      .then(res => {
        if (res.data.size < 150){
            return 0;
        }
        let blob = new Blob([res.data], {type: 'vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
        var downloadElement = document.createElement('a');
    　　var href = window.URL.createObjectURL(blob); //创建下载的链接
    　　downloadElement.href = href;
    　　downloadElement.download = name+'.xlsx'; //下载后文件名
    　　document.body.appendChild(downloadElement);
    　　downloadElement.click(); //点击下载
    　　document.body.removeChild(downloadElement); //下载完成移除元素
    　　window.URL.revokeObjectURL(href); //释放掉blob对象 
        
        //FileSaver.saveAs(blob, 'fileName.xlsx');
       // return res.data;
      })
      .catch(error => {
        console.error("error:   " + error);
        throw error;
      });
  }

  get(uri, data) {
    if (checkTocken(uri)) {
      return Promise.reject("你还没登录");
    }
    return axios
      .get(uri, data)
      .then(res => {
        if (!res)return defaultRes;
        checkResult(res);
        return res.data;
      })
      .catch(error => {
        console.error("error:   " + error);
        return defaultRes;
      });
  }

  loginSeccessful(tocken, username){
    sessionStorage.setItem('tocken', 'Bearer ' + tocken)
    sessionStorage.setItem('username', username)
    //跳转
    hashHistory.push({
      pathname: '/',
    })
  }

  loginFaild(){
    hashHistory.push({
        pathname: "/login"
      });
  }
}

let httpUtil = new AxiosHttp();
httpUtil.init();
export default httpUtil;
