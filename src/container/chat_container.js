import Chat from '../view/chat';
import {Container} from 'flux/utils';
import ChatStore from '../store/chat_store';

function getStores() {
  return [
    ChatStore,
  ];
}

function getState() {
  return {
    chats: ChatStore.getState()
  };
}

export default Container.createFunctional(Chat, getStores, getState);