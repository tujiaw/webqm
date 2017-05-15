import React from 'react';
import DialogueNav from './component/dialogue_nav.js';
import Styles from '../style/dialogue.js';
import DialogueActions from '../actions/dialogue_actions';
import ghistory from '../utils/ghistory';
import {EMessageBodyType, MessageBodyListType, QMMsgParser} from '../utils/qmmsg';
import MsgCreators from '../creators/msg_creators';
import UserCreators from '../creators/user_creators';

class Dialogue extends React.Component {
  onMessageSend = () => {
    this.sendMsg();
    this.refs.inputMessage.focus();
  }

  onInputKeyDown = (event) => {
    if (event.keyCode !== 13) {
      return;
    }
    this.sendMsg();
  }

  sendMsg = () => {
    const msg = this.refs.inputMessage.value;
    this.refs.inputMessage.value = '';
    MsgCreators.asyncSendMsg(this.props.currentId, msg)
    .then((res) => {
      if (res.code === 0) {
        MsgCreators.addMsg(res.resMsg);
      }
    })
    .catch((code, error) => {

    });
  }

  onLeftButtonClick = () => {
    ghistory.goBack();
  }

  onRightButtonClick = () => {
    console.log(UserCreators.getCurrentId());
  }

  render() {
    const {messages} = this.props;
    return (
      <div style={Styles.main}>
        <DialogueNav 
          onLeftButtonClick={this.onLeftButtonClick}
          onRightButtonClick={this.onRightButtonClick}
          id={this.props.currentId}
        />
        <div style={Styles.messagePanel}>
          { messages.map((msg, index) => {
            const msgObj = (new QMMsgParser(msg.body)).getMsg();
            let msgContent = '';
            for (let i = 0, bodyCount = msgObj.bodyList.length; i < bodyCount; i++) {
              const body = msgObj.bodyList[i];
              if (body.type === EMessageBodyType.MSG_Body_Type_EnhancedTEXT) {
                msgContent += body.msg.content;
              }
            }
            return <div key={index}>{msgContent}</div>
          })}
        </div>
        <div style={Styles.inputPanel}>
          <button style={Styles.buttonFace} >表情</button>
          <input style={Styles.inputMessage} ref="inputMessage" type="text" onKeyDown={this.onInputKeyDown}/>
          <button style={Styles.buttonSend} onClick={this.onMessageSend}>发送</button>
        </div>
      </div>
    )
  }
}

function DialogueView(props) {
  return <Dialogue {...props} />
}

export default DialogueView;