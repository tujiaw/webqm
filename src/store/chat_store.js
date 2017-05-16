import {ReduceStore} from 'flux/utils';
import {List} from 'immutable';
import ActionTypes from '../actions/action_types';
import Dispatcher from '../dispatcher/dispatcher';
import Util from '../utils/util';

// const record = {
//   chatid: 0,
//   unreadCount: 0,
//   lastMsg: {}
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
      case ActionTypes.CHAT_ADD_MSG:
        return this.addMsg(state, action);
      case ActionTypes.CHAT_INCREASE_UNREAD_MSG:
        return state;
      case ActionTypes.CHAT_UPDATE_LAST_MSG:
        state = state.update(item => {
          if (item.chatid === action.chatid) {
            item.lastMsg = action.lastMsg;
          }
        })
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

  addMsg(state, action) {
    if (action.msg) {
      const chatid = Util.getMsgChatId(action.msg);
      const index = state.findIndex(item => item.chatid === chatid);
      if (index >= 0) {
        state = state.update(index, item => item.lastMsg = action.msg);
      } else {
        const record = {
          chatid: chatid,
          unreadCount: 1,
          lastMsg: action.msg
        }
        state = state.push(record);
      }
    }
    return state;
  }
}

export default new ChatStore();