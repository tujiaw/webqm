import React, { Component } from 'react';
import Styles from '../style/contact.js';
import Config from '../config/config';
import ghistory from '../utils/ghistory';
import RoomCreators from '../creators/room_creators';
import UserCreators from '../creators/user_creators';
import GroupList from './component/group_list';
import Util from '../utils/util';

class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCount: 0
    }
  }

  onItemClick = (id) => {
    console.log('on item click:' + id);
    //ghistory.push(`${Config.prefix}/user`, {userid: userid});
    UserCreators.setCurrentId(id);
    UserCreators.addChat(id);
    ghistory.push(`${Config.prefix}/dialogue`, {chatid: id});
  }

  onGroupExpand = (groupid, isExpand) => {
    //GroupCreators.setGroupExpand(groupid, isExpand);
  }

  componentDidMount() {
    RoomCreators.asyncGetRoomIdList().then((roomIdList) => {
      this.setState({
        roomCount: roomIdList.length
      })
      RoomCreators.asyncGetRoomInfoList(roomIdList);
    })
  }

  render() {
    const {rooms} = this.props;
    const groups = [{
        id: 1,
        name: '我的群',
        count: this.state.roomCount,
        isExpand: true,
        members: []
    }];

    for (let room of rooms) {
      if (room.name) {
            const memberItem = {
            id: room.ID,
            avatar: Util.getRoomAvatar(room),
            title: room.name,
            subtitle: ''
          }
          groups[0].members.push(memberItem);
      }
    }

    return (
      <div style={Styles.main}>
        <GroupList groups={groups} onItemClick={this.onItemClick} onGroupExpand={this.onGroupExpand}/>
      </div>
    )
  }
}

function RoomView(props) {
  return <Room {...props} />
}

export default RoomView;