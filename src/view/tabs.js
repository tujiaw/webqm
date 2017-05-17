import React from 'react';
import { Route, Link } from 'react-router-dom';
import About from './about.js';
import ChatContainer from '../container/chat_container';
import ContactContainer from '../container/contact_container';
import TopBar from './component/top_bar';
import Styles from '../style/tabs.js';

import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import MapsPersonPin from 'material-ui/svg-icons/maps/person-pin';
import ghistory from '../utils/ghistory';

const SelectPath = {
  0: '/main',
  1: '/main/contact',
  2: '/main/about'
}

class MainTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectIndex: 0,
    }
  }

  componentWillMount() {
    const currentPath = ghistory.location.pathname;
    for (let item in SelectPath) {
      if (SelectPath[item] === currentPath) {
        this.setState({
          selectIndex: parseInt(item)
        })
      }
    }
  }

  onChange = (value) => {
    this.setState({selectIndex: value});
    if (SelectPath[value]) {
      ghistory.push(SelectPath[value]);
    }
  }

  render() {
    const url = this.props.match.url;
    return (
        <div style={Styles.main}>
          <TopBar />
          <div style={Styles.tab}>
              <Route exact path={`${url}`} component={ChatContainer}/>
              <Route path={`${url}/contact`} component={ContactContainer}/>
              <Route path={`${url}/about`} component={About}/>
          </div>

          <Tabs onChange={this.onChange} initialSelectedIndex={this.state.selectIndex}>
            <Tab
              icon={<FontIcon className="material-icons">chat</FontIcon>}
              label="会话"
              value={0}
            />
            <Tab
              icon={<FontIcon className="material-icons">contacts</FontIcon>}
              label="联系人"
              value={1}
            />
            <Tab
              icon={<FontIcon className="material-icons">perm_identity</FontIcon>}
              label="我"
              value={2}
            />
          </Tabs>
        </div>
    )
  }
}

export default MainTab;