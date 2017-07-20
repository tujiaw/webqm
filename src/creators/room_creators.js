import WebApi from '../web/web_api';
import Actions from '../actions/actions';
import ActionCommon from '../actions/action_common';
import RoomStore from '../store/room_store';
import { Base64 } from 'js-base64';

const RoomCreators = {
  roomidList: [],
  /**
   * 获取群ID列表
   */
  asyncGetRoomIdList: function() {
    if (this.roomidList.length) {
      return Promise.resolve(this.roomidList);
    }

    const self = this;
    return new Promise((resolve, reject) => {
      WebApi.room(ActionCommon.auth, (res) => {
        const resHeader = ActionCommon.checkResCommonHeader(res);
        if (resHeader.code === 0 && res.body.retcode === 0) {
          self.roomidList = res.body.roomId;
        }
        return resolve(self.roomidList);
      })
    })
  },
  
  /**
   * 获取群信息列表
   */
  asyncGetRoomInfoList: function(roomIdList) {
    if (!roomIdList) {
      return Promise.resolve();
    }

    if (typeof roomIdList === 'number') {
      roomIdList = [roomIdList];
    }

    const result = {}
    const requestList = [];
    const rooms = RoomStore.getState();
    for (let i = 0, count = roomIdList.length; i < count; i++) {
      const roomId = roomIdList[i];
      const findRoom = rooms.find(room => room.ID === roomId);
      if (findRoom) {
        result[roomId] = findRoom;
      } else {
        requestList.push(roomId);
      }
    }
    if (requestList.length === 0) {
      return Promise.resolve(result);
    }

    return new Promise((resolve, reject) => {
      WebApi.roomInfoList(ActionCommon.auth, requestList, (res) => {
        const resHeader = ActionCommon.checkResCommonHeader(res);
        if (resHeader.code === 0 && res.body.retcode === 0) {
          for (let room of res.body.roomInfo) {
            Actions.room.add(room);
            result[room.ID] = room;
          }
        }
        return resolve(result);
      })
    })
  },

  /**
   * 获取群成员列表
   */
  // 逻辑重复待优化
  asyncGetRoomMemberList: function(roomIdList) {
    if (!roomIdList) {
      return Promise.resolve();
    }

    if (typeof roomIdList === 'number') {
      roomIdList = [roomIdList];
    }

    const result = {}
    const requestList = [];
    const rooms = RoomStore.getState();
    for (let i = 0, count = roomIdList.length; i < count; i++) {
      const roomId = roomIdList[i];
      const findRoom = rooms.find(room => room.ID === roomId);
      if (findRoom && findRoom.memberInfo.length > 1) {
        result[roomId] = findRoom;
      } else {
        requestList.push(roomId);
      }
    }
    if (requestList.length === 0) {
      return Promise.resolve(result);
    }

    return new Promise((resolve, reject) => {
      WebApi.roomMemberList(ActionCommon.auth, requestList, (res) => {
        const resHeader = ActionCommon.checkResCommonHeader(res);
        if (resHeader.code === 0 && res.body.retcode === 0) {
          for (let room of res.body.roomInfo) {
            Actions.room.add(room);
            result[room.ID] = room; // 这里的群信息没有头像
          }
        }
        return resolve(result);
      })
    })
  },

  /**
   * 设置群开放搜索
   */
  asyncSetRoomOpenSearch: function(roomid, isOpenSearch) {
    return new Promise((resolve, reject) => {
      WebApi.setRoomInfo(ActionCommon.auth, roomid, 'openSearch', isOpenSearch, (res) => {
        const resHeader = ActionCommon.checkResCommonHeader(res);
        if (resHeader.code === 0 && res.body.retcode === 0) {
          Actions.room.setRoomOpenSearch(roomid, isOpenSearch);
          console.log('1111111111111111111');
          return resolve();
        }
        console.log('222222222222222222');
        return reject({code: res.body.retcode, error: Base64.decode(res.body.error_desc)})
      })
    })
  },

  initRoomMembers: function(members) {
    Actions.roommembers.init(members);
  },
  updateRoomMember: function(id, name) {
    Actions.roommembers.update(id, name);
  }
}

export default RoomCreators;