import {ReduceStore} from 'flux/utils';
import {Map} from 'immutable';
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
        if (action.user && action.user.userInfo && action.user.userInfo.userID) {
          return state.set(action.user.userInfo.userID, action.user)
        }
        return state;
      case ActionTypes.USERS_UPDATE_AVATAR_LIST:
        if (action.userIdList && action.avatarIdList && action.avatarList) {
          if (action.userIdList.length === action.avatarIdList.length && 
              action.avatarIdList.length === action.avatarList.length) {
                for (let i = 0, count = action.userIdList.length; i < count; i++) {
                  const userid = action.userIdList[i];
                  let user = state.get(userid);
                  if (user && user.userInfo) {
                    const avatarId = action.avatarIdList[i];
                    const avatar = action.avatarList[i];
                    user.userInfo.avatarId = avatarId;
                    user.userInfo.avatar = avatar;
                    state = state.set(userid, user);
                  }
                }
              }
        }
        return state;
      default:
        return state;
    }
  }
}

export default new UsersStore();