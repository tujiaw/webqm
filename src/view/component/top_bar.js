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
import Styles from '../../style/component/top_bar';
import ghistory from '../../utils/ghistory';

class LeftElement extends Component {
  onBackClick = () => {
    ghistory.goBack();
  }

  render() {
    const {pageName} = this.props;
    return (
      pageName === 'dialogue'
      ? <FlatButton 
          label="返回"
          icon={<FontIcon style={Styles.backButtonIcon} className="material-icons">keyboard_arrow_left</FontIcon>}
          style={Styles.backButton}
          labelStyle={Styles.backLabel}
          onClick={this.onBackClick}
        />
      : <span></span>
      )
  }
}

class RightElement extends Component {
  render() {
    return (
        <IconMenu
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
      )
    }
}

class TopBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <AppBar
          style={Styles.appbar}
          titleStyle={Styles.title}
          title={this.props.title}
          iconElementLeft={<LeftElement {...this.props}/>}
          iconElementRight={<RightElement {...this.props}/>}
        />
      </div>
    );
  }
}

export default TopBar;