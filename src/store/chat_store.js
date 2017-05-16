import {ReduceStore} from 'flux/utils';
import {List} from 'immutable';
import ActionTypes from '../actions/action_types';
import Dispatcher from '../dispatcher/dispatcher';

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
        if (action.chat) {
          return state.push(action.chat);
        }
        return state;
      case ActionTypes.CHAT_REMOVE:
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