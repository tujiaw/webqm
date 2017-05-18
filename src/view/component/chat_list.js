import React, { Component } from 'react';
import Styles from '../../style/component/chat_list'
import Util from '../../utils/util';
import ghistory from '../../utils/ghistory';
import UserCreators from '../../creators/user_creators';

const ItemAction = {
  normal: 'normal',
  hover: 'hover',
  selected: 'selected'
};

class ChatItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      action: ItemAction.normal
    }
  }

  onMouseEnter = () => {
    this.setState({
      action: ItemAction.hover
    });
  }

  onMouseLeave = () => {
    this.setState({
      action: ItemAction.normal
    });
  }

  onClick = () => {
    this.setState({
      action: ItemAction.selected
    });
    if (this.props.onItemClick) {
      this.props.onItemClick(this.props.chatid);
    }
  }

  render() {
    const self = this;
    function getItemStyle() {
      if (self.state.action === ItemAction.hover) {
        return Styles.itemHover;
      } else if (self.state.action === ItemAction.selected) {
        return Styles.itemSelected;
      } else {
        return Styles.item;
      }
    }

    return (
      <div 
        style={getItemStyle()}
        onMouseEnter={this.onMouseEnter} 
        onMouseLeave={this.onMouseLeave} 
        onClick={this.onClick}
      >
        <img style={Styles.avatar} src={this.props.avatar} alt='avatar'/>
        <div style={Styles.content}>
          <div style={Styles.username}>{this.props.name}</div>
          <div style={Styles.lastMsg}>{this.props.lastMsg}</div>
        </div>
      </div>
      )
  }
}

class ChatList extends Component {
  getLastMsg = (chatid) => {
    const {msgs} = this.props;
    const chatMsgs = msgs.get(chatid);
    if (chatMsgs) {
      const lastMsg = chatMsgs.last();
      if (lastMsg) {
        return Util.getLastMsgContent(lastMsg);
      }
    }
    return '';
  }

  onItemClick = (chatid) => {
    UserCreators.setCurrentId(chatid);
    ghistory.push('/dialogue');
  }

  render() {
    const self = this;
    const {chats, users} = this.props;

    return (
      <div style={Styles.list}>
        {chats.map((chat, index) => {
          if (chat && chat.chatid) {
            const userInfo = users.get(chat.chatid);
            if (userInfo) {
              const avatar = Util.getUserAvatar(userInfo);
              const name = Util.getShowName(userInfo);
              const unreadCount = chat.unreadCount;
              const lastMsg = self.getLastMsg(chat.chatid);
              return <ChatItem key={index} 
                        chatid={chat.chatid} 
                        avatar={avatar}
                        name={name} 
                        unreadCount={unreadCount} 
                        lastMsg={lastMsg} 
                        onItemClick={this.onItemClick}
                      />
            }
          }
          return '';
        })}
      </div>
    )
  }
}

// ChatList.propTypes = {
//   data: PropTypes.object.isRequired,
//   onItemClick: PropTypes.func
// }

export default ChatList;