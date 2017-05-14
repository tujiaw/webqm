import {ReduceStore} from 'flux/utils';
import {List} from 'immutable';
import ChatActionTypes from '../actions/chat_action_types';
import ChatDispatcher from '../dispatcher/chat_dispatcher';

class ChatStore extends ReduceStore {
  constructor() {
    super(ChatDispatcher);
  }

  getInitialState() {
    return List();
  }

  reduce(state, action) {
    console.log('chat store: ' + action);
    switch(action.type) {
      case ChatActionTypes.INIT_CHATS:
        if (action.chats) {
          state = List(action.chats);
        }
        return state;
      case ChatActionTypes.ADD_CHAT:
        if (action.chat) {
          return state.push(action.chat);
        }
        return state;
      case ChatActionTypes.REMOVE_CHAT:
        if (action.chat) {
          return state.filterNot(chat => { return chat === action.chat });
        }
        return state;
      default:
        return state;
    }
  }
}

export default new ChatStore();