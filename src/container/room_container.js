import Room from '../view/room';
import {Container} from 'flux/utils';
import RoomStore from '../store/room_store';

function getStores() {
  return [
    RoomStore
  ];
}

function getState() {
  return {
    rooms: RoomStore.getState()
  };
}

export default Container.createFunctional(Room, getStores, getState);