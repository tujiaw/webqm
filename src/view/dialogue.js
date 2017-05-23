import React from 'react';
import Styles from '../style/dialogue.js';
import ghistory from '../utils/ghistory';
import MsgCreators from '../creators/msg_creators';
import UserCreators from '../creators/user_creators';
import TopBar from './component/top_bar';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import Message from './component/message';
import moment from 'moment';

class Dialogue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: ''
    }
  }

  componentDidMount() {
    this.refs.inputMessage.focus();
  }

  onMessageSend = () => {
    this.sendMsg();
    this.refs.inputMessage.focus();
  }

  onInputKeyDown = (event) => {
    if (event.keyCode === 13) {
      const insertText = '\n';
      if (event.ctrlKey) {
        const $this = this.refs.inputMessage;
        // 处理插入回车换行符
        if (document.selection) {
          $this.focus();
          let sel = document.selection.createRange();
          sel.text = insertText;
        } else if ($this.selectionStart || $this.selectionStart === 0) {
          const startPos = $this.selectionStart;
          const endPos = $this.selectionEnd;
          $this.value = $this.value.substring(0, startPos) + insertText +
            $this.value.substring(endPos, $this.value.length);
          $this.selectionStart = startPos + insertText.length;
          $this.selectionEnd = startPos + insertText.length;
        } else {
          this.refs.inputMessage.value += insertText;
        }
      } else {
        this.sendMsg();
      }
      event.preventDefault();
    }
  }

  sendMsg = () => {
    const msg = this.refs.inputMessage.value.trim();
    if (msg.length === 0) {
      return;
    }
    this.refs.inputMessage.value = '';
    MsgCreators.asyncSendMsg(this.props.currentId, msg)
    .then((res) => {
      if (res.code === 0) {
        MsgCreators.addMsg(res.resMsg);
        UserCreators.setChatLastReadMsgId(this.props.currentId, res.resMsg.id);
      }
    })
    .catch((code, error) => {
    });
  }

  onLeftButtonClick = () => {
    ghistory.goBack();
  }

  onRightButtonClick = () => {
    console.log(UserCreators.getCurrentId());
  }

  scrollToBottom() {
    const scrollHeight = this.messagePanel.scrollHeight;
    const height = this.messagePanel.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.messagePanel.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    const {currentId, messages, users} = this.props;
    const info = users.get(currentId);
    const showName = (info !== undefined ? info.userInfo.name : 'unkown');
    let prevDate = '', showDate = '';

    return (
      <div style={Styles.main}>
        <TopBar pageName='dialogue' title={showName} userid={currentId}/>
        <div style={Styles.messagePanel}
             ref={(div) => {this.messagePanel = div;}}>
          {messages.map((msg, index) => {
            let isShowName = false;
            if (index > 0) {
              // 是否显示消息中的用户名
              const prevMsg = messages.get(index - 1);
              if (prevMsg.header.from !== msg.header.from) {
                isShowName = true;
              } else if (prevMsg.time && msg.time && msg.time - prevMsg.time > 60 * 1000) {
                isShowName = true;
              }
            } else {
              isShowName = true;
            }

            // 是否显示日期
            const currentDate = moment(msg.time).format('MM月DD日 dddd');
            if (prevDate !== currentDate) {
              prevDate = currentDate;
              showDate = currentDate;
            } else {
              showDate = '';
            }
            return <Message key={index} msg={msg} users={users} isShowName={isShowName} showDate={showDate}/>
          })}
        </div>
        <div style={Styles.inputPanel}>
          <Divider />
          <IconButton tooltip="表情" tooltipPosition="top-right" iconClassName="material-icons" style={Styles.faceButton}>insert_emoticon</IconButton>
            <textarea 
              style={Styles.inputMessage}
              rows="3" 
              onKeyDown={this.onInputKeyDown}
              ref="inputMessage"
            />

          <div style={Styles.sendButtonBox}>
              <span style={Styles.newlineSpan}>按下Ctrl+Enter换行</span>
              <RaisedButton label="发送" primary={true} onClick={this.onMessageSend} buttonStyle={Styles.sendButton} overlayStyle={Styles.overlayButton}/>
          </div>
        </div>
      </div>
    )
  }
}

function DialogueView(props) {
  return <Dialogue {...props} />
}

export default DialogueView;