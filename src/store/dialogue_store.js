import { ReduceStore } from 'flux/utils';
import ActionTypes from '../actions/action_types';
import Dispatcher from '../dispatcher/dispatcher';
import { List } from 'immutable';

class DialogueMessagesStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return List();
  }

  reduce(state, action) {
    console.log('dialogue store:' + JSON.stringify(action));
    switch(action.type) {
      case ActionTypes.DIALOGUE_INIT_MSGS:
        state = (action.msgs === undefined ? List() : action.msgs);
        return state;
      case ActionTypes.DIALOGUE_ADD_MESSAGE:
        if (!action.msg) {
          return state;
        }
        return state.push(action.msg);
      default:
        return state;
    }
  }
}

class DialogueCurrentIdStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return 0;
  }

  reduce(state, action) {
    switch(action.type) {
      case ActionTypes.DIALOGUE_SET_CURRENT_ID:
        state = action.id || 0;
        return state;
      default:
        return state;
    }
  }
}

const messages = new DialogueMessagesStore();
const currentId = new DialogueCurrentIdStore();
export { messages as DialogueMessagesStore, currentId as DialogueCurrentIdStore};