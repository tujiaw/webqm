import ChatActionTypes from './chat_action_types';
import ChatDispatcher from '../dispatcher/chat_dispatcher';

const ChatActions = {
  initChats(chats) {
    ChatDispatcher.dispatch({ type: ChatActionTypes.INIT_CHATS, chats });
  },
  addChat(chat) {
    console.log('11111111111111');
    ChatDispatcher.dispatch({ type: ChatActionTypes.ADD_CHAT, chat });
  },
  removeChat(chat) {
    ChatDispatcher.dispatch({ type: ChatActionTypes.REMOVE_CHAT, chat });
  }
}

export default ChatActions;