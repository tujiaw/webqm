import React, { Component } from 'react';
import Styles from '../../style/component/chat_list'
import Util from '../../utils/util';
import ghistory from '../../utils/ghistory';
import UserCreators from '../../creators/user_creators';
import moment from 'moment';

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

  onClick = (data) => {
    this.setState({
      action: ItemAction.selected
    });
    this.props.onItemClick && this.props.onItemClick(data.chatid, data.lastMsgId);
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
        onClick={this.onClick.bind(this, {chatid: this.props.chatid, lastMsgId: this.props.lastMsgId})}
      >
        <img style={Styles.avatar} src={this.props.avatar} alt='avatar'/>
        <div style={Styles.content}>
          <div style={Styles.username}>{this.props.name}</div>
          <div style={Styles.lastMsg}>{this.props.lastMsg}</div>
        </div>
        <div style={Styles.right}>
          <div style={Styles.time}>{this.props.time || ''}</div>
          <div style={this.props.unreadCount ? Styles.unreadCountVisible : Styles.unreadCountHidden}>{this.props.unreadCount}</div>
        </div>

      </div>
      )
  }
}

class ChatList extends Component {
  getLastMsg = (chat) => {
    const {chatid, lastReadMsgId} = chat;
    const {msgs} = this.props;
    const chatMsgs = msgs.get(chatid);
    if (chatMsgs) {
      const lastMsg = chatMsgs.last();
      if (lastMsg) {
        const time = moment(lastMsg.time).format('HH:mm');
        let unreadCount = chatMsgs.size;
        // 计算未读消息个数，总数减去已读消息数
        if (lastReadMsgId > 0) {
          const index = chatMsgs.findIndex((chat, index) => chat.id === lastReadMsgId);
          if (index >= 0) {
            unreadCount = unreadCount - index - 1;
          }
        }
        return {
          time: time,
          content: Util.getLastMsgContent(lastMsg),
          unreadCount: unreadCount,
          lastMsgId: lastMsg.id,
        }
      }
    }
    return undefined;
  }

  onItemClick = (chatid, lastMsgId) => {
    UserCreators.setCurrentId(chatid);
    UserCreators.setChatLastReadMsgId(chatid, lastMsgId);
    ghistory.push('/dialogue');
  }

  render() {
    const self = this;
    const {chats, users} = this.props;

    return (
      <div style={Styles.list}>
        {chats.map((chat, index) => {
          if (chat && chat.chatid) {
            const user = users.get(chat.chatid);
            if (user) {
              const avatar = Util.getUserAvatar(user.userInfo);
              const name = Util.getShowName(user.userInfo);
              const lastMsg = self.getLastMsg(chat);
              return <ChatItem key={index} 
                        chatid={chat.chatid} 
                        avatar={avatar}
                        name={name} 
                        unreadCount={lastMsg ? lastMsg.unreadCount : 0}
                        lastMsg={lastMsg ? lastMsg.content : ''}
                        lastMsgId={lastMsg ? lastMsg.lastMsgId : 0}
                        time={lastMsg ? lastMsg.time : ''}
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