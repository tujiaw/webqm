import React from 'react';
import { findDOMNode } from 'react-dom';
import Styles from '../style/dialogue.js';
import ghistory from '../utils/ghistory';
import MsgCreators from '../creators/msg_creators';
import UserCreators from '../creators/user_creators';
import TopBar from './component/top_bar';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import Message from './component/message';
import FaceDialog from './component/face_dialog';
import ImageDialog from './component/image_dialog';
import { QMMsgBuilder } from '../utils/qmmsg';
import moment from 'moment';
import $ from 'jquery';
import Emoticon from '../utils/emoticon_xml';
import ErrorDef from '../utils/errordef';
import Snackbar from 'material-ui/Snackbar';
import Util from '../utils/util';

/**
 * 节点构造
 * @param {*原文本} text 
 * @param {*开始位置} start 
 * @param {*结束位置} end 
 * @param {*类型} type 
 */
function getPoint(text, start, end, type) {
  return {
    start: start,
    end: end,
    data: text.slice(start, end),
    type: type
  }
}

/**
 * 获取所有匹配到的位置
 * @param {*原文本} src 
 * @param {*目前文本} dst 
 */
function matchAll(src, dst) {
  const result = [];
  const dstLength = dst.length;
  let start = 0;
  const end = src.length;
  while (start < end) {
    const index = src.indexOf(dst, start);
    if (index >= 0) {
      result.push({
        start: index,
        end: index + dstLength,
      })
      start = index + dstLength;
    } else {
      break;
    }
  }
  return result;
}

/**
 * 获取表情在输入框中的文本
 * @param {*face对象} face 
 */
function getFaceShowText(face) {
    let result = '';
    if (face.name.indexOf('face') >= 0) {
      result = `[/${face.desc}]`
    } else if (face.name.indexOf('smartQ') >= 0) {
      result = `[//${face.desc}]`
    } else {
      console.error('getFaceShowText error:' + face);
    }
    return result;
}
/**
 * 获取所有系统表情节点位置
 * @param {*原文本} text 
 */
function getEmoticonPointList(text, faceList) {
  let result = [];
  for (let face of faceList) {
    const dst = getFaceShowText(face);
    let arr = matchAll(text, dst);
    arr.map((item) => {
      item.data = face;
      item.type = 'face';
      return item;
    })
    result = result.concat(arr);
  }
  return result;
}

/**
 * 获取所有文本节点位置
 * @param {*原文本} text 
 * @param {*系统表情节点位置列表} facePointList 
 */
function getTextPointList(text, facePointList) {
  let result = [];
  let index = 0;
  facePointList.sort((a, b) => a.start - b.start);
  for (let i = 0, count = facePointList.length; i < count; i++) {
    const point = facePointList[i];
    if (point.start > index) {
      result.push(getPoint(text, index, point.start, 'text'));
    }
    index = point.end;
  }
  if (index < text.length) {
    result.push(getPoint(text, index, text.length, 'text'));
  }
  return result;
}

/**
 * 获取所有节点信息
 * @param {*原文本} text 
 */
function getAllSection(text) {
  let result = [];
  const facePointList = getEmoticonPointList(text, Emoticon.faceList);
  const smartQPointList = getEmoticonPointList(text, Emoticon.smartQList);
  const textPointList = getTextPointList(text, facePointList.concat(smartQPointList));
  result = result.concat(facePointList).concat(smartQPointList).concat(textPointList);
  result.sort((a, b) => a.start - b.start);
  return result;
}

class Dialogue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      isFaceDialog: false,
      isFaceButtonClicked: false,
      isImageDialog: false,
      faceButtonPos: {
        left: 0, top: 0
      },
      faceDialogSize: {
        width: 350, height: 220,
      },
      showTip: false,
      tipMsg: '',
    }
  }

  updateLastMsgId = () => {
    const {currentId, messages} = this.props;
    const lastMsg = messages.last();
    if (lastMsg) {
      UserCreators.setChatLastReadMsgId(currentId, Util.getMsgId(lastMsg));
    }
  }

  componentDidMount() {
    this.updateLastMsgId();
    this.refs.inputMessage.focus();
    document.addEventListener('mouseup', this.onMouseUpListener)
  }

  componentWillUnmount() {
    this.updateLastMsgId();
    document.removeEventListener('mouseup', this.onMouseUpListener);
  }

  onMouseUpListener = (event) => {
    if (this.state.isFaceButtonClicked) {
      this.setState({ isFaceButtonClicked: false });
      return;
    }

    if (this.refs.faceDialog) {
      const faceDlg = findDOMNode(this.refs.faceDialog);
      if (!$(faceDlg).is(event.target) && $(faceDlg).has(event.target).length === 0) {
        this.setState({ isFaceDialog: false });
      }
    }
  }

  onMessageSend = () => {
    this.sendMsg();
    this.refs.inputMessage.focus();
  }

  insertInputText = (insertText) => {
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
  }

  onInputKeyDown = (event) => {
    if (event.keyCode === 13) {
      if (event.ctrlKey) {
        this.insertInputText('\n');
      } else {
        this.sendMsg();
      }
      event.preventDefault();
    }
  }

  getMsgFromInput = () => {
    const msg = this.refs.inputMessage.value.trim();
    if (msg.length === 0) {
      return undefined;
    }

    const builder = new QMMsgBuilder();
    const allSection = getAllSection(msg);
    for (let section of allSection) {
      if (section.type === 'text') {
        builder.pushText(section.data);
      } else if (section.type === 'face') {
        builder.pushSysEmotion(section.data.name);
      } else {
        console.error('input message type error:' + JSON.stringify(section));
      }
    }
    return builder.getMsg();
  }

  sendMsg = () => {
    const msg = this.getMsgFromInput();
    if (msg === undefined) {
      return;
    }

    this.sendMsgObj(msg);
    this.refs.inputMessage.value = '';
  }

  sendMsgObj = (msgObj) => {
    if (msgObj === undefined) {
      return;
    }

    const self = this;
    MsgCreators.asyncSendMsg(this.props.currentId, msgObj)
    .then((res) => {
      if (res.code === 0) {
        if (res.body.header.errorCode && res.body.header.errorCode !== 0) {
          if (ErrorDef.sm[res.body.header.errorCode]) {
            this.setState({
              showTip: true, tipMsg: ErrorDef.sm[res.body.header.errorCode]
            })
          }
        }
        if (res.resMsg) {
          MsgCreators.addMsg(res.resMsg);
          UserCreators.setChatLastReadMsgId(self.props.currentId, res.resMsg.id);
        }
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

  onFaceButtonClick = (event) => {
    const target = event.currentTarget;
    this.setState({ 
      isFaceButtonClicked: true,
      isFaceDialog: !this.state.isFaceDialog,
      faceButtonPos: {
        left: target.offsetLeft,
        top: target.offsetTop
      }
    });
    this.refs.inputMessage.focus();
  }

  onImageButtonClick = (event) => {
    this.setState({
      isImageDialog: true
    })
  }

  onFaceSelected = (data) => {
    console.log(data);
    this.insertInputText(getFaceShowText(data));
    this.refs.inputMessage.focus();
  }

  onImageDialogClose = (data) => {
    this.setState({isImageDialog: false})
    data = data ? data.trim() : '';
    if (data.length) {
      const builder = new QMMsgBuilder();
      const msgObj = builder.pushImage(data, 150, 100).getMsg();
      this.sendMsgObj(msgObj);
    }
  }

  onRequestClose = () => {
    this.setState({
      showTip: false, tipMsg: '',
    })
  }

  render() {
    const {currentId, messages} = this.props;
    const baseInfo = UserCreators.getBaseInfo(currentId);
    const title = baseInfo.name || 'unkown';
    let prevDate = '', showDate = '';

    return (
      <div style={Styles.main}>
        <TopBar pageName='dialogue' title={title} id={currentId}/>
        <div style={Styles.messagePanel}
             ref={(div) => {this.messagePanel = div;}}>
          {/*<div style={{background: '#2C2D31', width: '100%', height: 30, position: 'fixed'}}></div>*/}
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

            return <Message key={index} chatid={currentId} msg={msg} isShowName={isShowName} showDate={showDate}/>
          })}
        </div>
        <div style={Styles.inputPanel}>
          <Divider />
          <div>
            <IconButton 
              ref="faceButton"
              tooltip="表情" 
              tooltipPosition="top-right" 
              iconClassName="material-icons"
              onTouchTap={this.onFaceButtonClick}
              style={Styles.faceButton}>
              insert_emoticon
            </IconButton>
            <IconButton 
              ref="faceButton"
              tooltip="图片" 
              tooltipPosition="top-right" 
              iconClassName="material-icons"
              onTouchTap={this.onImageButtonClick}
              style={Styles.faceButton}>
              image
            </IconButton>
          </div>
          {this.state.isFaceDialog && <FaceDialog ref="faceDialog" 
                  faceButtonPos={this.state.faceButtonPos} 
                  faceDialogSize={this.state.faceDialogSize}
                  onSelected={this.onFaceSelected}/>}
          <ImageDialog open={this.state.isImageDialog} onClose={this.onImageDialogClose}/>
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
        <Snackbar
          open={this.state.showTip}
          message={this.state.tipMsg}
          autoHideDuration={6000}
          onRequestClose={this.onRequestClose}
        />
      </div>
    )
  }
}

function DialogueView(props) {
  return <Dialogue {...props} />
}

export default DialogueView;