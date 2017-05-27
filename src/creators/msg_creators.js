import WebApi from '../web/web_api';
import UserCreators from './user_creators';
import RoomCreators from './room_creators';
import MsgStore from '../store/msg_store';
import Util from '../utils/util';
import Actions from '../actions/actions';
import ActionCommon from '../actions/action_common';

const MsgCreators = {
    onMessageCallback: function (msg) {
        if (msg.data && msg.data.code === 0) {
            if (!msg.data.body.item.length) {
                console.error('on message item is empty');
                return;
            }

            const topic = msg.data.body.topic;
            if (Util.isTopicClientMsg(topic)) {
                this.handleUserMsg(msg);
            } else if (Util.isTopicClientRoomMsg(topic)) {
                this.handleRoomMsg(msg);
            } else {
                console.warn('on message, need handle:' + topic);
            }
        } else {
            console.error('on message, code:' + JSON.stringify(msg));
        }
    },
    parsePublishMsg(msg) {
        const result = [];
        const items = msg.data.body.item;
        for (let i = 0, count = items.length; i < count; i++) {
            if (!items[i].value.length) {
                continue;
            }
            const values = items[i].value;
            for (let j = 0, bodyCount = values.length; j < bodyCount; j++) {
                result.push(values[j]);
            }
        }
        return result;
    },
    handleUserMsg(publishMsg) {
        const msgs = this.parsePublishMsg(publishMsg);
        for (let msg of msgs) {
            this.addMsg(msg);
        }
    },
    handleRoomMsg(publishMsg) {
        const msgs = this.parsePublishMsg(publishMsg);
        for (let msg of msgs) {
            if (msg.header.from === Util.myid) {
                continue;
            }
            this.addMsg(msg)
        }
    },
    asyncSendMsg: function (id, msgBody) {
        return new Promise((resolve, reject) => {
            WebApi.sendMsg(ActionCommon.auth, id, msgBody, (res) => {
                const resHeader = ActionCommon.checkResCommonHeader(res);
                if (resHeader.code === 0) {
                    // 更新发送消息的时间
                    if (res.resMsg && res.body.toUserMsgInfo && res.body.toUserMsgInfo.length) {
                        const toUserMsgInfo = res.body.toUserMsgInfo;
                        for (let i = 0; i < toUserMsgInfo.length; i++) {
                            if (toUserMsgInfo[i].msgid === res.resMsg.id) {
                                res.resMsg.time = toUserMsgInfo[i].time;
                            }
                        }
                    }
                    return resolve(res);
                }
                return reject(res.code);
            })
        })
    },
    addMsg: function(msg) {
        const chatId = Util.getMsgChatId(msg);
        if (chatId === 0) {
            console.error('add msg error, header:', JSON.stringify(msg.header));
            return;
        }

        function addMsg() {
            if (chatId === UserCreators.getCurrentId()) {
                Actions.dialogue.addMsg(msg);
            }
            Actions.msg.add(msg);
        }

        if (Util.isQmUserId(chatId)) {
            UserCreators.asyncGetDetailUsersInfo([chatId]).then((res) => {
                if (res && res[chatId]) {
                    Actions.chat.add(chatId);
                }
            }).catch(() => {
                console.error('get detail user info failed, userid:' + chatId);
            });
            addMsg();
        } else if (Util.isQmRoomId(chatId)) {
            RoomCreators.asyncGetRoomInfoList([chatId]).then((res) => {
                if (res && res[chatId]) {
                    Actions.chat.add(chatId);
                }
            }).catch(() => {
                console.error('get detail room info failed, roomid:' + chatId);
            })
            addMsg();
        } else {
            console.error('chat id is error!');
        }
    },
    getMsg: function(chatId) {
        const chatMsgs = MsgStore.getState();
        return chatMsgs.get(chatId);
    }
}

export default MsgCreators;