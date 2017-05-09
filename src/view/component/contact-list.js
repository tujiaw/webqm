import React, { Component } from 'react';

const Status = {
  normal: 'normal',
  hover: 'hover',
  selected: 'selected'
};

class ContactItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: Status.normal
    }
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onMouseEnter() {
    this.setState({
      status: Status.hover
    });
  }

  onMouseLeave() {
    this.setState({
      status: Status.normal
    });
  }

  onClick() {
    this.setState({
      status: Status.selected
    });
  }

  render() {
    const self = this;
    function getItemStyle() {
      if (self.state.status === Status.hover) {
        return Styles.itemHover;
      } else if (self.state.status === Status.selected) {
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
        <img style={Styles.avatar} src="https://t.alipayobjects.com/images/rmsweb/T16xRhXkxbXXXXXXXX.svg" />
        <div style={Styles.content}>
          <div style={Styles.username}>{this.props.data.rosterId}</div>
          <div style={Styles.lastMsg}>{'这是最后一条消息的测试！'}</div>
        </div>
      </div>
      )
  }
}

class ContactList extends Component {
  render() {
    return (
      <div style={Styles.list}>
        {this.props.data.map((item, index) => {
          return <ContactItem key={index} data={item} />
        })}
      </div>
    )
  }
}

const Styles = {
  list: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflowY: 'scroll',
  },
  avatar: {
    width: '50px',
    height: '50px'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingLeft: '15px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    alignItems: 'space-between',
  },
  username: {
    display: 'flex',
    alignSelf: 'flex-start',
  },
  lastMsg: {
    display: 'flex',
    alignSelf: 'flex-start',
  },
}

Styles.item = {
  display: 'flex',
  cursor: 'pointer',
  minHeight: '60px',
  alignItems: 'center',
  paddingLeft: '10px',
  paddingRight: '10px',
}

Styles.itemHover = {
  ...Styles.item,
  background: '#0E9496'
}

Styles.itemSelected = {
  ...Styles.item
}

export default ContactList;