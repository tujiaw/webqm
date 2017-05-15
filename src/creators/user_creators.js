import {DialogueCurrentIdStore} from '../store/dialogue_store';
import ContactStore from '../store/contact_store';
import ContactActions from '../actions/contact_actions';
import DialogueActions from '../actions/dialogue_actions';
import ChatActions from '../actions/chat_actions';
import WebApi from '../web/web_api';
import ActionCommon from './action_common';
import MsgCreators from './msg_creators';
import Util from '../utils/util';

const UserCreators = {
    myId: 0,
    setCurrentId: function (id) {
        if (this.getCurrentId() !== id) {
            DialogueActions.setCurrentId(id);
            const msgs = MsgCreators.getMsg(id);
            DialogueActions.initMsgs(msgs);
        }
    },
    getCurrentId: function () {
        return DialogueCurrentIdStore.getState();
    },
    addChat: function(chat) {
        ChatActions.addChat(chat);
    },
    asyncLogin: function (username, password) {
        const isEmpty = !(username.length && password.length);
        return new Promise((resolve, reject) => {
            if (isEmpty) {
                return reject(1, '用户名或密码为空!');
            }
            WebApi.login(username, password, (res) => {
                const resHeader = ActionCommon.checkResCommonHeader(res);
                if (resHeader.code === 0) {
                    ActionCommon.auth.token = (res.body.token === undefined) ? '' : res.body.token;
                    ActionCommon.auth.userid = (res.body.userid === undefined) ? 0 : res.body.userid;
                    Util.myid = ActionCommon.auth.userid;
                    WebApi.regMessageCallback(ActionCommon.auth, MsgCreators.onMessageCallback.bind(MsgCreators), (res) => {
                        console.log('subscribe res:' + res);
                    });
                    return resolve();
                }
                return reject(resHeader.code);
            })
        })
    },
    asyncGetFriends: function () {
        return new Promise((resolve, reject) => {
            const friends = ContactStore.getState();
            if (friends.size > 0) {
                return resolve(friends);
            }

            WebApi.friend(ActionCommon.auth, (res) => {
                const resHeader = ActionCommon.checkResCommonHeader(res);
                if (resHeader.code === 0) {
                    if (res.body.errorCode === 0 && res.body.rosterInfo) {
                        ContactActions.initContact(res.body.rosterInfo);
                        return resolve(res.body.rosterInfo);
                    }
                }
                return reject(res.body.errorCode);
            })
        })
    },
    asyncGetUserGroup: function() {
        return new Promise((resolve, reject) => {
            const usergroup = ContactStore.getState();
            if (usergroup.size > 0) {
                return resolve(usergroup);
            }
            
            WebApi.usergroup(ActionCommon.auth, (res) => {
                const resHeader = ActionCommon.checkResCommonHeader(res);
                if (resHeader.code === 0) {
                    ContactActions.initContact(res.body.groupInfo);
                    return resolve(res.body.groupInfo);
                }
                return reject(resHeader.code);
            })
        })
    }
}

export default UserCreators;