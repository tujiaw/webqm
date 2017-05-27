import WebApi from '../web/web_api';
import Util from '../utils/util';
import Actions from '../actions/actions';
import ActionCommon from '../actions/action_common';
import RoomStore from '../store/room_store';

const RoomCreators = {
  roomidList: [],
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
  }
}

export default RoomCreators;