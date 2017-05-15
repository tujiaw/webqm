import WebApi from '../web/web_api';
import ActionCommon from './action_common';
import UserCreators from './user_creators';
import MsgActions from '../actions/msg_actions';
import MsgStore from '../store/msg_store';
import DialogueActions from '../actions/dialogue_actions';
import Util from '../utils/util';

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
    handleUserMsg(msg) {
        const items = msg.data.body.item;
        for (let i = 0, count = items.length; i < count; i++) {
            if (!items[i].value.length) {
                continue;
            }
            const values = items[i].value;
            for (let j = 0, bodyCount = values.length; j < bodyCount; j++) {
                this.addMsg(values[j])
            }
        }
    },
    handleRoomMsg(msg) {
        console.log('handle room msg');
    },
    asyncSendMsg: function (id, msg) {
        return new Promise((resolve, reject) => {
            WebApi.sendMsg(ActionCommon.auth, id, msg, (res) => {
                const resHeader = ActionCommon.checkResCommonHeader(res);
                if (resHeader.code === 0) {
                    return resolve(res);
                }
                return reject(res.code);
            })
        })
    },
    addMsg: function(msg) {
        const chatId = Util.getMsgChatId(msg);
        if (chatId) {
            if (chatId === UserCreators.getCurrentId()) {
                DialogueActions.addMessage(msg);
            }
        }
        MsgActions.addMsg(msg);
    },
    getMsg: function(chatId) {
        const chatMsgs = MsgStore.getState();
        return chatMsgs.get(chatId);
    }
}

export default MsgCreators;