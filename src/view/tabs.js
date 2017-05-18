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

const Pages = [
  {
    path: '/main', 
    pageName: 'chat', 
    label: '会话',
    iconName: 'chat',
  }, 
  { 
    path: '/main/contact', 
    pageName: 'contact', 
    label: '联系人',
    iconName: 'contacts',
  }, 
  { 
    path: '/main/about', 
    pageName: 'about', 
    label: '我',
    iconName: 'perm_identity',
  }
]

class MainTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectIndex: 0,
    }
  }

  componentWillMount() {
    const currentPath = ghistory.location.pathname;
    for (let i = 0; i < Pages.length; i++) {
      if (Pages[i].path === currentPath) {
        this.setState({
          selectIndex: i
        })
      }
    }
  }

  onChange = (value) => {
    this.setState({selectIndex: value});
    if (Pages[value]) {
      ghistory.push(Pages[value].path);
    }
  }

  render() {
    const url = this.props.match.url;
    const curPage = Pages[this.state.selectIndex];
    return (
        <div style={Styles.main}>
          <TopBar title={curPage.label} pageName={curPage.pageName}/>
          <div style={Styles.tab}>
              <Route exact path={`${url}`} component={ChatContainer}/>
              <Route path={`${url}/contact`} component={ContactContainer}/>
              <Route path={`${url}/about`} component={About}/>
          </div>
          <Tabs onChange={this.onChange} initialSelectedIndex={this.state.selectIndex}>
            {Pages.map((page, index) => {
              return <Tab
                icon={<FontIcon className="material-icons">{page.iconName}</FontIcon>}
                label={page.label}
                value={index}
              />
            })}
          </Tabs>
        </div>
    )
  }
}

export default MainTab;