import React, { Component } from 'react';
import UserCreators from '../creators/user_creators';
import Styles from '../style/login';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import CircularProgress from 'material-ui/CircularProgress';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTip: false,
      tipMsg: '登录失败！',
      username: 'jiawei01',
      password: '123456',
      loadding: false,
    }
  }

  onLogin = () => {
    const username = this.state.username;
    const password = this.state.password;
    console.log('login, username:' + username + ', password:' + password);
    if (username.length && password.length) {
      const self = this;
      self.setState({loadding: true});
      UserCreators.asyncLogin(username, password)
      .then(UserCreators.initUIData)
      .then(() => {
        self.setState({ isLogin: true, loadding: false });
        self.props.history.push('main');
      })
      .catch((res) => {
        self.setState({
          showTip: true,
          tipMsg: res.error || '登录失败，用户名或密码错误！',
          loadding: false
        })
      });
    } else {
      this.setState({
        showTip: true, tipMsg: '用户名或密码不能为空！'
      })
    }
  }

  onRequestClose = () => {
    this.setState({
      showTip: false
    })
  }

  onUsernameInput = (event) => {
    console.log(event.target.value);
    this.setState({ username: event.target.value });
  }

  onPasswordInput = (event) => {
    this.setState({ password: event.target.value });
  }

  render() {
    return (
      <div style={Styles.main}>
        <h1 style={Styles.title}>QM网页版登录</h1>
        <div style={Styles.vLayout}>
          <TextField 
            hintText="用户名" 
            ref="username" 
            defaultValue={this.state.username} 
            underlineFocusStyle={Styles.underlineStyle}
            onChange={this.onUsernameInput}
          />
          <TextField 
            hintText="密码" 
            type="password" 
            ref="password" 
            defaultValue={this.state.password} 
            underlineFocusStyle={Styles.underlineStyle}
            onChange={this.onPasswordInput}
          />
          <Checkbox label="记住密码" style={Styles.checkbox}/>
          <br/>
          <RaisedButton label="登录" primary={true} onClick={this.onLogin} fullWidth={true}/>
        </div>
        <div style={this.state.loadding ? Styles.progressVisible : Styles.progressHidden}>
          <CircularProgress color="#e80052" />
        </div>
        <Snackbar
          open={this.state.showTip}
          message={this.state.tipMsg}
          autoHideDuration={4000}
          onRequestClose={this.onRequestClose}
          bodyStyle={Styles.snackbarBody}
        />
      </div>
    )
  }
}

export default Login;