import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Styles from '../../style/component/top_bar';
import ghistory from '../../utils/ghistory';

class LeftElement extends Component {
  onBackClick = () => {
    ghistory.goBack();
  }

  render() {
    const {pageName} = this.props;
    const hasBackButton = (pageName === 'dialogue' || pageName === 'user');
    return (
      hasBackButton
      ? <FlatButton 
          label="返回"
          icon={<FontIcon style={Styles.backButtonIcon} className="material-icons">keyboard_arrow_left</FontIcon>}
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
          <MenuItem primaryText="详细资料" />
          <MenuItem primaryText="删除" />
          <MenuItem primaryText="退出" />
        </IconMenu>
      )
    }
}

class TopBar extends Component {
  render() {
    return (
      <div>
        <AppBar
          style={Styles.appbar}
          titleStyle={Styles.title}
          title={this.props.title}
          iconElementLeft={<LeftElement {...this.props}/>}
          iconElementRight={<RightElement {...this.props}/>}
          iconStyleLeft={{marginLeft: '-30px'}}
        />
      </div>
    );
  }
}

export default TopBar;