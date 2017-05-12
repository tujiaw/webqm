import React from 'react';
import Styles from '../style/chat.js';

class Chat extends React.Component {
  componentWillMount() {
    //console.log('chat mount:' + this.state.chats);
  }

  componentWillUnMount() {
    //console.log('chat unmount:' + this.state.chats);
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