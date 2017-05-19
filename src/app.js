import React, { Component } from 'react';
import Styles from './style/app.js';
import {
  Router,
  Route
} from 'react-router-dom';

import Login from './view/login.js';
import Tabs from './view/tabs.js';
import DialogueContainer from './container/dialogue_container';
import UserInfo from './view/user_info';
import ghistory from './utils/ghistory';

class App extends Component {
  render() {
    return (
      <Router history={ghistory}>
        <div style={Styles.app}>
          <Route path="/" exact component={Login} />
          <Route path="/main" component={Tabs} />
          <Route path="/dialogue" component={DialogueContainer} />
          <Route path="/user" component={UserInfo} />
        </div>
      </Router>
    )
  }
}

export default App;
