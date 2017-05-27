import TabsView from '../view/tabs';
import {Container} from 'flux/utils';
import ChatStore from '../store/chat_store';
import MsgStore from '../store/msg_store';

function getStores() {
  return [
    ChatStore,
    MsgStore,
  ];
}

function getState() {
  return {
    chats: ChatStore.getState(),
    msgs: MsgStore.getState(),
  };
}

export default Container.createFunctional(TabsView, getStores, getState);