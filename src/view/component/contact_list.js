import React, { Component } from 'react';
import Styles from '../../style/component/contact_list'
import PropTypes from 'prop-types';
import GroupCreators from '../../creators/group_creators';

const ItemAction = {
  normal: 'normal',
  hover: 'hover',
  selected: 'selected'
};

/**
 * 用户
 */
class UserItem extends Component {
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
      this.props.onItemClick(this.props.userid);
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
          <div style={Styles.username}>{this.props.userid}</div>
          <div style={Styles.company}>{'森浦'}</div>
        </div>
      </div>
      )
  }
}

/**
 * 分组
 */
class GroupItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPressed: false
    }
  }

  onMouseDown = () => {
    this.setState({
      isPressed: true
    })  
  }

  onMouseUp = () => {
    this.setState({
      isPressed: false,
    })
    const groupid = this.props.group.ID;
    const isExpand = !GroupCreators.isGroupExpand(groupid);
    GroupCreators.setGroupExpand(groupid, isExpand);
  }

  render() {
    const {group} = this.props;
    const isExpand = GroupCreators.isGroupExpand(group.ID);
    const groupStyle = (this.state.isPressed ? Styles.groupPressed : Styles.group);
    const groupArrow = (this.state.isExpand ? "/imgs/temp_down.png" : "/imgs/temp_up.png");
    const count = group.users ? group.users.length : 0;
    return (
      <div style={Styles.groupItem}>
      <div style={groupStyle} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp}>
        <div style={Styles.groupLeft}>
          <div style={Styles.groupName}>{group.name}</div>
          <div style={Styles.memberCount}>{count}</div>
        </div>
        <div style={Styles.groupRight}>
          <img style={Styles.arrow} src={groupArrow} alt='arrow'/>
        </div>
      </div>
        { isExpand && count
          ? <div style={Styles.userList}>
              {group.users.map((item, index) => {
                return <UserItem key={index} userid={item} onItemClick={this.props.onItemClick}/>
              })}
            </div>
          : ''}
      </div>
    )
  }
}

class ContactList extends Component {
  render() {
    return (
      <div style={Styles.main}>
        {this.props.data.map((group, index) => {
          if (group.name) {
            return <GroupItem key={index} group={group} onItemClick={this.props.onItemClick} />
          }
        })}
      </div>
    )
  }
}

ContactList.propTypes = {
  data: PropTypes.object.isRequired,
  onItemClick: PropTypes.func
}

export default ContactList;