import React, {Component} from 'react';
import Styles from '../../style/component/message';
import Util from '../../utils/util';
import {EMessageBodyType, QMMsgParser} from '../../utils/qmmsg';
const moment = require('moment');

class Message extends Component {
  render() {
    const {msg, users, isShowName, showDate} = this.props;
    const fromId = msg.header.from;
    const isSend = (fromId === Util.myid);
    const time = moment(msg.time).format('HH:mm:ss');
    const user = users.get(fromId);
    let name = '';
    if (user) {
      name = Util.getShowName(user.userInfo);
    }

    const msgObj = (new QMMsgParser(msg.body)).getMsg();
    let msgContent = '';
    for (let i = 0, bodyCount = msgObj.bodyList.length; i < bodyCount; i++) {
      const body = msgObj.bodyList[i];
      if (body.type === EMessageBodyType.MSG_Body_Type_EnhancedTEXT) {
        msgContent += body.msg.content;
      }
    }

    return (
      <div style={isSend ? Styles.sendMsg : Styles.receiveMsg}>
        {showDate && showDate.length && <div><span style={Styles.date}>{showDate}</span></div>}
        {isShowName && <div><span style={isSend ? Styles.sendName : Styles.receiveName}>{name + ':'}</span></div>}
        <div style={Styles.contentBox}>
          <div style={isSend ? Styles.sendContent : Styles.receiveContent}>{msgContent}</div>
          <div style={Styles.time}>
            <span>{time}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default Message;