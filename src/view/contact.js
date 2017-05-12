import React, { Component } from 'react';
import UserController from '../controller/user_controller.js';
import ContactList from './component/contact_list.js';
import Styles from '../style/contact.js';
import DialogueActions from '../actions/dialogue_actions';
import ghistory from '../utils/ghistory';

class Contact extends Component {
  componentWillMount() {
    UserController.friend((data) => {
      console.log('contact friend:' + data);
    })
  }

  onItemClick = (data) => {
    console.log('on item click:' + data);
    DialogueActions.setCurrentId(data.rosterId);
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