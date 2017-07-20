import {ReduceStore} from 'flux/utils';
import {List} from 'immutable';
import Dispatcher from '../dispatcher/dispatcher';
import ActionTypes from '../actions/action_types';

class RoomMembersStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return List();
  }

  reduce(state, action) {
    switch(action.type) {
      case ActionTypes.ROOMMEMBERS_INIT:
        state = (action.members === undefined ? List() : List(action.members));
        return state;
      case ActionTypes.ROOMMEMBERS_UPDATE:
        if (action.id && action.name) {
          const index = state.findIndex(item => parseInt(item.id, 10) === parseInt(action.id, 10));
          state = state.update(index, item => {
            item.name = action.name;
            return item;
          })
        }
        return state;
      default:
        return state;
    }
  }
}

export default new RoomMembersStore();