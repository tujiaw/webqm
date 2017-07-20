import Actions from '../actions/actions';
import WebApi from '../web/web_api';
import ActionCommon from '../actions/action_common';
import Util from '../utils/util';
import ContactStore from '../store/contact_store';

const FavoriteCreators = {
  /**
   * 获取常用联系人
   */
  asyncGetFavorites: function () {
    return new Promise((resolve, reject) => {
      WebApi.customconfig(ActionCommon.auth, ['favorites'], (res) => {
        const resHeader = ActionCommon.checkResCommonHeader(res);
        if (resHeader.code !== 0 || res.body.retcode !== 0) {
          console.error('get favorites failed, ' + JSON.stringify(res));
        } else {
          if (res.body.value.length) {
            const favorites = res.body.value[0];
            if (favorites.id && favorites.id.length) {
              return resolve(favorites.id);
            }
          }
        }
        return resolve([]);
      })
    })
  },
  /**
   * 获取本地常用联系人列表
   */
  getLocalFavorites: function () {
    const usergroup = ContactStore.getState();
    let index = usergroup.findIndex(group => group.ID === Util.favoriteGroupId());
    const group = usergroup.get(index);
    return (group && group.users) ? group.users : [];
  },
  /**
   * 是否是常用联系人
   */
  isFavorite: function (id) {
    return FavoriteCreators.getLocalFavorites().indexOf(id) >= 0;
  },
  /**
   * 添加常用联系人
   */
  asyncAddFavorite: function (id) {
    const usergroup = ContactStore.getState();
    let index = usergroup.findIndex(group => group.ID === Util.favoriteGroupId());
    let group = usergroup.get(index);
    if (group && group.users) {
      index = group.users.indexOf(id);
      if (index >= 0) {
        return Promise.resolve();
      }
      group.users.push(id);
    } else {
      group = FavoriteCreators.createFavoritesGroup([id]);
    }
    return new Promise((resolve, reject) => {
      const favorites = {
        id: [],
        strId: []
      }
      for (const userid of group.users) {
        if (userid) {
          favorites.id.push(userid);
          favorites.strId.push('qm_' + userid);
        }
      }
      WebApi.setcustomconfig(ActionCommon.auth, ["favorites"], [favorites], (res) => {
        const resHeader = ActionCommon.checkResCommonHeader(res);
        if (resHeader.code === 0 && res.body.retcode === 0) {
          Actions.contact.add(group);
          return resolve();
        }
        return reject();
      })
    })
  },
  /**
   * 移除常用联系人
   */
  asyncRemoveFavorite: function (id) {
    const usergroup = ContactStore.getState();
    let index = usergroup.findIndex(group => group.ID === Util.favoriteGroupId());
    const group = usergroup.get(index);
    if (group && group.users) {
      index = group.users.indexOf(id);
      if (index >= 0) {
        group.users.splice(index, 1);
        return new Promise((resolve, reject) => {
          const favorites = {
            id: [],
            strId: []
          }
          for (const userid of group.users) {
            favorites.id.push(userid);
            favorites.strId.push('qm_' + userid);
          }
          WebApi.setcustomconfig(ActionCommon.auth, ["favorites"], [favorites], (res) => {
            const resHeader = ActionCommon.checkResCommonHeader(res);
            if (resHeader.code === 0 && res.body.retcode === 0) {
              Actions.contact.add(group);
              return resolve();
            }
            return reject();
          })
        })
      }
    }
    return Promise.reject();
  },
  /**
   * 增加常用联系人分组
   */
  createFavoritesGroup: function (users) {
    const favoritesGroup = {
      ID: Util.favoriteGroupId(),
      isExpand: true,
      name: '常用联系人',
      order: 0,
      users: (users && users.length) ? users : []
    }
    return favoritesGroup;
  },
}

export default FavoriteCreators;