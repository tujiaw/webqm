import { ReduceStore } from 'flux/utils';
import ContactActionTypes from '../actions/contact_action_types';
import ContactDispatcher from '../dispatcher/contact_dispatcher';
import {List} from 'immutable';

class ContactStore extends ReduceStore {
  constructor() {
    super(ContactDispatcher);
  }

  getInitialState() {
    return List();
  }

  reduce(state, action) {
    switch(action.type) {
      case ContactActionTypes.INIT_CONTACT:
        if (action.contacts) {
          state = List(action.contacts);
          return state;
        }
        return state;
      default:
        return state;
    }
  }
}

export default new ContactStore();