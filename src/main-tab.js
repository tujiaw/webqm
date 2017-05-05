import React, { Component } from 'react';
import Chat from './chat.js';
import Contact from './contact.js';
import About from './about.js';
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
  constructor() {
    super();
  }

  render() {
    return (
      <Router>
        <div style={styles.main}>
          <div style={styles.tab}>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                component={route.main}
              />
            ))}
          </div>

          <div style={styles.bottomPanel}>
            <ul style={styles.bottomButtons}>
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

const styles = {};
styles.main = {
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100vh'
}

styles.tab = {
  display: 'flex',
  flex: 1
}

styles.bottomPanel = {
  background: '#eee'
}

styles.bottomButtons = {
  display: 'flex',
  listStyleType: 'none',
  padding: 0,
  justifyContent: 'space-around'
}

export default MainTab;