import Dialogue from '../view/dialogue';
import {Container} from 'flux/utils';
import {DialogueCurrentIdStore, DialogueMessagesStore} from '../store/dialogue_store';
import DialogueActions from '../actions/dialogue_actions';

function getStores() {
  return [
    DialogueCurrentIdStore,
    DialogueMessagesStore,
  ];
}

function getState() {
  return {
    currentId: DialogueCurrentIdStore.getState(),
    messages: DialogueMessagesStore.getState(),

    onAddMessage: DialogueActions.addMessage,
  };
}

export default Container.createFunctional(Dialogue, getStores, getState);