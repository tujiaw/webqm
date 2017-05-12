import { WebClient } from './web_socket.js';
import Config from '../config/config.js';
import Model from '../model/model.js';
import { QMMsgBuilder, QMMsgParser } from './qmmsg.js';

const MsgController = {
  onMsgCallback: function(msg) {
    console.log('MsgController on msg:' + msg);
  },
  sendMsg: function(id, msg) {
    const data = {
      "header": {
        "from": Model.auth.userid,
        "sourceNo": 0,
        "serialNo": 0,
        "errorCode": 0
      },
      "to": [
        id
      ],
      "type": 1,
      "body": "{\"bodyList\":[{\"type\":10,\"msg\":{\"content\":\"hello, world!\",\"type\":0,\"color\":0,\"size\":0,\"fontstyle\":0},\"basiccontent\":\"hello, world!\"}],\"bodyListType\":0,\"ExtendContent\":\"\",\"ServerSent\":false,\"notify\":0,\"isQQMsg\":false}",
      "keyServer": 0,
      "keyId": 0,
      "res": 0,
      "ServerSent": false
    }

    const builder = new QMMsgBuilder();
    data.body = JSON.stringify(builder.pushText(msg).getMsg());
    WebClient.request(Config.restful.sendmsg, data, function(res) {
      console.log(res);
    });
  }
}

export default MsgController;