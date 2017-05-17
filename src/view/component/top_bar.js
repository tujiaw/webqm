import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

const Styles = {
  appbar: {
    height: '50px',
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  backButton: {
  },
  backButtonIcon: {
    color: '#303030',
  },
  backLabel: {
    margin: '0px',
    padding: '0px',
    color: '#303030',
  },
  moreButton: {
    margin: '0px',
    padding: '0px',
  },
  moreButtonIcon: {
    marginBottom: '10px',
  }
}
class Login extends Component {
  static muiName = 'FlatButton';

  render() {
    return (
      <FlatButton {...this.props} label="Login" />
    );
  }
}

const Logged = (props) => (
  <IconMenu
    {...props}
    iconButtonElement={
      <IconButton style={Styles.moreButton} iconStyle={Styles.moreButtonIcon}><MoreVertIcon /></IconButton>
    }
    targetOrigin={{horizontal: 'right', vertical: 'top'}}
    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
  >
    <MenuItem primaryText="Refresh" />
    <MenuItem primaryText="Help" />
    <MenuItem primaryText="Sign out" />
  </IconMenu>
);

Logged.muiName = 'IconMenu';

/**
 * This example is taking advantage of the composability of the `AppBar`
 * to render different components depending on the application state.
 */
class TopBar extends Component {
  state = {
    selectIndex: 0
  };

  render() {
    return (
      <div>
        <AppBar
          style={Styles.appbar}
          titleStyle={Styles.title}
          title="Title"
          iconElementLeft={
            <FlatButton 
              label="返回"
              icon={<FontIcon style={Styles.backButtonIcon} className="material-icons">keyboard_arrow_left</FontIcon>}
              style={Styles.backButton}
              labelStyle={Styles.backLabel}
            />
          }
          iconElementRight={this.state.selectIndex === 0 ? <Logged /> : <Login />}
        />
      </div>
    );
  }
}

export default TopBar;