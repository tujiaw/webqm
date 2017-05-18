import React from 'react';
import ReactDOM from 'react-dom';
import App from './app.js';
import './style/index.css';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import moment from 'moment';

// 支持中文时间
moment.defineLocale('zh-cn', {
  weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
})

injectTapEventPlugin();
ReactDOM.render((
  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
    <App/>
  </MuiThemeProvider>), 
  document.getElementById('root'));
