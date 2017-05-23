import {DialogueCurrentIdStore} from '../store/dialogue_store';
import ContactStore from '../store/contact_store';
import UsersStore from '../store/users_store';
import CompanyStore from '../store/company_store';
// import ConfigStore from '../store/config_store';
import ChatStore from '../store/chat_store';
import GlobalConfigStore from '../store/global_config';
import Actions from '../actions/actions';
import ActionCommon from '../actions/action_common';
import WebApi from '../web/web_api';
import MsgCreators from './msg_creators';
import Util from '../utils/util';
import { Set } from 'immutable';
import { Base64 } from 'js-base64';

const UserCreators = {
    setCurrentId: function (id) {
        if (this.getCurrentId() !== id) {
            Actions.dialogue.setCurrentId(id);
            const msgs = MsgCreators.getMsg(id);
            Actions.dialogue.initMsgs(msgs);
        }
    },
    getCurrentId: function () {
        return DialogueCurrentIdStore.getState();
    },
    addChat: function(chatid) {
        const prevList = ChatStore.getState();
        Actions.chat.add(chatid);
        const lastList = ChatStore.getState();
        UserCreators.syncChatList(UserCreators.getUpdateChatList(prevList, lastList));
    },
    setChatLastReadMsgId: function(chatid, lastReadMsgId) {
        Actions.chat.setLastReadMsgId(chatid, lastReadMsgId);
    },
    getConnectStatus: function() {
        const status = WebApi.connectStatus();
        const desc = {
            0: '正在连接',
            1: '已连接',
            2: '连接断开中',
            3: '连接已断开'
        }
        const statusDesc = desc[status] ? desc[status] : '连接未初始化';
        return {
            code: status,
            desc: statusDesc
        }
    },
    asyncLogin: function (username, password) {
        const isEmpty = !(username.length && password.length);
        return new Promise((resolve, reject) => {
            if (isEmpty) {
                return reject({code: 1, error: '用户名或密码为空!'});
            }
            WebApi.login(username, password, (res) => {
                const resHeader = ActionCommon.checkResCommonHeader(res);
                if (resHeader.code === 0) {
                    if (res.body.result === 0) {
                        ActionCommon.auth.token = (res.body.token === undefined) ? '' : res.body.token;
                        ActionCommon.auth.userid = (res.body.userid === undefined) ? 0 : res.body.userid;
                        Util.myid = ActionCommon.auth.userid;
                        WebApi.regMessageCallback(ActionCommon.auth, MsgCreators.onMessageCallback.bind(MsgCreators), (res) => {
                            console.log('subscribe res:' + res);
                        });
                        return resolve();
                    } else {
                        return reject({code: res.body.result, error: res.body.error_desc});
                    }
                }
                return reject({code: resHeader.code});
            })
        })
    },
    initUIData: function() {
        console.log('*开始初始化信息*' + (new Date()).toLocaleString());
        return UserCreators.asyncGetUserGroup()
        .then(() => {
            let usersId = [Util.myid];
            const groups = ContactStore.getState();
            groups.forEach((group) => {
                usersId = usersId.concat(group.users);
            })
            console.log('*获取用户组信息*' + (new Date()).toLocaleString());
            return Promise.resolve(usersId);
        })
        .then((usersId) => {
            console.log('*获取用户详细信息*' + (new Date()).toLocaleString());
            return UserCreators.asyncGetDetailUsersInfo(usersId);
        })
        .then(() => {
            console.log('*获取会话列表*' + (new Date()).toLocaleString());
            return UserCreators.asyncGetChatList();
        })
        .then((usersId) => {
            console.log('*获取会话列表用户详细信息*' + (new Date()).toLocaleString());
            return UserCreators.asyncGetDetailUsersInfo(usersId);
        })
        .then(() => {
            console.log('*获取公司信息*' + (new Date()).toLocaleString());
            let companiesId = Set();
            const users = UsersStore.getState();
            users.forEach((user) => {
                if (user.companyId && user.companyId !== undefined) {
                    companiesId = companiesId.add(user.companyId);
                }
            })
            return UserCreators.asyncGetCompaniesInfo(companiesId.toArray());
        })
        .then(() => {
            console.log('*获取全局配置*' + (new Date()).toLocaleString());
            return UserCreators.asyncGetAllGlobalConfig();
        })
    },
    asyncGetChatList: function() {
        return new Promise((resolve, reject) => {
            WebApi.customconfig(ActionCommon.auth, ['webqmconfig'], (res) => {
                const resHeader = ActionCommon.checkResCommonHeader(res);
                if (resHeader.code !== 0 || res.body.retcode !== 0) {
                    console.error('get chat list failed, ' + JSON.stringify(res));
                } else {
                    if (res.body.value.length) {
                        let config = Base64.decode(res.body.value[0]);
                        if (config.length) {
                            config = JSON.parse(config);
                            for (let i = 0, count = config.chatlist.length; i < count; i++) {
                                Actions.chat.add(config.chatlist[i]);
                            }
                            return resolve(config.chatlist);
                        }
                    }
                }
                return resolve();
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
                return resolve();
            }
            
            WebApi.usergroup(ActionCommon.auth, (res) => {
                const resHeader = ActionCommon.checkResCommonHeader(res);
                if (resHeader.code === 0) {
                    Actions.contact.init(res.body.groupInfo);
                    return resolve();
                }
                return reject(resHeader.code);
            })
        })
    },
    asyncGetDetailUsersInfo: function(usersId) {
        if (usersId === undefined) {
            return Promise.resolve();
        }

        if (typeof usersId === 'number') {
            usersId = [usersId];
        }
        let result = {};
        let requestUsers = [];
        const users = UsersStore.getState();
        if (users.isEmpty()) {
            requestUsers = usersId;
        } else {
            for (let i = 0, count = usersId.length; i < count; i++) {
                const userid = usersId[i];
                if (users.has(userid)) {
                    result[userid] = users.get(userid);
                } else {
                    requestUsers.push(userid);
                }
            }
        }
        return new Promise((resolve, reject) => {
            if (requestUsers.length) {
                WebApi.userdetail(ActionCommon.auth, requestUsers, (res) => {
                    const resHeader = ActionCommon.checkResCommonHeader(res);
                    if (resHeader.code === 0 && res.body.retcode === 0) {
                        for (let i = 0, count = res.body.userInfo.length; i < count; i++) {
                            const item = res.body.userInfo[i];
                            result[item.userInfo.userID]= item;
                            Actions.users.add(item);
                        }
                    }
                    return resolve(result);
                })
            } else {
                return resolve(result);
            }
        })
    },
    asyncGetCompaniesInfo: function(companiesId) {
        let result = {};
        let requestCompaniesId = [];
        const companies = CompanyStore.getState();
        if (companies.isEmpty()) {
            requestCompaniesId = companiesId;
        } else {
            for (let i = 0, count = companiesId.length; i < count; i++) {
                const companyId = companiesId[i];
                if (companies.has(companyId)) {
                    result[companyId] = companies.get(companyId);
                } else {
                    requestCompaniesId.push(companyId);
                }
            }
        }
        return new Promise((resolve, reject) => {
            if (requestCompaniesId.length) {
                WebApi.companies(requestCompaniesId, (res) => {
                    const resHeader = ActionCommon.checkResCommonHeader(res);
                    if (resHeader.code === 0) {
                        if (res.body.retcode === 0) {
                            for (let i = 0, count = res.body.companyInfo.length; i < count; i++) {
                                const item = res.body.companyInfo[i];
                                result[item.companyId] = item;
                                Actions.company.add(item);
                            }
                        } else {
                            console.error('retcode:' + res.body.retcode)
                        }
                    }
                    return resolve(result);
                })
            } else {
                return resolve(result);
            }
        })
    },
    asyncUpdateUsersAvatar: function(usersId) {
        const users = UsersStore.getState();
        if (usersId === undefined || users.isEmpty()) {
            return Promise.resolve();
        }
        
        let requestUsersId = [];
        for (let i = 0, count = usersId.length; i < count; i++) {
            const userid = usersId[i];
            const user = users.get(userid);
            if (user) {
                if (Util.isSysAvatar(user.userInfo.avatarId)) {
                    continue;
                } else if (user.userInfo.avatar !== undefined) {
                    continue;
                }
                requestUsersId.push(userid);
            }
        }
        
        return new Promise((resolve, reject) => {
            if (requestUsersId.length) {
                WebApi.useravatar(requestUsersId, (res) => {
                    const resHeader = ActionCommon.checkResCommonHeader(res);
                    if (resHeader.code !== 0) {
                        console.error('user avatar code:' + resHeader.code);
                    }
                    if (res.body.errorCode === 0) {
                        if (res.body.changeUserIdList && res.body.avatarDataList && res.body.avatarIdList) {
                            Actions.users.updateAvatarList(res.body.changeUserIdList, res.body.avatarIdList, res.body.avatarDataList);
                            return resolve(res.body.changeUserIdList);
                        }
                    } else {
                        console.error('user avatar errorcode:' + res.body.errorCode);
                    }
                    return resolve();
                })
            } else {
                return resolve();
            }
        })
    },
    getUpdateChatList: function(prevChatList, lastChatList) {
        let res = [];
        if (!prevChatList.equals(lastChatList)) {
            lastChatList.forEach(chat => {
                res.push(chat.chatid);
            })
        }
        return res;
    },
    syncChatList: function(chatList) {
        if (typeof chatList === 'number') {
            chatList = [chatList];
        }
        if (!chatList.length) {
            return;
        }

        const webqmconfig = {
            chatlist: chatList
        }
        WebApi.setcustomconfig(ActionCommon.auth, ['webqmconfig'], [JSON.stringify(webqmconfig)], (res) => {
            const resHeader = ActionCommon.checkResCommonHeader(res);
            if (resHeader.code !== 0) {
                console.error('sync chat list failed, ' + resHeader.error);
            }
            if (resHeader.body && resHeader.retcode !== 0) {
                console.error('sync chat list failed, retcode:' + resHeader.retcode);
            }
        })
    },
    getGlobalConfig: function(keyList) {
        if (typeof keyList === 'string') {
            keyList = [keyList];
        }

        const result = {};
        if (keyList && keyList.length) {
            const globalConfig = GlobalConfigStore.getState();
            for (let i = 0, count = keyList.length; i < count; i++) {
                if (globalConfig.has(keyList[i])) {
                    result[keyList[i]] = globalConfig.get(keyList[i]);
                }
            }
        }
        return result;
    },
    asyncGetAllGlobalConfig: function() {
        return new Promise((resolve, reject) => {
            const keyList = [
                'NEWS_URL', 
                'NEWS_WINDOW_WIDTH', 
                'NEWS_WINDOW_HEIGHT', 
                'QM_INVITE_URL', 
                'CUSTOM_SERVICE_ID',
                'FILESERVER_URL', 
                'ROOMFILESPACE',
                'REC_UNDERWRITER_IDLIST',
                'QQ_RIGHT_IDLIST',
                'QQMSG_MERGE_TIME',
            ]
            WebApi.globalconfig(keyList, (res) => {
                const resHeader = ActionCommon.checkResCommonHeader(res);
                if (resHeader.code !== 0 || res.body.errorCode !== 0) {
                    console.error('get global config error:' + JSON.stringify(res));
                    return resolve();
                }

                const result = {};
                const count = Math.min(res.body.value.length, keyList.length);
                for (let i = 0; i < count; i++) {
                    const key = keyList[i];
                    const value = res.body.value[i];
                    Actions.globalconfig.set(key, value);
                    result[key] = value;
                }
                return resolve(result);
            });
        })
    }
}

export default UserCreators;