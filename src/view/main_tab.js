import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import Chat from './chat.js';
import Contact from './contact.js';
import About from './about.js';
import DialogueContainer from '../container/dialogue_container';
import Styles from '../style/main_tab.js';

class MainTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isBottomPanelVisible:true};
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
              <Route path="/dialogue" component={DialogueContainer}/>
          </div>

          {this.state.isBottomPanelVisible 
          ? <div style={Styles.bottomPanel}>
              <ul style={Styles.bottomButtons}>
                <li><Link to="/">会话列表</Link></li>
                <li><Link to="/contact">联系人</Link></li>
                <li><Link to="/about">我</Link></li>
              </ul>
            </div> 
          : ''}

        </div>
      </Router>
    )
  }
}

export default MainTab;