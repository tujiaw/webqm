import {DialogueCurrentIdStore} from '../store/dialogue_store';
import ContactStore from '../store/contact_store';
import ContactActions from '../actions/contact_actions';
import DialogueActions from '../actions/dialogue_actions';
import ChatActions from '../actions/chat_actions';
import WebApi from '../web/web_api';
import ActionCommon from './action_common';
import MsgCreators from './msg_creators';

const UserCreators = {
    setCurrentId: function (id) {
        DialogueActions.setCurrentId(id);
    },
    getCurrentId: function () {
        return DialogueCurrentIdStore.getState();
    },
    addChat: function(chat) {
        ChatActions.addChat(chat);
    },
    asyncLogin: function (username, password) {
        const isEmpty = (username.length && password.length);
        return new Promise((resolve, reject) => {
            if (isEmpty) {
                reject(1, '用户名或密码为空!');
            }
            WebApi.login(username, password, (res) => {
                const resHeader = ActionCommon.checkResCommonHeader(res);
                if (resHeader.code === 0) {
                    ActionCommon.auth.token = (res.body.token === undefined) ? '' : res.body.token;
                    ActionCommon.auth.userid = (res.body.userid === undefined) ? 0 : res.body.userid;
                    WebApi.regMessageCallback(ActionCommon.auth, MsgCreators.onMessageCallback);
                    resolve()
                }
                reject(resHeader.code);
            })
        })
    },
    asyncGetFriends: function () {
        return new Promise((resolve, reject) => {
            const friends = ContactStore.getState();
            if (friends.size > 0) {
                resolve(friends);
            }

            ContactActions.initContact([{
                    rosterId: 1
                },
                {
                    rosterId: 2
                },
                {
                    rosterId: 3
                },
            ]);
            WebApi.friend(ActionCommon.auth, (res) => {
                const resHeader = ActionCommon.checkResCommonHeader(res);
                if (resHeader.code === 0) {
                    if (res.body.errorCode === 0 && res.body.rosterInfo) {
                        ContactActions.initContact(res.body.rosterInfo);
                        resolve(res.body.rosterInfo);
                    }
                }
                reject(res.body.errorCode);
            })
        })
    },
}

export default UserCreators;