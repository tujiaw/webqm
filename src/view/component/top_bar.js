import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Styles from '../../style/component/top_bar';
import ghistory from '../../utils/ghistory';
import UserCreators from '../../creators/user_creators';
import Util from '../../utils/util';

const RightMenu = {
  chat: [
    { key: 'chat_clear_all', value: '清空会话' }
  ],
  dialogue: [
    { key: 'dialogue_delete', value: '删除会话' },
    { key: 'dialogue_detail', value: '详细信息' },
  ],
  userdetail: [
    {key: 'userdetail_delete', value: '删除用户'}
  ]
}

class LeftElement extends Component {
  onBackClick = () => {
    if (this.props.pageName === 'dialogue') {
      ghistory.goMain();
    } else {
      ghistory.goBack();
    }
  }

  render() {
    const {pageName} = this.props;
    const isBackButtonVisible = (pageName === 'dialogue' || pageName === 'userdetail');
    return (
      <FlatButton 
          label="返回"
          icon={<FontIcon style={Styles.backButtonIcon} className="material-icons">keyboard_arrow_left</FontIcon>}
          labelStyle={Styles.backLabel}
          onClick={this.onBackClick}
          style={isBackButtonVisible ? Styles.backButtonVisible : Styles.backButtonHidden}
      />
      )
  }
}

class RightElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popupTips: '',
      popup: false,
      key: '',
    }
  }

  onMenuItemClick = (key) => {
    if (key === 'chat_clear_all') {
      this.setState({
        popupTips: '确定要清空所有会话？',
        popup: true,
        key: key,
      })
    } else if (key === 'dialogue_delete') {
      this.setState({
        popupTips: '确定要删除此会话吗？',
        popup: true,
        key: key,
      })
    } else if (key === 'dialogue_detail') {
      const {id} = this.props;
      if (Util.isQmUserId(id) || Util.isQmOrgId(id)) {
        ghistory.goUserInfo(id);
      } else if (Util.isQmRoomId(id)) {
        ghistory.goRoomInfo(id);
      }
    }
  }

  onDialogCancel = () => {
    this.setState({popup: false});
  }

  onDialogOk = () => {
    this.setState({popup: false});
    if (this.state.key === 'dialogue_delete') {
      UserCreators.removeChat(this.props.id);
      ghistory.goMain();
    } else if (this.state.key === 'chat_clear_all') {
      UserCreators.clearChat();
    }
  }

  onSearchClick = () => {
    ghistory.goSearch();
  }

  render() {
    const {pageName} = this.props;
    const dialogActions = [
      <FlatButton
        label="取消"
        primary={true}
        onTouchTap={this.onDialogCancel}
      />,
      <FlatButton
        label="确认"
        primary={false}
        onTouchTap={this.onDialogOk}
      />,
    ];

    return (<div style={{display: 'flex'}}>
        <IconButton iconClassName="material-icons" style={Styles.searchButton} onTouchTap={this.onSearchClick}>search</IconButton>
        <IconMenu
          iconButtonElement={
            <IconButton style={Styles.moreButton} iconStyle={Styles.moreButtonIcon}><MoreVertIcon /></IconButton>
          }
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
          {RightMenu[pageName] && RightMenu[pageName].map((menu, index) => {
            return <MenuItem primaryText={menu.value} key={menu.key} onTouchTap={this.onMenuItemClick.bind(this, menu.key)}/>  
          })}
        </IconMenu>
          <Dialog
            title={this.state.popupTips}
            actions={dialogActions}
            modal={false}
            open={this.state.popup}
            onRequestClose={this.onDialogCancel}
          >
          </Dialog>
        </div>
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