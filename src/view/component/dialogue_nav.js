import React, { Component } from 'react';
import Styles from '../../style/component/dialogue_nav.js'

import { createHashHistory } from 'history';
const history = createHashHistory();

class DialogueNav extends Component {
  onLeft = () => {
    console.log('dialogue nav left button click');
    history.goBack();
  }

  render() {
    return (
      <div style={Styles.main}>
        <button style={Styles.navButton} onClick={this.onLeft}>left</button>
        <button style={Styles.navButton}>center</button>
        <button style={Styles.navButton}>right</button>
      </div>
    )
  }
}

export default DialogueNav;