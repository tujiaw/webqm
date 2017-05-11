import React from 'react';
import DialogueNav from './component/dialogue_nav.js';
import Styles from '../style/dialogue.js';

class Dialogue extends React.Component {
  onMessageSend = () => {
    const msg = this.refs.inputMessage.value;
    console.log(msg);
    const addMessage = () => this.props.onAddMessage(msg);
    addMessage();
    this.refs.inputMessage.value = '';
    this.refs.inputMessage.focus();
  }

  render() {
    return (
      <div style={Styles.main}>
        <DialogueNav 
        />
        <div style={Styles.messagePanel}>
          {this.props.messages.map((msg, index) => {
            return <div key={index}>{msg}</div>;
          })}
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