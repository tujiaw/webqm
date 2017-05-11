import React, { Component } from 'react';
import DialogueNav from './component/dialogue_nav.js';
import Styles from '../style/dialogue.js';

class Dialogue extends Component {
  render() {
    return (
      <div style={Styles.main}>
        <DialogueNav />
        <div style={Styles.chatContent}>
        </div>
        <div style={Styles.chatInput}>
          <textarea rows="3"></textarea>
        </div>
      </div>
    )
  }
}

export default Dialogue;