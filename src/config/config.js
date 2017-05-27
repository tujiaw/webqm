
const BaseInfo = {
  // restful_host: 'http://localhost:4000/api/qm/',
  restful_host: '',
  prefix: '/webqm',
}

const Config = {
  prefix: BaseInfo.prefix,
  websocket: 'ws://172.16.66.34:8090/api/websocket',
  // websocket: 'ws://172.16.16.91:8080/api/websocket',
  restful: {
    login: BaseInfo.restful_host + 'login',
    gatewayLogin: BaseInfo.restful_host + 'Login',
    smlogin: BaseInfo.restful_host + 'SMReqLogin',

    presence: BaseInfo.restful_host + 'SMReqPresence',
    session: BaseInfo.restful_host + 'SMReqSession',

    friend: BaseInfo.restful_host + 'friend',
    room: BaseInfo.restful_host + 'room',
    sendmsg: BaseInfo.restful_host + 'sendmsg',
    usergroup: BaseInfo.restful_host + 'usergroup',
    userdetail: BaseInfo.restful_host + 'userdetail',
    company: BaseInfo.restful_host + 'company',
    useravatar: BaseInfo.restful_host + 'useravatar',
    setcustomconfig: BaseInfo.restful_host + 'setcustomconfig',
    customconfig: BaseInfo.restful_host + 'customconfig',
    globalconfig: BaseInfo.restful_host + 'globalconfig',
    ISReqUserRoomInfo: BaseInfo.restful_host + 'ISReqUserRoomInfo',
    search: BaseInfo.restful_host + 'search'
  },
  imgsdir: '/imgs',
  emoticondir: '/imgs/emoticon',
}

export default Config;