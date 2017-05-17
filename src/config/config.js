
const BaseInfo = {
  // restful_host: 'http://localhost:4000/api/qm/',
  restful_host: '',
}

const Config = {
  websocket: 'ws://172.16.66.34:8090/api/websocket',
  // websocket: 'ws://172.16.16.91:8080/api/websocket',
  restful: {
    login: BaseInfo.restful_host + 'login',
    friend: BaseInfo.restful_host + 'friend',
    sendmsg: BaseInfo.restful_host + 'sendmsg',
    usergroup: BaseInfo.restful_host + 'usergroup',
    baseusers: BaseInfo.restful_host + 'user',
    company: BaseInfo.restful_host + 'company',
    useravatar: BaseInfo.restful_host + 'useravatar',
  }
}

export default Config;