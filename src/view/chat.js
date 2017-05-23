import React from 'react';
import Styles from '../style/chat';
import ChatList from './component/chat_list';

class Chat extends React.Component {
  componentWillUnMount() {
    //console.log('chat unmount:' + this.state.chats);
    console.log('componentWillUnMount, chats:' + this.props.chats);
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