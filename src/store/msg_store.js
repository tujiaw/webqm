import {ReduceStore} from 'flux/utils';
import {Map, List} from 'immutable';
import MsgActionTypes from '../actions/msg_action_types';
import MsgDispatcher from '../dispatcher/msg_dispatcher';
import Util from '../utils/util';

class ChatStore extends ReduceStore {
  constructor() {
    super(MsgDispatcher);
  }

  getInitialState() {
    return Map();
  }

  reduce(state, action) {
    console.log('msg store: ' + action);
    switch(action.type) {
      case MsgActionTypes.ADD_MSG:
        const msg = action.msg;
        if (msg && msg.to.length) {
          const chatId = Util.getChatId(msg.header.from, msg.to[0]);
          if (state.get(chatId) !== undefined) {
            state = state.update(chatId, list => list.push(msg));
          } else {
            state = state.set(chatId, List([msg]));
          }
        }
        return state;
      case MsgActionTypes.REMOVE_MSG:
        if (action.chatId && action.msgId) {
          
        }
        return state;
      default:
        return state;
    }
  }
}

export default new MsgStore();