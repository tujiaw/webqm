import React from 'react';
import Reflux from 'reflux';
import Styles from '../style/chat.js';
import ChatController from '../controller/chat_controller.js';

class Chat extends Reflux.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.store = ChatController.store;
  }

  componentWillMount() {
    //console.log('chat mount:' + this.state.chats);
  }

  componentWillUnMount() {
    console.log('chat unmount:' + this.state.chats);
  }

  render() {
    return (
      <div style={Styles.main}>
        <div>
          <h1>Chat</h1>
        </div>
      </div>
    )
  }
}

export default Chat;