import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Styles from '../style/search';
import ghistory from '../utils/ghistory';
import UserCreators from '../creators/user_creators';

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preSearchText: '',
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

  onInputKeyDown = (event) => {
    if (event.keyCode === 13) {
      this.onSearchClick();
    }
  }

  onSearchClick = () => {
    if (this.state.preSearchText === this.state.searchText) {
      return;
    }
    this.setState({ preSearchText: this.state.searchText });
    UserCreators.asyncSearch(this.state.searchText).then((res) => {
      if (res) {
        this.setState({
          users: res.users,
          rooms: res.rooms
        })
      }
    })
  }

  onUserItemClick = (userid) => {
    ghistory.goUserInfo(userid);
  }

  onRoomItemClick = (roomid) => {
    ghistory.goRoomInfo(roomid);
  }

  render() {
    let index = 0;
    return (
      <div style={Styles.root}>
        <div style={Styles.head}>
          <IconButton iconClassName="material-icons" onTouchTap={this.onBackClick}>keyboard_backspace</IconButton>
          <TextField hintText="搜索联系人、群" 
            style={Styles.searchInput}
            onChange={this.onInputChanged}
            onKeyDown={this.onInputKeyDown}
          />
          <IconButton style={Styles.searchButton} iconClassName="material-icons" onTouchTap={this.onSearchClick}>search</IconButton>
        </div>
        <div style={Styles.content}>
          {
            <List style={{width: '50%'}}>
              <Subheader style={{height: 40}}>联系人</Subheader>
              {this.state.users.map((user) => {
                return <ListItem key={++index} 
                  innerDivStyle={Styles.itemInner}
                  primaryText={user.title}
                  secondaryText={user.subtitle}
                  onClick={this.onUserItemClick.bind(this, user.id)}
                />
              })}
            </List>
          }
          {
            <List style={{width: '50%'}}>
              <Subheader style={{height: 40}}>群</Subheader>
              {this.state.rooms.map((room) => {
                return <ListItem key={++index} 
                  innerDivStyle={Styles.itemInner}
                  primaryText={room.title}
                  secondaryText={room.subtitle}
                  onClick={this.onRoomItemClick.bind(this, room.id)}
                />
              })}
            </List>
          }
        </div>
      </div>
    );
  }
}