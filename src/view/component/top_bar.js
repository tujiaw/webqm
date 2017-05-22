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

const RightMenu = {
  chat: [
    { key: 'chat_clear_all', value: '清空会话' }
  ],
  dialogue: [
    { key: 'dialogue_delete', value: '删除会话' },
    { key: 'dialogue_detail', value: '详细信息' },
  ],
}

class LeftElement extends Component {
  onBackClick = () => {
    if (this.props.pageName === 'dialogue') {
      ghistory.push('/main');
    } else {
      ghistory.goBack();
    }
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
    const {pageName} = this.props;
    return (
        <IconMenu
          iconButtonElement={
            <IconButton style={Styles.moreButton} iconStyle={Styles.moreButtonIcon}><MoreVertIcon /></IconButton>
          }
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
          {RightMenu[pageName] && RightMenu[pageName].map((menu, index) => {
            return <MenuItem key={index} primaryText={menu.value} key={menu.key} />  
          })}
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