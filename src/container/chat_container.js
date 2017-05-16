import Chat from '../view/chat';
import {Container} from 'flux/utils';
import ChatStore from '../store/chat_store';
import UsersStore from '../store/users_store';

function getStores() {
  return [
    ChatStore,
    UsersStore,
  ];
}

function getState() {
  return {
    chats: ChatStore.getState(),
    users: UsersStore.getState()
  };
}

export default Container.createFunctional(Chat, getStores, getState);