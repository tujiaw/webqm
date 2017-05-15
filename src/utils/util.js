
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

const Util = {
  myid: 0,
  isQmUserId: function(id) {
    return id >= ID_RANGE.ID_USER_RESERVE && id < ID_RANGE.ID_Virtual_USER;
  },
  isQmRoomId: function(id) {
    return id >= ID_RANGE.ID_ROOM_RESERVE && id < ID_RANGE.ID_RANGE_END;
  },
  isQmOrgId: function(id) {
    return id >= ID_RANGE.ID_ORG && id < ID_RANGE.ID_ORG_MAX;
  },
  isQmRobotId: function(id) {
    return id === ID_RANGE.ID_ROBOT;
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
  isTopicClientMsg(id) {
    return TOPIC_CLIENT_MSG === id;
  },
  isTopicClientRoomMsg(id) {
    return TOPIC_CLIENT_ROOM_MSG === id;
  }
}

export default Util;