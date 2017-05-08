import React, { Component } from 'react';
import Chat from './chat.js';
import Contact from './contact.js';
import About from './about.js';
import Styles from '../style/main_tab.js';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const routes = [
  { path: '/',
    exact: true,
    main: () => <Contact />
  },
  { path: '/chat',
    main: () => <Chat />
  },
  { path: '/about',
    main: () => <About />
  }
]

class MainTab extends Component {
  render() {
    return (
      <Router>
        <div style={Styles.main}>
          <div style={Styles.tab}>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                component={route.main}
              />
            ))}
          </div>

          <div style={Styles.bottomPanel}>
            <ul style={Styles.bottomButtons}>
              <li><Link to="/">contact</Link></li>
              <li><Link to="/chat">Chat</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>

            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
              />
            ))}
          </div>
        </div>
      </Router>
    )
  }
}

export default MainTab;