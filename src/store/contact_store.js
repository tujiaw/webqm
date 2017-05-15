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
        }
        break;
      case ContactActionTypes.SET_GROUP_EXPAND:
        if (action.groupid !== undefined && action.isExpand !== undefined) {
          const index = state.findIndex(group => group.ID === action.groupid);
          state = state.update(index, group => {
              group.isExpand = action.isExpand;
              return group;
          });
          console.log(JSON.stringify(state));
        }
        break;
      default:
        break;
    }
    return state;
  }
}

export default new ContactStore();