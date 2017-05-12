
const BaseInfo = {
  // restful_host: 'http://localhost:4000/api/qm/',
  restful_host: '',
}

const Config = {
  websocket: 'ws://172.16.66.34:8090/api/websocket',
  restful: {
    login: BaseInfo.restful_host + 'login',
    friend: BaseInfo.restful_host + 'friend',
    sendmsg: BaseInfo.restful_host + 'sendmsg',
  }
}

export default Config;