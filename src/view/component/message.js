import React, {Component} from 'react';
import Styles from '../../style/component/message';
import Util from '../../utils/util';
import {EMessageBodyType, QMMsgParser} from '../../utils/qmmsg';
import UserCreators from '../../creators/user_creators';
import ImageLoader from './image_loader';
const moment = require('moment');

let FILESERVER_URL = '';
class MessageBody extends Component {
  getImageUrl = (uuid) => {
    if (FILESERVER_URL.length === 0) {
      const urls = UserCreators.getGlobalConfig(['FILESERVER_URL']);
      FILESERVER_URL = urls['FILESERVER_URL'] || '';
    }

    if (FILESERVER_URL.length) {
      const arr = uuid.split('_');
      if (arr.length > 1) {
        const leftUuid = arr[0];
        const leftDate = arr[1];
        if (leftDate.length !== 8) {
          return '';
        }
        const year = leftDate.slice(0, 4);
        const monthDate = leftDate.slice(-4);
        return `${FILESERVER_URL}/${year}/${monthDate}/${leftUuid}`;
      }
    }
    return '';
  }

  onOrigImagePreloader = (srcUrl) => {
    return <img src={srcUrl} alt='图片' style={Styles.img}/>;
  }
  render() {
    const self = this;
    const {isSend, msgBody} = this.props;
    const msgObj = (new QMMsgParser(msgBody)).getMsg();
    let colArr = [], rowArr = [], index=0;
    const textStyle = isSend ? Styles.sendContent : Styles.receiveContent;
    for (let i = 0, count = msgObj.bodyList.length; i < count; i++) {
      const body = msgObj.bodyList[i];
      if (body.type === EMessageBodyType.MSG_Body_Type_EnhancedTEXT) {
        // 文本，需要处理换行，每一行存储在rowArr中，多行存储在colArr中
        let pos = 0;
        const maxCount = body.msg.content.length;
        do {
          const newPos = body.msg.content.indexOf('\n', pos);
          if (newPos >= 0) {
            const sectionText = body.msg.content.slice(pos, newPos);
            if (sectionText.length) {
              rowArr.push(<span key={++index} style={textStyle}>{sectionText}</span>);
            } else {
              rowArr.push(<br key={++index}/>);
            }
            colArr.push(rowArr);
            rowArr = [];
            pos = newPos + 1;
          } else {
            rowArr.push(<span key={++index} style={textStyle}>{body.msg.content.slice(pos)}</span>);
            pos = newPos;
          }
        } while(pos < maxCount && pos >= 0);
      } else if (body.type === EMessageBodyType.MSG_Body_Type_EnhancedEmoticon) {
        // 系统表情
        const emoticonPath = Util.getEmoticonPath(body.msg.emotion);
        if (emoticonPath.length) {
          rowArr.push(<img key={++index} src={emoticonPath} alt='表情' style={Styles.img}/>);
        } else if (body.msg.describe) {
          rowArr.push(<span key={++index} style={textStyle}>{`[${body.msg.describe}]`}</span>);
        } else {
          rowArr.push(<span key={++index} style={textStyle}>[表情]</span>);
        }
      } else if (body.type === EMessageBodyType.MSG_Body_Type_PIC) {
        // 图片
        let imgwidth = `${body.msg.widthThumbnail || 100 }px`;
        let imgheight = `${body.msg.heightThumbnail || 100}px`;
        if (body.msg.origUrl && body.msg.origUrl.length) {
          rowArr.push(<img key={++index} src={body.msg.origUrl} alt='图片' style={[Styles.img, {width: imgwidth, height: imgheight}]}/>);
        } else if (body.msg.uuid && body.msg.uuid.length) {
          const thumbUrl = self.getImageUrl(body.msg.uuidThumbnail);
          const srcUrl = self.getImageUrl(body.msg.uuid);
          if (thumbUrl.length) {
            rowArr.push(<ImageLoader 
              style={Styles.img}
              key={++index}
              src={thumbUrl} 
              srcUrl={srcUrl}
              wrapper={React.DOM.div}
              preloader={self.onOrigImagePreloader.bind(self, {srcUrl})}>原图加载失败</ImageLoader>);
          } else {
            console.error('image url error:' + body.msg.uuid);
          }
        } else {
          rowArr.push(<span key={++index} style={textStyle}>[图片]</span>);
        }
      } else {
        rowArr.push(<span key={++index} style={textStyle}>[未解析类型:{body.type}]</span>);
      }
    }
    if (rowArr.length) {
      colArr.push(rowArr);
    }

    return (
      <div style={Styles.messageBody}>{
        colArr.map((arr) => {
          return <div style={Styles.rowContent} key={++index}>{arr}</div>
        })
      }</div>
    )}
}

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

    return (
      <div style={isSend ? Styles.sendMsg : Styles.receiveMsg}>
        {showDate && showDate.length && <div><span style={Styles.date}>{showDate}</span></div>}
        {isShowName && <div><span style={isSend ? Styles.sendName : Styles.receiveName}>{name + ':'}</span></div>}
        <div style={Styles.contentBox}>
          <MessageBody isSend={isSend} msgBody={msg.body}/>
          <div style={Styles.time}>
            <span>{time}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default Message;