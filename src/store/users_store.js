import {ReduceStore} from 'flux/utils';
import {Map, List} from 'immutable';
import ActionTypes from '../actions/action_types';
import Dispatcher from '../dispatcher/dispatcher';


class UsersStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return Map();
  }

  reduce(state, action) {
    switch(action.type) {
      case ActionTypes.USERS_ADD:
        if (action.user && action.user.userID) {
          return state.set(action.user.userID, action.user)
        }
        return state;
      default:
        return state;
    }
  }
}

export default new UsersStore();