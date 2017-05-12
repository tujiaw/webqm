import React from 'react';
import DialogueNav from './component/dialogue_nav.js';
import Styles from '../style/dialogue.js';
import DialogueActions from '../actions/dialogue_actions';
import ghistory from '../utils/ghistory';
import MsgController from '../controller/msg_controller';

class Dialogue extends React.Component {
  onMessageSend = () => {
    const msg = this.refs.inputMessage.value;
    this.refs.inputMessage.value = '';
    this.refs.inputMessage.focus();
    DialogueActions.addMessage(134, msg);
    MsgController.sendMsg(this.props.currentId, msg);
  }

  onLeftButtonClick = () => {
    ghistory.goBack();
  }

  onRightButtonClick = () => {
  }

  render() {
    return (
      <div style={Styles.main}>
        <DialogueNav 
          onLeftButtonClick={this.onLeftButtonClick}
          onRightButtonClick={this.onRightButtonClick}
          id={this.props.currentId}
        />
        <div style={Styles.messagePanel}>
          {
            this.props.messages.map((msg, index) => {
              return <div key={index}>{msg}</div>;
            })
          }
        </div>
        <div style={Styles.inputPanel}>
          <button style={Styles.buttonFace} >表情</button>
          <input style={Styles.inputMessage} ref="inputMessage" type="text" />
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