import {EMessageBodyType, QMMsgParser} from './qmmsg';
import Config from '../config/config';

const ID_RANGE = {
  ID_RANGE_START: 10000000,
  ID_USER_RESERVE: 10000000,
  ID_USER: 10000001,
  ID_Virtual_USER: 988000000,         // 虚拟用户起始位置
  ID_USER_MAX: 988888888,
  ID_MASS_ASSISTANT: 988888889,
  ID_SESSION_ASSISTANT: 988888890,	  // 消息助手
  ID_ORG: 988900000,                  // 森浦客服机构号
	ID_ORG_XINGYE: 988900001,           // 兴业机构号	
	ID_ORG_FIX: 988999000,              // 固定机构号起始位置
	ID_ORG_FinancialNews: 988999001,    // 财经快讯
	ID_ORG_Sumscope: 988999002,         // 森浦提醒机构号
	ID_ORG_SWHY: 988999003,             // 申万宏源
	ID_ORG_PAZQ: 988999004,             // 平安证券
	ID_ORG_CLP: 988999005,              // 财联社
	ID_ORG_WS: 988999006,               // 华尔街见闻 
	ID_ORG_SS: 988999023,	              // 森浦资讯机构号
	ID_ORG_NONCOOP: 988999500,	        // 非合作方机构号起始位置	
	ID_ORG_MAX: 989000000,
	ID_ROBOT: 989000001,	
  ID_ROOM_RESERVE: 1000000000,
  ID_ROOM: 1000000001,
	ID_RANGE_END: 2000000000,
}

const APPID = 0x00B;
const TOPIC_CLIENT_MSG = ((APPID<<20) | 0x00002);
const TOPIC_CLIENT_ROOM_MSG = ((APPID<<20) | 0x00004);

const SYS_AVATAR_COUNT = 35; // 系统头像数目

const Util = {
  myid: 0,
  isQmUserId: function(id) {
    return id && id >= ID_RANGE.ID_USER_RESERVE && id < ID_RANGE.ID_Virtual_USER;
  },
  isQmRoomId: function(id) {
    return id && id >= ID_RANGE.ID_ROOM_RESERVE && id < ID_RANGE.ID_RANGE_END;
  },
  isQmOrgId: function(id) {
    return id && id >= ID_RANGE.ID_ORG && id < ID_RANGE.ID_ORG_MAX;
  },
  isQmRobotId: function(id) {
    return id && id === ID_RANGE.ID_ROBOT;
  },
  getChatId(fromId, toId) {
    if (this.myid === 0) {
      console.error('my id is 0');
    }
    if (this.isQmRoomId(toId)) {
      return toId;
    } else if (fromId === this.myid) {
      return toId;
    } else {
      return fromId;
    }
  },
  getMsgChatId(msg) {
    if (msg && msg.to.length && msg.header && msg.header.from) {
      return this.getChatId(msg.header.from, msg.to[0]);
    }
    return 0;
  },
  getShowName(userInfo) {
    if (userInfo) {
      if (userInfo.name && userInfo.name.length) {
        return userInfo.name;
      }
      if (userInfo.loginName && userInfo.loginName.length) {
        return userInfo.loginName;
      }
    }
    return '';
  },
  isTopicClientMsg(id) {
    return TOPIC_CLIENT_MSG === id;
  },
  isTopicClientRoomMsg(id) {
    return TOPIC_CLIENT_ROOM_MSG === id;
  },
  padZero(str, count) {
    return new Array(count - str.length + 1).join('0') + str;
  },
  isSysAvatar(avatarId) {
    return avatarId !== undefined && avatarId >= 0 && avatarId <= SYS_AVATAR_COUNT;
  },
  getUserAvatar(userInfo) {
    const avatarId = userInfo.avatarId;
    if (avatarId === 0) {
      return this.getDefaultAvatar(userInfo.ID);
    }
    if (this.isSysAvatar(avatarId)) {
      const IMAGES_MAIN_COUNT = 15;
      const womanNumber = avatarId - IMAGES_MAIN_COUNT;
      if (womanNumber > 0) {
        const temp = this.padZero(womanNumber + '', 2);
        return `${Config.imgsdir}/avatar/images_woman_${temp}.png`;
      } else {
        const temp = this.padZero(avatarId + '', 2);
        return `${Config.imgsdir}/avatar/images_man_${temp}.png`;
      }
    } else if (userInfo.avatar && userInfo.avatar.length) {
      return 'data:image/png;base64,' + userInfo.avatar;
    } else {
      return this.getDefaultAvatar(userInfo.ID);
    }
  },
  isRoomOwner(roomInfo) {
    if (roomInfo.memberInfo) {
      for (let member of roomInfo.memberInfo) {
        if (member.role === 'ROLE_OWNER' && member.id === this.myid) {
          return true;
        }
      }
    }
    return false;
  },
  getRoomAvatar(roomInfo) {
    const avatarId = roomInfo.avatarId;
    if (avatarId === 0) {
      if (this.isRoomOwner(roomInfo)) {
        return Config.imgsdir + '/avatar/room_head_80_1.png';
      } else {
        return Config.imgsdir + '/avatar/room_head_80.png';
      }
    } else if (roomInfo.avatar && roomInfo.avatar.length){
      return 'data:image/png;base64,' + roomInfo.avatar;
    } else {
      return this.getDefaultAvatar(roomInfo.ID);
    }
  },
  getDefaultAvatar(id) {
    if (this.isQmUserId(id)) {
      return Config.imgsdir + '/avatar/default.png';  
    } else if (this.isQmOrgId(id)) {
      return Config.imgsdir + '/avatar/org_head80.png';  
    } else if (this.isQmRoomId(id)) {
      return Config.imgsdir + '/avatar/room_head_80.png';  
    }
    return Config.imgsdir + '/avatar/default.png';
  },
  getEmoticonPath(emoticon) {
    if (emoticon && emoticon.length) {
      const types = ['face', 'smartq', 'qqsys', 'emoji'];
      let arr = emoticon.split('/');
      if (arr.length > 1) {
        const type = arr[1].toLowerCase();
        if (types.indexOf(type) >= 0) {
          arr[0] = Config.imgsdir + '/emoticon';
          return arr.join('/');
        }
      }
    }
    return '';
  },
  isEmptyObject(obj) {
    for (let i in obj) {
      return !1;
    }
    return !0;
  },
  getLastMsgContent(msg) {
    if (this.isEmptyObject(msg)) {
      return '  ';
    }
    const msgObj = (new QMMsgParser(msg.body)).getMsg();
    let msgContent = '';
    for (let i = 0, bodyCount = msgObj.bodyList.length; i < bodyCount; i++) {
      const body = msgObj.bodyList[i];
      if (body.type === EMessageBodyType.MSG_Body_Type_EnhancedTEXT) {
        msgContent += body.msg.content;
      }
    }
    return msgContent.length ? msgContent : '  ';
  },
}

export default Util;