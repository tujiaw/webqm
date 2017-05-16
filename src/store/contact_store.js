import { ReduceStore } from 'flux/utils';
import ActionTypes from '../actions/action_types';
import Dispatcher from '../dispatcher/dispatcher';
import {List} from 'immutable';

class ContactStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return List();
  }

  reduce(state, action) {
    switch(action.type) {
      case ActionTypes.CONTACT_INIT:
        if (action.contacts) {
          state = List(action.contacts.sort((a, b) => a.order - b.order));
        }
        return state;
      case ActionTypes.CONTACT_SET_GROUP_EXPAND:
        if (action.groupid !== undefined && action.isExpand !== undefined) {
          const index = state.findIndex(group => group.ID === action.groupid);
          state = state.update(index, group => {
              group.isExpand = action.isExpand;
              return group;
          });
        }
        return state;
      default:
        return state;
    }
  }
}

export default new ContactStore();