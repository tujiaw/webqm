import Chat from '../view/chat';
import {Container} from 'flux/utils';
import ChatStore from '../store/chat_store';
import UsersStore from '../store/users_store';
import MsgStore from '../store/msg_store';

function getStores() {
  return [
    ChatStore,
    UsersStore,
    MsgStore,
  ];
}

function getState() {
  return {
    chats: ChatStore.getState(),
    users: UsersStore.getState(),
    msgs: MsgStore.getState(),
  };
}

export default Container.createFunctional(Chat, getStores, getState);