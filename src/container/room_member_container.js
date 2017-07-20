import RoomMembers from '../view/component/room_members';
import {Container} from 'flux/utils';
import UsersStore from '../store/users_store';
import RoomMembersStore from '../store/room_members_store';
import CompanyStore from '../store/company_store';

function getStores() {
  return [
    UsersStore,
    RoomMembersStore,
    CompanyStore
  ];
}

function getState() {
  return {
    users: UsersStore.getState(),
    members: RoomMembersStore.getState(),
    companies: CompanyStore.getState()
  };
}

export default Container.createFunctional(RoomMembers, getStores, getState);