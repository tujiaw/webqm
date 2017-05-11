import React from 'react';
import Reflux from 'reflux';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import Chat from './chat.js';
import Contact from './contact.js';
import About from './about.js';
import Dialogue from './dialogue.js';
import Styles from '../style/main_tab.js';
import RefluxController from '../controller/reflux_controller.js';
import SignalController from '../controller/signal_controller.js';

class MainTab extends Reflux.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.store = RefluxController.store;

    this.onCurrentPathChanged = this.onCurrentPathChanged.bind(this);
    SignalController.on('currentPathChanged', this.onCurrentPathChanged);
  }

  onCurrentPathChanged(data) {
    console.log('onCurrentPathChanged:' + data);
    //this.props.history.push('dialogue');
  }

  componentDidMount() {
    console.log('main tab did mount');
  }

  render() {
    return (
      <Router history={this.props.history}>
        <div style={Styles.main}>
          <div style={Styles.tab}>
              <Route exact path="/" component={Chat}/>
              <Route path="/contact" component={Contact}/>
              <Route path="/about" component={About}/>
              <Route path="/dialogue" component={Dialogue}/>
          </div>

          <div style={Styles.bottomPanel}>
            <ul style={Styles.bottomButtons}>
              <li><Link to="/">会话列表</Link></li>
              <li><Link to="/contact">联系人</Link></li>
              <li><Link to="/about">我</Link></li>
            </ul>
          </div>
        </div>
      </Router>
    )
  }
}

export default MainTab;