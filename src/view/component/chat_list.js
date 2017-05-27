import React, { Component } from 'react';
import Styles from '../../style/component/chat_list'
import Util from '../../utils/util';
import ghistory from '../../utils/ghistory';
import UserCreators from '../../creators/user_creators';
import moment from 'moment';
import Config from '../../config/config';

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
    const {data} = this.props;

    return (
      <div 
        style={getItemStyle()}
        onMouseEnter={this.onMouseEnter} 
        onMouseLeave={this.onMouseLeave} 
        onClick={this.onClick.bind(this, data)}
      >
        <img style={Styles.avatar} src={data.avatar} alt='avatar'/>
        <div style={Styles.content}>
          <div style={Styles.username}>{data.name}</div>
          <div style={Styles.lastMsg}>{data.lastMsg}</div>
        </div>
        <div style={Styles.right}>
          <div style={Styles.time}>{data.time || ''}</div>
          <div style={data.unreadCount ? Styles.unreadCountVisible : Styles.unreadCountHidden}>{data.unreadCount}</div>
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
          millisecond: lastMsg.time,
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
    ghistory.push(`${Config.prefix}/dialogue`);
  }

  render() {
    const self = this;
    const {chats, users, rooms} = this.props;
    const data = [];
    chats.map((chat, index) => {
      if (chat && chat.chatid) {
        const result = UserCreators.getBaseInfo(chat.chatid)
        if (result.avatar && result.name) {
          const lastMsg = self.getLastMsg(chat);
          data.push({
            millisecond: lastMsg ? lastMsg.millisecond : 0,
            chatid: chat.chatid,
            avatar: result.avatar,
            name: result.name,
            unreadCount: lastMsg ? lastMsg.unreadCount : 0,
            lastMsg: lastMsg ? lastMsg.content : '',
            lastMsgId: lastMsg ? lastMsg.lastMsgId : 0,
            time: lastMsg ? lastMsg.time : '',
          })
        }
      }
    })

    data.sort((a, b) => {
      if (a.millisecond !== 0 && b.millisecond !== 0) {
        return parseInt(b.millisecond) - parseInt(a.millisecond);
      } else if (a.millisecond === 0 && b.millisecond === 0) {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
      } else {
        return parseInt(b.millisecond) - parseInt(a.millisecond);
      }
    })

    return (
      <div style={Styles.list}>
        {data.map((item, index) => {
            return <ChatItem key={index} 
              data={item}
              onItemClick={this.onItemClick}
            />
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