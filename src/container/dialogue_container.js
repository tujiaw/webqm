import Dialogue from '../view/dialogue';
import {Container} from 'flux/utils';
import {DialogueCurrentIdStore, DialogueMessagesStore} from '../store/dialogue_store';
import Actions from '../actions/actions';
import UsersStore from '../store/users_store';

function getStores() {
  return [
    UsersStore,
    DialogueCurrentIdStore,
    DialogueMessagesStore,
  ];
}

function getState() {
  return {
    currentId: DialogueCurrentIdStore.getState(),
    messages: DialogueMessagesStore.getState(),
    users: UsersStore.getState(),

    onAddMessage: Actions.dialogue.addMsg,
  };
}

export default Container.createFunctional(Dialogue, getStores, getState);