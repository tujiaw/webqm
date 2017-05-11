import React, { Component } from 'react';
import './css/app.css';
import {
  Router,
  Route
} from 'react-router-dom';

import Login from './view/login.js';
import MainTab from './view/main_tab.js';

import { createHashHistory } from 'history';
const history = createHashHistory();

class App extends Component {
  render() {
    return (
      <Router history={history}>
        <div>
          <Route path="/" exact component={Login} />
          <Route path="/main" component={MainTab} />
        </div>
      </Router>
    )
  }
}

export default App;
