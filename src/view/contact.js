import React, { Component } from 'react';
import UserController from '../controller/user_controller.js';
import ContactList from './component/contact-list.js'

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

  renderNav() {
    return (
      <div style={Styles.nav}>
        <button style={Styles.navButton}>left</button>
        <button style={Styles.navButton}>center</button>
        <button style={Styles.navButton}>right</button>
      </div>
    )
  }

  render() {
    const self = this;
    return (
      <div style={Styles.main}>
        { self.renderNav() }
        <ContactList data={this.state.contacts} />
      </div>
    )
  }
}

const Styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    background: '#eee'
  },
  navButton: {
    width: '50px',
    height: '25px',
  }
}

export default Contact;