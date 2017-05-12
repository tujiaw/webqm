import React, { Component } from 'react';
import Styles from '../../style/component/dialogue_nav.js'
import PropTypes from 'prop-types';

class DialogueNav extends Component {
  render() {
    const title = this.props.id + ''; 
    return (
      <div style={Styles.main}>
        <button style={Styles.navButton} onClick={this.props.onLeftButtonClick}>返回</button>
        <div style={Styles.title}>{title}</div>
        <button style={Styles.navButton} onClick={this.props.onRightButtonClick}>资料</button>
      </div>
    )
  }
}

DialogueNav.propTypes = {
  onLeftButtonClick: PropTypes.func,
  onRightButtonClick: PropTypes.func,
  id: PropTypes.number,
}

export default DialogueNav;