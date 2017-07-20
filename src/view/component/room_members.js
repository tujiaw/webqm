import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import UserCreators from '../../creators/user_creators';
import TextField from 'material-ui/TextField';
import ghistory from '../../utils/ghistory';

class RoomMembers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMembers: [],
      backupMembers: [],
      tableHeight: 0
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize = () => {
    const screenHeight = document.documentElement.clientHeight;
    this.setState({ tableHeight: screenHeight - 450 });
  }

  getRoleString = (role) => {
    const roleMap = {
      ROLE_OWNER: '群主',
      ROLE_ADMIN: '管理员',
      ROLE_MEMBER: '群成员',
    }
    if (roleMap[role]) {
      return roleMap[role];
    }
    return '群成员';
  }

  onSearchChanged = (event, newValue) => {
    newValue = newValue.trim();
    if (newValue.length === 0) {
      this.setState({ showMembers: this.state.backupMembers });
    } else {
      const newMembers = [];
      for (const member of this.state.backupMembers) {
        if (member.name.indexOf(newValue) >= 0 || member.company.indexOf(newValue) >= 0) {
          newMembers.push(member);
        }
      }
      this.setState({ showMembers: newMembers });
    }
  }

  onRowSelected = (indexList) => {
    if (indexList.length) {
      const index = indexList[0];
      if (index >= 0 && this.state.showMembers.length > index) {
        const id = this.state.showMembers[index].id;
        ghistory.goUserInfo(id);
      }
    }
  }

  componentWillReceiveProps(newProps) {
    const self = this;
    const showMembers = [];
    newProps.members.forEach((member, index) => {
        const {name} = UserCreators.getBaseInfo(member.id);
        const company = UserCreators.getCompanyName(member.id);
        if (name) {
          showMembers.push({
            id: member.id,
            name: name,
            company: company || '',
            role: self.getRoleString(member.role)
          })
        }
    })
    this.setState({ 
      showMembers: showMembers,
      backupMembers: showMembers,
    });
  }

  render() {
    const tableHeight = this.state.tableHeight;
    return (
      <Table height={tableHeight > 0 ? tableHeight+'px' : ''} 
        wrapperStyle={{overflowX: 'hidden'}}
        onRowSelection={this.onRowSelected}
        footerStyle={{padding: 0}}
      >
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn colSpan="3" style={{margin: 0, padding: 0}}>
              <TextField hintText="搜索人名或机构名" 
                underlineShow={false}
                fullWidth={true}
                onChange={this.onSearchChanged}
                style={{marginLeft: 10, marginRight: 20}}
              />
            </TableHeaderColumn>
          </TableRow>
          <TableRow style={{background: '#373737'}}>
            <TableHeaderColumn>群成员({this.state.showMembers.length})</TableHeaderColumn>
            <TableHeaderColumn>机构名</TableHeaderColumn>
            <TableHeaderColumn>权限</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false} style={{height: 300}}>
          {this.state.showMembers.map((member, index) => {
              return <TableRow key={index} style={{cursor: 'pointer'}}>
                <TableRowColumn>{member.name}</TableRowColumn>
                <TableRowColumn>{member.company}</TableRowColumn>
                <TableRowColumn>{member.role}</TableRowColumn>
              </TableRow>
          })}
        </TableBody>
      </Table>
    )
  }
}

function RoomMembersView(props) {
  return <RoomMembers {...props} />
}

export default RoomMembersView;