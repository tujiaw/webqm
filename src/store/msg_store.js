import {ReduceStore} from 'flux/utils';
import {Map, List} from 'immutable';
import ActionTypes from '../actions/action_types';
import Dispatcher from '../dispatcher/dispatcher';
import Util from '../utils/util';

class MsgStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return Map();
  }

  reduce(state, action) {
    switch(action.type) {
      case ActionTypes.MSG_ADD:
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
      case ActionTypes.MSG_REMOVE:
        if (action.chatId && action.msgId) {
          
        }
        return state;
      default:
        return state;
    }
  }
}

export default new MsgStore();