import ActionTypes from './action_types';
import Dispatcher from '../dispatcher/dispatcher';

const Actions = {
  chat: {
    init: function(chats) {
      Dispatcher.dispatch({ type: ActionTypes.CHAT_INIT, chats });
    },
    add: function(chatid) {
      Dispatcher.dispatch({ type: ActionTypes.CHAT_ADD, chatid });
    },
    setLastReadMsgId: function(chatid, msgid) {
      Dispatcher.dispatch({ type: ActionTypes.CHAT_SET_LASTREADMSGID, chatid, msgid });
    },
    remove: function(chatid) {
      Dispatcher.dispatch({ type: ActionTypes.CHAT_REMOVE, chatid });
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
    },
    updateAvatarList: function(userIdList, avatarIdList, avatarList) {
      Dispatcher.dispatch({ type: ActionTypes.USERS_UPDATE_AVATAR_LIST, userIdList, avatarIdList, avatarList });
    }
  },
  config: {
    set: function(key, value) {
      Dispatcher.dispatch({ type: ActionTypes.CONFIG_SET, key, value });
    }
  },
  globalconfig: {
    set: function(key, value) {
      Dispatcher.dispatch({ type: ActionTypes.GLOBAL_CONFIG_SET, key, value });
    }
  }
}

export default Actions;