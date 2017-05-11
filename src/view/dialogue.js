import React from 'react';
import Reflux from 'reflux';
import DialogueNav from './component/dialogue_nav.js';
import Styles from '../style/dialogue.js';
import MainController from '../controller/main_controller';

class Dialogue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onLeftButtonClick = () => {
    this.props.history.goBack();
  }

  onRightButtonClick = () => {

  }

  componentWillMount() {
    console.log('aaaaaaaaaaaaaaa');
    MainController.action.setBottomPanelVisible(false);
  }

  componentWillUnmount() {
    console.log('bbbbbbbbbbbbbbb');
    MainController.action.setBottomPanelVisible(true);
  }

  componentDidMount() {

  }

  openFace = () => {

  }

  sendMessage = () => {
    console.log('send message:' + this.refs.inputMessage.value);
  }

  render() {
    let id = this.props.location.state.id;
    const title = id ? id + '' : '';
    return (
      <div style={Styles.main}>
        <DialogueNav 
          onLeftButtonClick={this.onLeftButtonClick} 
          onRightButtonClick={this.onRightButtonClick}
          title={title}
        />
        <div style={Styles.messagePanel}>

        </div>
        <div style={Styles.inputPanel}>
          <button style={Styles.buttonFace} onClick={this.openFace}>表情</button>
          <input style={Styles.inputMessage} ref="inputMessage" type="text" />
          <button style={Styles.buttonSend} onClick={this.sendMessage}>发送</button>
        </div>
      </div>
    )
  }
}

export default Dialogue;