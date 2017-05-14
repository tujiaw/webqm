import React, { Component } from 'react';
import Styles from '../../style/component/chat_list'
import PropTypes from 'prop-types';

const ItemAction = {
  normal: 'normal',
  hover: 'hover',
  selected: 'selected'
};

class ChatItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      action: ItemAction.normal
    }
  }

  onMouseEnter = () => {
    this.setState({
      action: ItemAction.hover
    });
  }

  onMouseLeave = () => {
    this.setState({
      action: ItemAction.normal
    });
  }

  onClick = () => {
    this.setState({
      action: ItemAction.selected
    });
    if (this.props.onItemClick) {
      this.props.onItemClick(this.props.data);
    }
  }

  render() {
    const self = this;
    function getItemStyle() {
      if (self.state.action === ItemAction.hover) {
        return Styles.itemHover;
      } else if (self.state.action === ItemAction.selected) {
        return Styles.itemSelected;
      } else {
        return Styles.item;
      }
    }

    return (
      <div 
        style={getItemStyle()}
        onMouseEnter={this.onMouseEnter} 
        onMouseLeave={this.onMouseLeave} 
        onClick={this.onClick}
      >
        <img style={Styles.avatar} src="https://t.alipayobjects.com/images/rmsweb/T16xRhXkxbXXXXXXXX.svg" alt='avatar'/>
        <div style={Styles.content}>
          <div style={Styles.username}>{this.props.data.rosterId}</div>
          <div style={Styles.lastMsg}>{'这是最后一条消息的测试！'}</div>
        </div>
      </div>
      )
  }
}

ChatItem.propTypes = {
  data: PropTypes.object.isRequired,
  onItemClick: PropTypes.func
}

class ChatList extends Component {
  render() {
    return (
      <div style={Styles.list}>
        {this.props.data.map((item, index) => {
          return <ChatItem key={index} data={item} onItemClick={this.props.onItemClick}/>
        })}
      </div>
    )
  }
}

ChatList.propTypes = {
  data: PropTypes.object.isRequired,
  onItemClick: PropTypes.func
}

export default ChatList;