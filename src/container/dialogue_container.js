import Dialogue from '../view/dialogue';
import {Container} from 'flux/utils';
import DialogueStore from '../store/dialogue_store';
import DialogueActions from '../actions/dialogue_actions';

function getStores() {
  return [
    DialogueStore,
  ];
}

function getState() {
  return {
    messages: DialogueStore.getState(),
    onAddMessage: DialogueActions.addMessage,
  };
}

export default Container.createFunctional(Dialogue, getStores, getState);