import React, { Component } from 'react';
import Styles from '../../style/component/dialogue_nav.js'
import PropTypes from 'prop-types';

class DialogueNav extends Component {
  onLeft = () => {
    console.log('dialogue nav left button click');
    if (this.props.onLeftButtonClick) {
      this.props.onLeftButtonClick();
    }
  }

  onRight = () => {
    if (this.props.onRightButtonClick) {
      this.props.onRightButtonClick();
    }
  }

  render() {
    return (
      <div style={Styles.main}>
        <button style={Styles.navButton} onClick={this.onLeft}>返回</button>
        <div style={Styles.title}>{this.props.title || ''}</div>
        <button style={Styles.navButton} onClick={this.onRight}>资料</button>
      </div>
    )
  }
}

DialogueNav.propTypes = {
  onLeftButtonClick: PropTypes.func,
  onRightButtonClick: PropTypes.func,
  title: PropTypes.string,
}

export default DialogueNav;