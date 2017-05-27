import React from 'react';
import {Card, CardHeader, CardTitle} from 'material-ui/Card';
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import UserCreators from '../creators/user_creators';
import TopBar from './component/top_bar';
import Util from '../utils/util';
import Styles from '../style/user_info';
import ghistory from '../utils/ghistory';
import Config from '../config/config';

class UserInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: 0,
      avatar: '',
      name: '',
      englishName: '',
      company: '',
      signature: '',
      mobile: '',
      telephone: '',
      email: '',
      city: ''
    }
  }

  componentDidMount() {
    const self = this;
    const {location} = this.props;
    const userid = location.state.userid;
    this.setState({userid: userid});
    UserCreators.asyncGetDetailUsersInfo(userid).then((result) => {
      let companyId = '';
      if (result[userid]) {
        const user = result[userid];
        if (user) {
          companyId = user.userInfo.companyId;
          let englishName = '';
          if (user.userInfo.englishNameFirst || user.userInfo.englishNameLast) {
            englishName = user.userInfo.englishNameFirst + ' ' + user.userInfo.englishNameLast;
          }
          self.setState({
            name: user.userInfo.name,
            englishName: englishName,
            avatar: Util.getUserAvatar(user.userInfo),
            signature: user.status,
            mobile: user.userInfo.mobile,
            telephone: user.phone,
            email: user.email,
            city: user.city,
          })
        }
      }
      return Promise.resolve(companyId);
    }).then((companyId) => {
      if (companyId && companyId.length) {
        UserCreators.asyncGetCompaniesInfo([companyId]).then((res) => {
          if (res[companyId]) {
            const companyName = res[companyId].companyShortName;
            if (companyName.length) {
              self.setState({
                company: companyName
              })
            }
          }
        })
      }
    }).catch(() => {

    });
  }

  onSendMsg = () => {
    const {location} = this.props;
    const userid = location.state.userid;
    UserCreators.setCurrentId(userid);
    UserCreators.addChat(userid);
    ghistory.push(`${Config.prefix}/dialogue`, {chatid: userid});
  }

  render() {
    return (
      <div>
        <TopBar pageName='userdetail' title='详细资料' id={this.state.userid}/>
        <Card>
          <CardHeader
            titleStyle={Styles.cardHeaderTitle}
            title={this.state.name}
            subtitle={this.state.englishName}
            avatar={<Avatar src={this.state.avatar} size={80} />} />
          <CardTitle title="签名" subtitle={this.state.signature} titleStyle={Styles.cardTitle}/>
        </Card>
       <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableRowColumn style={Styles.company}>{this.state.company}</TableRowColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          <TableRow>
            <TableRowColumn style={{width: '40px'}}>手机</TableRowColumn>
            <TableRowColumn>{this.state.mobile}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>电话</TableRowColumn>
            <TableRowColumn>{this.state.telephone}</TableRowColumn>
          </TableRow>
                <TableRow>
            <TableRowColumn>邮箱</TableRowColumn>
            <TableRowColumn>{this.state.email}</TableRowColumn>
          </TableRow>
                <TableRow>
            <TableRowColumn>城市</TableRowColumn>
            <TableRowColumn>{this.state.city}</TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
      <div style={Styles.footer}>
        <RaisedButton label="发消息" primary={true} onTouchTap={this.onSendMsg}/>
        <br/>
        <RaisedButton label="设为常用联系人"/>
      </div>
      </div>
    )
  }
}

export default UserInfo;