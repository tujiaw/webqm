import React, { Component } from 'react';

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: []
    };
  }

  componentWillMount() {
    for (let i = 0; i < 100; i++) {
      this.state.contacts.push({
        name: 'contact' + parseInt(i + 1)
      })
    }
  }

  render() {
    return (
      <div>
        <h1>Contacts</h1>
        <div>
        </div>
      </div>
    )
  }
}

export default Contact;