import React, { Component } from 'react';
import ContactList from './component/contact_list.js';
import Styles from '../style/contact.js';
// import UserCreators from '../creators/user_creators';
import ghistory from '../utils/ghistory';

class Contact extends Component {
  componentWillMount() {

  }

  onItemClick = (userid) => {
    console.log('on item click:' + userid);
    ghistory.push('/user', {userid: userid});
  }

  render() {
    return (
      <div style={Styles.main}>
        <ContactList {...this.props} onItemClick={this.onItemClick}/>
      </div>
    )
  }
}

function ContactView(props) {
  return <Contact {...props} />
}

export default ContactView;