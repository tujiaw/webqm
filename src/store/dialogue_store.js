import { ReduceStore } from 'flux/utils';
import DialogueActionTypes from '../actions/dialogue_action_types';
import DialogueDispatcher from '../dispatcher/dialogue_dispatcher';
import { List } from 'immutable';

class DialogueMessagesStore extends ReduceStore {
  constructor() {
    super(DialogueDispatcher);
  }

  getInitialState() {
    return List();
  }

  reduce(state, action) {
    console.log('dialogue store:' + JSON.stringify(action));
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

class DialogueCurrentIdStore extends ReduceStore {
  constructor() {
    super(DialogueDispatcher);
  }

  getInitialState() {
    return 0;
  }

  reduce(state, action) {
    switch(action.type) {
      case DialogueActionTypes.SET_CURRENT_ID:
        return action.id;
      default:
        return state;
    }
  }
}

const messages = new DialogueMessagesStore();
const currentId = new DialogueCurrentIdStore();
export { messages as DialogueMessagesStore, currentId as DialogueCurrentIdStore};