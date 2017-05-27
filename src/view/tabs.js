import React from 'react';
import { Route } from 'react-router-dom';
import About from './about.js';
import ChatContainer from '../container/chat_container';
import ContactContainer from '../container/contact_container';
import RoomContainer from '../container/room_container';
import TopBar from './component/top_bar';
import Styles from '../style/tabs.js';
import Config from '../config/config';

import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import ghistory from '../utils/ghistory';

class MainTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectIndex: 0,
      pages: [
        {
          path: `${Config.prefix}/main`, 
          pageName: 'chat', 
          label: '会话',
          iconName: 'chat',
        }, 
        { 
          path: `${Config.prefix}/main/contact`, 
          pageName: 'contact', 
          label: '联系人',
          iconName: 'contacts',
        }, 
        { 
          path: `${Config.prefix}/main/room`, 
          pageName: 'room', 
          label: '群',
          iconName: 'group',
        }, 
        { 
          path: `${Config.prefix}/main/about`, 
          pageName: 'about', 
          label: '我',
          iconName: 'perm_identity',
        }
      ]
    }
  }

  componentWillMount() {
    const currentPath = ghistory.location.pathname;
    for (let i = 0; i < this.state.pages.length; i++) {
      if (this.state.pages[i].path === currentPath) {
        this.setState({
          selectIndex: i
        })
      }
    }
  }

  onChange = (value) => {
    this.setState({selectIndex: value});
    if (this.state.pages[value]) {
      ghistory.push(this.state.pages[value].path);
    }
  }

  getUnreadMsgCount = () => {
    const {chats, msgs} = this.props;
    let total = 0;
    for (let chat of chats) {
      const chatMsgs = msgs.get(chat.chatid);
      if (chatMsgs) {
        if (chat.lastReadMsgId === 0) {
          total += chatMsgs.size;
        } else {
          const index = chatMsgs.findIndex(msg => msg.id === chat.lastReadMsgId);
          if (index >= 0) {
            total += chatMsgs.size - index - 1;
          }
        }
      }
    }
    return total;
  }

  render() {
    const pages = this.state.pages;
    const prefix = pages[0].path;
    const curPage = pages[this.state.selectIndex];
    const badge = {
      index: 0,
      visible: this.getUnreadMsgCount()
    }

    return (
        <div style={Styles.main}>
          <TopBar title={curPage.label} pageName={curPage.pageName}/>
          <div style={Styles.pageList}>
              <Route exact path={`${prefix}`} component={ChatContainer}/>
              <Route path={`${prefix}/contact`} component={ContactContainer}/>
              <Route path={`${prefix}/room`} component={RoomContainer}/>
              <Route path={`${prefix}/about`} component={About}/>
          </div>
          <Tabs onChange={this.onChange} initialSelectedIndex={this.state.selectIndex}>
            {this.state.pages.map((page, index) => {
              const badgeStyle = (badge.index === index && badge.visible) ? Styles.badgeVisible : Styles.badgeHidden;
              return <Tab
                key={index}
                icon={<FontIcon className="material-icons">
                  <div>{page.iconName}<div style={badgeStyle}></div></div>
                </FontIcon>}
                label={page.label}
                value={index}
                style={Styles.tab}
                buttonStyle={Styles.tabButton}
              />
            })}
          </Tabs>
        </div>
    )
  }
}


function TabsView(props) {
  return <MainTab {...props} />
}

export default TabsView;