import WebApi from '../web/web_api';
import ActionCommon from './action_common';

const MsgCreators = {
    onMessageCallback: function (msg) {},
    asyncSendMsg: function (id, msg) {
        return new Promise((resolve, reject) => {
            WebApi.sendMsg(ActionCommon.auth, id, msg, (res) => {
                const resHeader = ActionCommon.checkResCommonHeader(res);
                if (resHeader.code === 0) {
                    resolve(res);
                }
                reject(res.code);
            })
        })
    }
}

export default MsgCreators;