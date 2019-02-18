

import { Component } from 'react';

export default class LoginForward extends Component {
  static displayName = 'LoginForward';

  constructor(props) {
    super(props);
    this.state = {};
  }
  

  render() {
    let query = this.props.location.query;
    if (query){
        let tocken = query.tocken;
        let username = query.username;
        AxiosHttp.loginSeccessful(tocken, username);
    } else {
        AxiosHttp.loginFaild();
    }
    
  }
}
