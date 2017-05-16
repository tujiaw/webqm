import {DialogueCurrentIdStore} from '../store/dialogue_store';
import ContactStore from '../store/contact_store';
import UsersStore from '../store/users_store';
import CompanyStore from '../store/company_store';
import Actions from '../actions/actions';
import ActionCommon from '../actions/action_common';
import WebApi from '../web/web_api';
import MsgCreators from './msg_creators';
import Util from '../utils/util';
import { Set } from 'immutable';

const UserCreators = {
    myId: 0,
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
    addChat: function(chat) {
        Actions.chat.add(chat);
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
    initUIData: function() {
        return UserCreators.asyncGetUserGroup()
        .then(() => {
            let usersId = [];
            const groups = ContactStore.getState();
            groups.map((group) => {
                usersId = usersId.concat(group.users);
            })
            return Promise.resolve(usersId);
        })
        .then((usersId) => {
            return UserCreators.asyncGetBaseUsersInfo(usersId)
        })
        .then(() => {
            let companiesId = Set();
            const users = UsersStore.getState();
            users.map((user) => {
                if (user.companyId && user.companyId !== undefined) {
                    companiesId = companiesId.add(user.companyId);
                }
            })
            return UserCreators.asyncGetCompaniesInfo(companiesId.toArray());
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
    asyncGetBaseUsersInfo: function(usersId) {
        let result = {};
        let requestUsers = [];
        const users = UsersStore.getState();
        if (users.isEmpty()) {
            requestUsers = usersId;
        } else {
            for (let i = 0, count = usersId.length; i < count; i++) {
                const userid = usersId[i];
                if (users.has(userid)) {
                    result.userid = users.get(userid);
                } else {
                    requestUsers.push(userid);
                }
            }
        }
        return new Promise((resolve, reject) => {
            if (requestUsers.length) {
                WebApi.baseusers(ActionCommon.auth, requestUsers, (res) => {
                    const resHeader = ActionCommon.checkResCommonHeader(res);
                    if (resHeader.code === 0) {
                        for (let i = 0, count = res.body.userInfo.length; i < count; i++) {
                            const item = res.body.userInfo[i];
                            result[item.userInfo.userID]= item.userInfo;
                            Actions.users.add(item.userInfo);
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
                    result.companyId = companies.get(companyId);
                } else {
                    requestCompaniesId.push(companyId);
                }
            }
        }
        return new Promise((resolve, reject) => {
            if (requestCompaniesId.length) {
                WebApi.companies(ActionCommon.auth, requestCompaniesId, (res) => {
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
    }
}

export default UserCreators;