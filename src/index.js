import React from 'react';
import ReactDOM from 'react-dom';
import App from './app.js';
import './style/index.css';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();
ReactDOM.render((
  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
    <App/>
  </MuiThemeProvider>), 
  document.getElementById('root'));
