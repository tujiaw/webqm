import ActionTypes from './action_types';
import Dispatcher from '../dispatcher/dispatcher';

const Actions = {
  chat: {
    init: function(chats) {
      Dispatcher.dispatch({ type: ActionTypes.CHAT_INIT, chats });
    },
    add: function(chat) {
      Dispatcher.dispatch({ type: ActionTypes.CHAT_ADD, chat });
    },
    remove: function(chat) {
      Dispatcher.dispatch({ type: ActionTypes.CHAT_REMOVE, chat });
    }
  },
  company: {
    add: function(company) {
      Dispatcher.dispatch({ type: ActionTypes.COMPANY_ADD, company });
    }
  },
  contact: {
    init: function(contacts) {
      Dispatcher.dispatch({ type: ActionTypes.CONTACT_INIT, contacts });
    },
    setGroupExpand: function(groupid, isExpand) {
      Dispatcher.dispatch({ type: ActionTypes.CONTACT_SET_GROUP_EXPAND, groupid, isExpand});
    }
  },
  dialogue: {
    setCurrentId: function(id) {
      Dispatcher.dispatch({ type: ActionTypes.DIALOGUE_SET_CURRENT_ID, id });
    },
    initMsgs: function(msgs) {
      Dispatcher.dispatch({ type: ActionTypes.DIALOGUE_INIT_MSGS, msgs });
    },
    addMsg: function(msg) {
      Dispatcher.dispatch({ type: ActionTypes.DIALOGUE_ADD_MESSAGE, msg });
    }
  },
  msg: {
    add: function(msg) {
      Dispatcher.dispatch({ type: ActionTypes.MSG_ADD, msg });
    },
    remove: function(chatId, msgId) {
      Dispatcher.dispatch({ type: ActionTypes.MSG_REMOVE, chatId, msgId });
    }
  },
  users: {
    add: function(user) {
      Dispatcher.dispatch({ type: ActionTypes.USERS_ADD, user });
    }
  }
}

export default Actions;