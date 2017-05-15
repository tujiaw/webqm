import React, { Component } from 'react';
import ContactList from './component/contact_list.js';
import Styles from '../style/contact.js';
import UserCreators from '../creators/user_creators';
import ghistory from '../utils/ghistory';

class Contact extends Component {
  componentWillMount() {
    UserCreators.asyncGetUserGroup()
    .catch((code, error) => {
      console.log(`code:${code}, error:${error}`);
    })
  }

  onItemClick = (userid) => {
    console.log('on item click:' + userid);
    UserCreators.setCurrentId(userid);
    UserCreators.addChat(userid);
    ghistory.push('/dialogue');
  }

  render() {
    return (
      <div style={Styles.main}>
        <ContactList data={this.props.contacts} onItemClick={this.onItemClick}/>
      </div>
    )
  }
}

function ContactView(props) {
  return <Contact {...props} />
}

export default ContactView;