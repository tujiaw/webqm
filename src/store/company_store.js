import {ReduceStore} from 'flux/utils';
import {Map} from 'immutable';
import Dispatcher from '../dispatcher/dispatcher';
import ActionTypes from '../actions/action_types';

class CompanyStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return Map();
  }

  reduce(state, action) {
    switch(action.type) {
      case ActionTypes.COMPANY_ADD:
        if (action.company && action.company.companyId) {
          state = state.set(action.company.companyId, action.company);
        }
        return state;
      default:
        return state;
    }
  }
}

export default new CompanyStore();