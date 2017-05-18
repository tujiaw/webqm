import {ReduceStore} from 'flux/utils';
import {List} from 'immutable';
import ActionTypes from '../actions/action_types';
import Dispatcher from '../dispatcher/dispatcher';

// const record = {
//   chatid: 0,
//   unreadCount: 0,
// }

class ChatStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return List();
  }

  reduce(state, action) {
    switch(action.type) {
      case ActionTypes.CHAT_INIT:
        if (action.chats) {
          state = List(action.chats);
        }
        return state;
      case ActionTypes.CHAT_ADD:
        return this.add(state, action);
      case ActionTypes.CHAT_INCREASE_UNREAD_MSG:
        return state;
      case ActionTypes.CHAT_REMOVE:
        if (action.chatid) {
          return state.filterNot(chat => { return chat.chatid === action.chatid });
        }
        return state;
      default:
        return state;
    }
  }

  add(state, action) {
    if (action.chatid) {
      const index = state.findIndex(item => item.chatid === action.chatid);
      if (index < 0) {
        const record = {
          chatid: action.chatid,
          unreadCount: 0,
          lastMsg: {}
        }
        state = state.push(record);
      }
    }
    return state;
  }
}

export default new ChatStore();