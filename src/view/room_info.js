import React from 'react';
import {Card, CardHeader, CardTitle} from 'material-ui/Card';
import TopBar from './component/top_bar';
import Avatar from 'material-ui/Avatar';
import Styles from '../style/room_info';
import UserCreators from '../creators/user_creators';
import RoomCreators from '../creators/room_creators';
import Util from '../utils/util';
import RoomMembersContainer from '../container/room_member_container';
import Toggle from 'material-ui/Toggle';
import RaisedButton from 'material-ui/RaisedButton';
import ghistory from '../utils/ghistory';

let g_settingTimeout = 0;
class RoomInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      roomid: 0,
      name: 'unkown',
      alias: 0,
      avatar: '',
      desc: '',
      openInSearch: false,
      isRoomOwner: false,
    }
  }

  isRoomOwner = (memberInfo) => {
    if (memberInfo) {
      for(const member of memberInfo) {
        if (member.role === 'ROLE_OWNER' && member.id === Util.myid) {
          return true;
        }
      }
    }
    return false;
  }

  componentDidMount() {
    const self = this;
    const {location} = this.props;
    const roomid = location.state.roomid;
    RoomCreators.asyncGetRoomInfoList([roomid]).then((result) => {
      if (result[roomid]) {
        const room = result[roomid];
        if (room) {
          self.setState({
            total: room.total,
            roomid: roomid,
            name: room.name,
            alias: room.alias,
            avatar: Util.getRoomAvatar(room),
            desc: room.description,
            openInSearch: room.openInSearch,
            isRoomOwner: self.isRoomOwner(room.memberInfo)
          })
        }
      }
    })
    RoomCreators.asyncGetRoomMemberList([roomid]).then((result) => {
      if (result[roomid]) {
        const room = result[roomid];
        if (room) {
          RoomCreators.initRoomMembers(room.memberInfo);
          const requestIdList = room.memberInfo.map(member => member.id);
          UserCreators.asyncBatchUpdateUserInfo(requestIdList);
        }
      }
    })
  }

  componentWillUnmount() {
    if (g_settingTimeout) {
      clearTimeout(g_settingTimeout)
    }
  }

  onOpenSearchClick = (event, isChecked) => {
    if (g_settingTimeout) {
      clearTimeout(g_settingTimeout);
    }

    const self = this;
    function setRoomOpenSearch(roomid, isChecked) {
      RoomCreators.asyncSetRoomOpenSearch(roomid, isChecked).then(() => {
        self.setState({ openInSearch: isChecked });
      }).catch(() => {
        self.setState({ openInSearch: !isChecked });
      })
    }

    g_settingTimeout = setTimeout(function() {
      setRoomOpenSearch(self.state.roomid, isChecked);
    }, 1000);
  }

  onSendMsg = () => {
    const id = this.state.roomid;
    UserCreators.setCurrentId(id);
    UserCreators.addChat(id);
    ghistory.goDialogue();
  }

  getSubTitle = () => {
    const {alias, openInSearch, isRoomOwner} = this.state;
    return <div style={{display: 'flex', marginTop: 5}}>
      <div style={Styles.aliasLayout}><span>群号：</span><span style={Styles.alias}>{alias}</span></div>
      {isRoomOwner && <Toggle label="开放群组" 
        defaultToggled={openInSearch} 
        labelPosition="right"
        onToggle={this.onOpenSearchClick}
      />}
    </div>
  }

  render() {
    return (
      <div style={Styles.root}>
        <TopBar pageName='userdetail' title='详细资料' id={this.state.userid}/>
        <Card>
          <CardHeader
            titleStyle={Styles.cardHeaderTitle}
            title={this.state.name}
            subtitle={this.getSubTitle()}
            avatar={<Avatar src={this.state.avatar} size={80} />} />
          <CardTitle title="群简介" subtitle={this.state.desc} titleStyle={Styles.cardTitle}/>
        </Card>
        <RoomMembersContainer/>
        <div style={Styles.footer}>
          <RaisedButton label="发消息" primary={true} onTouchTap={this.onSendMsg}/>
        </div>
      </div>
    )
  }
}

export default RoomInfo;