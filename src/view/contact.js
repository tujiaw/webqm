import React, { Component } from 'react';
import UserController from '../controller/user_controller.js';
import ContactList from './component/contact-list.js';
import Styles from '../style/contact.js';

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: []
    };
  }

  componentWillMount() {
    const self = this;
    UserController.friend((data) => {
      if (data.header.code !== 0) {
        return;
      }
      self.setState({ contacts: data.getData() });
    })
  }

  onItemClick = (data) => {
    console.log('on item click:' + data);
    this.props.history.push('dialogue', { id: data.rosterId });
  }

  render() {
    return (
      <div style={Styles.main}>
        <ContactList data={this.state.contacts} onItemClick={this.onItemClick}/>
      </div>
    )
  }
}

export default Contact;