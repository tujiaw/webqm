import Dialogue from '../view/dialogue';
import {Container} from 'flux/utils';
import {DialogueCurrentIdStore, DialogueMessagesStore} from '../store/dialogue_store';
import Actions from '../actions/actions';
import UsersStore from '../store/users_store';
import RoomStore from '../store/room_store';
import CompanyStore from '../store/company_store';

function getStores() {
  return [
    UsersStore,
    DialogueCurrentIdStore,
    DialogueMessagesStore,
    CompanyStore,
  ];
}

function getState() {
  return {
    currentId: DialogueCurrentIdStore.getState(),
    messages: DialogueMessagesStore.getState(),
    users: UsersStore.getState(),
    rooms: RoomStore.getState(),
    companies: CompanyStore.getState(),
  };
}

export default Container.createFunctional(Dialogue, getStores, getState);