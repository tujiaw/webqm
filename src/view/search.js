import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Styles from '../style/search';
import ghistory from '../utils/ghistory';
import Config from '../config/config';
import UserCreators from '../creators/user_creators';

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      users: [],
      rooms: [],
    }
  }

  onBackClick = () => {
    ghistory.goBack();
  }

  onInputChanged = (event, newValue) => {
    this.setState({
      searchText: newValue
    })
  }

  onSearchClick = () => {
    UserCreators.asyncSearch(this.state.searchText).then((res) => {
      if (res) {
        this.setState({
          users: res.users,
          rooms: res.rooms
        })
      }
    })
  }

  render() {
    let index = 0;
    return (
      <div style={Styles.root}>
        <div style={Styles.head}>
          <IconButton iconClassName="material-icons" onTouchTap={this.onBackClick}>keyboard_backspace</IconButton>
          <TextField hintText="搜索联系人、群" style={Styles.searchInput} onChange={this.onInputChanged}/>
          <IconButton style={Styles.searchButton} iconClassName="material-icons" onTouchTap={this.onSearchClick}>search</IconButton>
        </div>
        <div style={Styles.content}>
          {
            <List style={{width: '50%'}}>
              <Subheader style={{height: 40}}>联系人</Subheader>
              {this.state.users.map((user) => {
                return <ListItem key={++index} innerDivStyle={Styles.itemInner} primaryText={user.title} secondaryText={user.subtitle}/>
              })}
            </List>
          }
          {
            <List style={{width: '50%'}}>
              <Subheader style={{height: 40}}>群</Subheader>
              {this.state.rooms.map((room) => {
                return <ListItem key={++index} innerDivStyle={Styles.itemInner} primaryText={room.title} secondaryText={room.subtitle}/>
              })}
            </List>
          }
        </div>
      </div>
    );
  }
}