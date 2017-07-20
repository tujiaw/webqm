import React, { Component } from 'react';
import Styles from './style/app.js';
import Config from './config/config';
import { Router, Route } from 'react-router-dom';

import Login from './view/login.js';
import TabsContainer from './container/tabs_container';
import DialogueContainer from './container/dialogue_container';
import UserInfo from './view/user_info';
import RoomInfo from './view/room_info';
import Search from './view/search';
import ghistory from './utils/ghistory';

class App extends Component {
  render() {
    return (
      <Router history={ghistory}>
        <div style={Styles.app}>
          <Route path={`${Config.prefix}/`} exact component={Login} />
          <Route path={`${Config.prefix}/main`} component={TabsContainer} />
          <Route path={`${Config.prefix}/dialogue`} component={DialogueContainer} />
          <Route path={`${Config.prefix}/user`} component={UserInfo} />
          <Route path={`${Config.prefix}/room`} component={RoomInfo} />
          <Route path={`${Config.prefix}/search`} component={Search} />
        </div>
      </Router>
    )
  }
}

export default App;
