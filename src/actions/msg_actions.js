import MsgActionTypes from './msg_action_types';
import MsgDispatcher from '../dispatcher/msg_dispatcher';

const MsgActions = {
  addMsg: function(msg) {
    MsgDispatcher.dispatch({type: MsgActionTypes.ADD_MSG, msg});
  },
  removeMsg: function(chatId, msgId) {
    MsgDispatcher.dispatch({type: MsgActionTypes.REMOVE_MSG, chatId, msgId});
  }
}

export default MsgActions;