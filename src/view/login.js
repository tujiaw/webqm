import React, { Component } from 'react';
import RestfulApi from '../controller/restful_api.js'
import Styles from '../style/login.js'
import MainTab from './main_tab.js';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false
    };
    this.onLogin = this.onLogin.bind(this);
  }

  onLogin() {
    const {username, password} = this.refs;
    if (username.value.length && password.value.length) {
      RestfulApi.login(username.value, password.value)
      .then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.setState({
            isLogin: true
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }

  render() {
    const Login = (
      <div style={Styles.main}>
        <h2>WEB QM 登录</h2>
        <div id="inputVLayout">
          <div style={Styles.usernameHLayout}>
            <span style={Styles.spanWidth}>用户名 </span>
            <input ref="username" type="text"  placeholder="用户名" />
          </div>
          <div style={Styles.passwordHLayout}>
            <span style={Styles.spanWidth}>密码 </span>
            <input ref="password" type="password" placeholder="密码" />
          </div>
          <div style={Styles.rememberMeHLayout} ref="rememberMe" className="checkbox">
            <input type="checkbox" value="remember-me"/>记住我
          </div>
        </div>
        <input style={Styles.loginButton} type="button" value="登录" onClick={this.onLogin} />
      </div>
    )
    return this.state.isLogin ? <MainTab /> : Login;
  }
}

export default Login;