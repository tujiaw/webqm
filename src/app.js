import React, { Component } from 'react';
import './css/app.css';
import Login from './view/login.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Login />
      </div>
    );
  }
}

export default App;
