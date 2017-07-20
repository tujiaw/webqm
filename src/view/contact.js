import React, { Component } from 'react';
import GroupList from './component/group_list.js';
import Styles from '../style/contact.js';
import ghistory from '../utils/ghistory';
import GroupCreators from '../creators/group_creators';
import Util from '../utils/util';
import UserCreators from '../creators/user_creators';

class Contact extends Component {
  onItemClick = (userid) => {
    console.log('on item click:' + userid);
    ghistory.goUserInfo(userid);
  }

  onGroupExpand = (groupid, isExpand) => {
    GroupCreators.setGroupExpand(groupid, isExpand);
  }

  componentDidMount() {
    this.props.contacts.forEach((group) => {
      let groupUsers = group.users;
      UserCreators.asyncBatchUpdateUserInfo(groupUsers);
    })
  }

  render() {
    const {contacts, users, companies} = this.props;
    const groups = [];
    contacts.forEach((group, index) => {
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