import React from 'react';
import Styles from '../style/chat';
import ChatList from './component/chat_list';

class Chat extends React.Component {
  componentWillUnmount() {
    console.log('componentWillUnmount, chats:' + this.props.chats);
  }

  onItemClick = () => {

  }

  render() {
    return (
      <div style={Styles.main}>
        <ChatList {...this.props} onItemClick={this.onItemClick}/>
      </div>
    )
  }
}

function ChatView(props) {
  return <Chat {...props} />;
}

export default ChatView;