import React, { Component } from 'react';
import Styles from '../../style/component/contact_list'
import PropTypes from 'prop-types';
import GroupCreators from '../../creators/group_creators';
import UserCreators from '../../creators/user_creators';
import Util from '../../utils/util';

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
    const {username, companyname, avatar} = this.props;
    const itemStyle = (function getItemStyle() {
      if (self.state.action === ItemAction.hover) {
        return Styles.itemHover;
      } else if (self.state.action === ItemAction.selected) {
        return Styles.itemSelected;
      } else {
        return Styles.item;
      }
    })();

    return (
      <div style={itemStyle}
        onMouseEnter={this.onMouseEnter} 
        onMouseLeave={this.onMouseLeave} 
        onClick={this.onClick} 
      >
        <img style={Styles.avatar} src={avatar} alt='avatar'/>
        <div style={Styles.content}>
          <div style={Styles.username}>{username || ''}</div>
          <div style={Styles.company}>{companyname || ''}</div>
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
      isPressed: false,
      avatarUpdate: false,
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
    const {group} = this.props;
    const groupid = group.ID;
    const isExpand = !GroupCreators.isGroupExpand(groupid);
    if (isExpand) {
      const self = this;
      UserCreators.asyncUpdateUsersAvatar(group.users).then((useridList) => {
        if (useridList && useridList.length) {
          self.setState({avatarUpdate: true})
        }
      }).catch(() => {});
    }
    GroupCreators.setGroupExpand(groupid, isExpand);
  }

  render() {
    console.log('11111111111111111111111111111111111111');
    const {group, userMap, onItemClick, companyMap} = this.props;
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
              {
                group.users.map((userid, index) => {
                let userName = '', companyName = '', avatar = '';
                const userInfo = userMap.get(userid);
                if (userInfo) {
                  userName = Util.getShowName(userInfo);
                  const companyInfo = companyMap.get(userInfo.companyId);
                  if (companyInfo && companyInfo.companyShortName) {
                    companyName = companyInfo.companyShortName;
                  }
                  avatar = Util.getUserAvatar(userInfo);
                }
                return <UserItem key={index} 
                  userid={userid} 
                  username={userName} 
                  companyname={companyName} 
                  avatar={avatar}
                  onItemClick={onItemClick}
                />})
              }
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
        {this.props.contacts.map((group, index) => {
          if (group.name) {
            return <GroupItem key={index} 
              group={group} 
              userMap={this.props.users} 
              companyMap={this.props.companies} 
              onItemClick={this.props.onItemClick} />
          }
        })}
      </div>
    )
  }
}

ContactList.propTypes = {
  contacts: PropTypes.object.isRequired,
  onItemClick: PropTypes.func
}

export default ContactList;