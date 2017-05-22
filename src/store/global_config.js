import {ReduceStore} from 'flux/utils';
import {Map} from 'immutable';
import Dispatcher from '../dispatcher/dispatcher';
import ActionTypes from '../actions/action_types';

class GlobalConfigStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return Map();
  }

  reduce(state, action) {
    switch(action.type) {
      case ActionTypes.GLOBAL_CONFIG_SET:
        if (action.key && action.value) {
          state = state.set(action.key, action.value);
        }
        return state;
      default:
        return state;
    }
  }
}

export default new GlobalConfigStore();