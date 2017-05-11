import { List } from 'immutable';
import { ReduceStore } from 'flux/utils';
import DialogueActionTypes from '../actions/dialogue_action_types';
import DialogueDispatcher from '../dispatcher/dialogue_dispatcher';

class DialogueStore extends ReduceStore {
  constructor() {
    super(DialogueDispatcher);
  }

  getInitialState() {
    return List([]);
  }

  reduce(state, action) {
    switch(action.type) {
      case DialogueActionTypes.ADD_MESSAGE:
        if (!action.msg) {
          return state;
        }
        return state.push(action.msg);
      default:
        return state;
    }
  }
}

export default new DialogueStore();