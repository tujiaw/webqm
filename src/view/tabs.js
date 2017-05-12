import React from 'react';
import { Route, Link } from 'react-router-dom';
import Chat from './chat.js';
import About from './about.js';
import ContactContainer from '../container/contact_container';
import Styles from '../style/tabs.js';

class MainTab extends React.Component {
  componentDidMount() {
    console.log('main tab did mount');
  }

  render() {
    const url = this.props.match.url;
    return (
        <div style={Styles.main}>
          <div style={Styles.tab}>
              <Route exact path={`${url}`} component={Chat}/>
              <Route path={`${url}/contact`} component={ContactContainer}/>
              <Route path={`${url}/about`} component={About}/>
          </div>

          <div style={Styles.bottomPanel}>
              <ul style={Styles.bottomButtons}>
                <li><Link to={`${url}`}>会话列表</Link></li>
                <li><Link to={`${url}/contact`}>联系人</Link></li>
                <li><Link ref="/about" to={`${url}/about`}>我</Link></li>
              </ul>
          </div> 
        </div>
    )
  }
}

export default MainTab;