import { DialogueCurrentIdStore } from '../store/dialogue_store';
import ContactStore from '../store/contact_store';
import UsersStore from '../store/users_store';
import CompanyStore from '../store/company_store';
import RoomStore from '../store/room_store';
import ChatStore from '../store/chat_store';
import GlobalConfigStore from '../store/global_config';
import Actions from '../actions/actions';
import ActionCommon from '../actions/action_common';
import WebApi from '../web/web_api';
import MsgCreators from './msg_creators';
import Util from '../utils/util';
import { Set } from 'immutable';
import { Base64 } from 'js-base64';
import RoomCreators from './room_creators';
import ghistory from '../utils/ghistory';
import FavoriteCreators from './favorite_creators';

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
    addChat: function (chatid) {
        const prevList = ChatStore.getState();
        Actions.chat.add(chatid);
        const lastList = ChatStore.getState();
        UserCreators.asyncSetChatList(UserCreators.getUpdateChatList(prevList, lastList));
    },
    removeChat: function (chatid) {
        const prevList = ChatStore.getState();
        Actions.chat.remove(chatid);
        const lastList = ChatStore.getState();
        UserCreators.asyncSetChatList(UserCreators.getUpdateChatList(prevList, lastList));
    },
    clearChat: function () {
        Actions.chat.init([]);
        UserCreators.asyncSetChatList([]);
    },
    setChatLastReadMsgId: function (chatid, lastReadMsgId) {
        if (chatid && lastReadMsgId) {
            Actions.chat.setLastReadMsgId(chatid, lastReadMsgId);
        }
    },
    getConnectStatus: function () {
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
                return reject({
                    code: 1,
                    error: '用户名或密码为空!'
                });
            }
            WebApi.login(username, password, (res) => {
                const resHeader = ActionCommon.checkResCommonHeader(res);
                if (resHeader.code !== 0 || res.body.result !== 0) {
                    console.error(JSON.stringify(res));
                    return reject({
                        code: 1,
                        error: '登录Account Server失败'
                    });
                }

                ActionCommon.auth.token = (res.body.token === undefined) ? '' : res.body.token;
                ActionCommon.auth.userid = (res.body.userid === undefined) ? 0 : res.body.userid;
                Util.myid = ActionCommon.auth.userid;
                WebApi.regMessageCallback(ActionCommon.auth, MsgCreators.onMessageCallback.bind(MsgCreators), (res) => {
                    console.log('subscribe res:' + res);
                });
                WebApi.smlogin(ActionCommon.auth, (res) => {
                    if (res.code !== 0 || (res.body.header && res.body.header.errorCode !== 0)) {
                        console.error(JSON.stringify(res));
                        return reject({
                            code: 1,
                            error: 'SM登录失败'
                        });
                    }
                    console.log('登录成功');
                    WebApi.presence(ActionCommon.auth, (res) => {
                        console.log('presence:' + JSON.stringify(res));
                    });
                    return resolve();
                })
            })
        })
    },
    initUIData: function () {
        console.log('*开始初始化信息*' + (new Date()).toLocaleString());
        return UserCreators.asyncGetChatList().then((chatidList) => {
            console.log('*获取会话列表用户详细信息*' + (new Date()).toLocaleString());
            const useridList = [Util.myid];
            const roomidList = [];
            if (chatidList) {
                for (let chatid of chatidList) {
                    if (Util.isQmUserId(chatid) || Util.isQmOrgId(chatid)) {
                        useridList.push(chatid);
                    } else if (Util.isQmRoomId(chatid)) {
                        roomidList.push(chatid);
                    } else {
                        console.error('get chat list error id:' + chatid);
                    }
                }
            }

            UserCreators.asyncGetUserGroup();
            UserCreators.asyncGetAllGlobalConfig();
            MsgCreators.asyncGetUnreadMsg();
            RoomCreators.asyncGetRoomIdList().then((roomIdList) => {
                RoomCreators.asyncGetRoomInfoList(roomIdList);
            });
            return Promise.all([
                UserCreators.asyncGetDetailUsersInfo(useridList),
                RoomCreators.asyncGetRoomInfoList(roomidList),
            ])
        })
    },
    asyncGetChatList: function () {
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
                return resolve([]);
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

    asyncGetUserGroup: function () {
        return new Promise((resolve, reject) => {
            const usergroup = ContactStore.getState();
            if (usergroup.size > 0) {
                return resolve();
            }

            WebApi.usergroup(ActionCommon.auth, (res) => {
                const resHeader = ActionCommon.checkResCommonHeader(res);
                if (resHeader.code === 0) {
                    Actions.contact.init(res.body.groupInfo);
                    FavoriteCreators.asyncGetFavorites().then((favorites) => {
                        const newGroup = FavoriteCreators.createFavoritesGroup(favorites);
                        Actions.contact.add(newGroup);
                    });
                    return resolve();
                }
                return reject(resHeader.code);
            })
        })
    },
    asyncGetDetailUsersInfo: function (usersId) {
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
                        let companyIdList = [];
                        for (let i = 0, count = res.body.userInfo.length; i < count; i++) {
                            const item = res.body.userInfo[i];
                            result[item.userInfo.userID] = item;
                            Actions.users.add(item);
                            if (Util.isQmUserId(item.userInfo.userID)) {
                                companyIdList.push(item.userInfo.companyId);
                            }
                        }
                        UserCreators.asyncGetCompaniesInfo(companyIdList);
                    } else if (res.body && res.body.retcode) {
                        reject(res.body.retcode);
                    }
                    return resolve(result);
                })
            } else {
                return resolve(result);
            }
        })
    },
    asyncBatchUpdateUserInfo: function (usersId, updateNotify) {
        function task(users) {
            if (!users || !users.length) {
                return;
            }
            UserCreators.asyncGetDetailUsersInfo(users).then((result) => {
                if (updateNotify) {
                    updateNotify(result);
                }
            }).catch((res) => {
                // 数据包太大分批请求
                if (res && res === 100663357) {
                    while (1) {
                        const subUsers = usersId.splice(0, 20);
                        if (subUsers.length === 0) {
                            break;
                        }
                        task(subUsers);
                    }
                }
            })
        }
        task(usersId);
    },
    asyncGetCompaniesInfo: function (companiesId) {
        let result = {};
        let requestCompaniesId = Set();
        const companies = CompanyStore.getState();
        for (let i = 0, count = companiesId.length; i < count; i++) {
            const companyId = companiesId[i];
            if (companies.has(companyId)) {
                result[companyId] = companies.get(companyId);
            } else {
                requestCompaniesId = requestCompaniesId.add(companyId);
            }
        }
        return new Promise((resolve, reject) => {
            if (requestCompaniesId.size > 0) {
                WebApi.companies(requestCompaniesId.toArray(), (res) => {
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
    asyncUpdateUsersAvatar: function (usersId) {
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
    getUpdateChatList: function (prevChatList, lastChatList) {
        // 如果相等则不更新
        if (!prevChatList.equals(lastChatList)) {
            let res = [];
            lastChatList.forEach(chat => {
                res.push(chat.chatid);
            })
            return res;
        }
        return undefined;
    },
    asyncSetChatList: function (chatList) {
        if (chatList === undefined) {
            return;
        }

        if (typeof chatList === 'number') {
            chatList = [chatList];
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
    getGlobalConfig: function (keyList) {
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
    asyncGetAllGlobalConfig: function () {
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
    },
    getBaseInfo: function (id) {
        const result = {};
        if (Util.isQmUserId(id) || Util.isQmOrgId(id)) {
            const users = UsersStore.getState();
            const user = users.get(id);
            if (user) {
                result.avatar = Util.getUserAvatar(user.userInfo);
                result.name = Util.getShowName(user.userInfo);
            }
        } else if (Util.isQmRoomId(id)) {
            const rooms = RoomStore.getState();
            const room = rooms.find(room => room.ID === id);
            if (room) {
                result.avatar = Util.getRoomAvatar(room);
                result.name = room.name;
            }
        } else {
            console.error('get base info error, id:' + id);
        }
        return result;
    },
    getCompanyName: function (id, enableRemoteRequest) {
        if (Util.isQmUserId(id)) {
            const user = UsersStore.getState().get(id);
            if (user) {
                const companyInfo = CompanyStore.getState().get(user.userInfo.companyId);
                if (companyInfo) {
                    return companyInfo.companyShortName;
                } else if (user.userInfo.companyId && enableRemoteRequest) {
                    UserCreators.asyncGetCompaniesInfo([user.userInfo.companyId]);
                }
            }
        }
        return '';
    },
    asyncSearch: function (text) {
        const result = {
            users: [],
            rooms: []
        };

        text = text.trim();
        if (!text.length) {
            return Promise.resolve(result);
        }

        const MAX_USER = 100;
        const MAX_ROOM = 40;
        text = text.toLowerCase();
        return new Promise((resolve, reject) => {
            WebApi.search(ActionCommon.auth, text, MAX_USER, MAX_ROOM, (res) => {
                const resHeader = ActionCommon.checkResCommonHeader(res);
                if (resHeader.code !== 0 || res.body.retcode !== 0) {
                    console.error('search error:' + JSON.stringify(res));
                } else {
                    if (res.body.user) {
                        for (let user of res.body.user) {
                            result.users.push({
                                id: user.userId,
                                title: user.Name,
                                subtitle: user.companyName
                            })
                        }
                    }
                    if (res.body.room) {
                        for (let room of res.body.room) {
                            result.rooms.push({
                                id: room.ID,
                                title: room.roomName,
                                subtitle: room.alias
                            })
                        }
                    }
                }
                return resolve(result);
            })
        });
    },
    asyncGoDialogue: function (id) {
        if (Util.isQmUserId(id) || Util.isQmOrgId(id)) {
            UserCreators.asyncGetDetailUsersInfo([id]).then((res) => {
                if (res[id]) {
                    UserCreators.setCurrentId(id);
                    UserCreators.addChat(id);
                    ghistory.goDialogue();
                }
            })
        } else if (Util.isQmRoomId(id)) {
            //RoomCreators.asyncGetRoomInfoList([id])
        }
    }
}

export default UserCreators;