import {ReduceStore} from 'flux/utils';
import {List} from 'immutable';
import Dispatcher from '../dispatcher/dispatcher';
import ActionTypes from '../actions/action_types';

class RoomStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return List();
  }

  reduce(state, action) {
    switch(action.type) {
      case ActionTypes.ROOM_ADD:
        if (action.room) {
          const index = state.findIndex(room => room.ID === action.room.ID);
          if (index >= 0) {
            state = state.update(index, room => {
              if (action.room.avatar === undefined) {
                action.room.avatar = room.avatar;
              }
              return action.room;
            });
          } else {
            state = state.push(action.room);
          }
        }
        return state;
      case ActionTypes.ROOM_REMOVE:
        return state;
      case ActionTypes.ROOM_SETROOMOPENSEARCH:
        if (action.roomid && action.isOpenSearch !== undefined) {
          const index = state.findIndex(room => room.ID === action.roomid);
          if (index >= 0) {
            state = state.update(index, room => {
              room.openInSearch = action.isOpenSearch;
              return room;
            })
          }
        }
        return state;
      default:
        return state;
    }
  }
}

export default new RoomStore();