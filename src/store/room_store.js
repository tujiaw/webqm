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
          const index = state.indexOf(room => room.ID === action.room.ID);
          if (index >= 0) {
            state = state.update(index, room => room = action.room);
          } else {
            state = state.push(action.room);
          }
        }
        return state;
      case ActionTypes.ROOM_REMOVE:
      default:
        return state;
    }
  }
}

export default new RoomStore();