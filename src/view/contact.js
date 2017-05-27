import React, { Component } from 'react';
import GroupList from './component/group_list.js';
import Styles from '../style/contact.js';
import Config from '../config/config';
import ghistory from '../utils/ghistory';
import GroupCreators from '../creators/group_creators';
import Util from '../utils/util';
import UserCreators from '../creators/user_creators';

class Contact extends Component {
  onItemClick = (userid) => {
    console.log('on item click:' + userid);
    ghistory.push(`${Config.prefix}/user`, {userid: userid});
  }

  onGroupExpand = (groupid, isExpand) => {
    GroupCreators.setGroupExpand(groupid, isExpand);
  }

  componentDidMount() {
    this.props.contacts.map((group) => {
      let groupUsers = group.users;
      function task(users) {
        if (!users || !users.length) {
          return;
        }
        UserCreators.asyncGetDetailUsersInfo(users).catch((res) => {
          // 数据包太大分批请求
          if (res && res === 100663357) {
            while (1) {
              const subUsers = groupUsers.splice(0, 20);
              if (subUsers.length === 0) {
                break;
              }
              task(subUsers);
            }
          }
        })
      }
      task(groupUsers);
    })
  }

  render() {
    const {contacts, users, companies} = this.props;
    const groups = [];
    contacts.map((group, index) => {
      if (group.name && group.users) {
        const groupItem = {
          id: group.ID,
          name: group.name,
          count: group.users.length || 0, 
          isExpand: GroupCreators.isGroupExpand(group.ID),
          members: []
        }
        for (let userid of group.users) {
          const user = users.get(userid)
          if (user && user.userInfo && user.userInfo.userID) {
            const companyInfo = companies.get(user.userInfo.companyId);
            let companyName = ''
            if (companyInfo && companyInfo.companyShortName) {
              companyName = companyInfo.companyShortName;
            }

            const avatar = Util.getUserAvatar(user.userInfo);
            const memberItem = {
              id: user.userInfo.userID,
              avatar: avatar,
              title: user.userInfo.name,
              subtitle: companyName
            }
            groupItem.members.push(memberItem);
          }
        }
        groups.push(groupItem);
      }
    })

    return (
      <div style={Styles.main}>
        <GroupList groups={groups} onItemClick={this.onItemClick} onGroupExpand={this.onGroupExpand}/>
      </div>
    )
  }
}

function ContactView(props) {
  return <Contact {...props} />
}

export default ContactView;