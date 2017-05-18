import React, {Component} from 'react';
import Styles from '../../style/component/message';
import Util from '../../utils/util';
import {EMessageBodyType, QMMsgParser} from '../../utils/qmmsg';
const moment = require('moment');

class Message extends Component {
  render() {
    const {msg, users, isShowName, isShowDate} = this.props;
    const fromId = msg.header.from;
    const isSend = (fromId === Util.myid);
    const date = moment(msg.time).format('MM月DD日 dddd')
    const time = moment(msg.time).format('HH:mm:ss');
    const userInfo = users.get(fromId);
    let name = Util.getShowName(userInfo);

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
        {isShowDate && <div><span style={Styles.date}>{date}</span></div>}
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