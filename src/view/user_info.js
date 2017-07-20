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
import FavoriteCreators from '../creators/favorite_creators';
import TopBar from './component/top_bar';
import Util from '../utils/util';
import Styles from '../style/user_info';
import ghistory from '../utils/ghistory';

const g_text = {
  set_favorite: '设为常用联系人',
  remove_favorite: '移除常用联系人',
  add_follow: '添加关注',
  cancel_follow: '取消关注'
}
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
            if (companyName && companyName.length) {
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

  onFirstButtonClick = () => {
    const {location} = this.props;
    const userid = location.state.userid;
    UserCreators.setCurrentId(userid);
    UserCreators.addChat(userid);
    ghistory.goDialogue();
  }

  onSecondButtonClick = (text) => {
    if (!this.state.userid) {
      return;
    }
    if (text === g_text.set_favorite) {
      FavoriteCreators.asyncAddFavorite(this.state.userid).catch(() => {
        // 失败提醒
      })
    } else if (text === g_text.remove_favorite) {
      FavoriteCreators.asyncRemoveFavorite(this.state.userid).catch(() => {
        // 失败提醒
      })
    }
    ghistory.goBack();
  }

  render() {
    const {userid} = this.state;
    const getFirstButtonLabel = function() {
      if (Util.isQmUserId(userid)) {
        return "发消息";
      } else if (Util.isQmOrgId(userid)) {
        return "反馈留言";
      }
      return "";
    }

    const getSecondButtonLabel = function() {
      if (Util.isQmUserId(userid)) {
        return FavoriteCreators.isFavorite(userid) ? g_text.remove_favorite : g_text.set_favorite;
      } else if (Util.isQmOrgId(userid)) {
        return g_text.add_follow;
      }
      return "";
    }

    const firstButtonLabel = getFirstButtonLabel();
    const secondButtonLabel = getSecondButtonLabel();

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
        {firstButtonLabel.length && <RaisedButton label={firstButtonLabel} primary={true} onTouchTap={this.onFirstButtonClick}/>}
        {firstButtonLabel.length && <br/>}
        {secondButtonLabel.length && <RaisedButton label={secondButtonLabel} onTouchTap={this.onSecondButtonClick.bind(this, secondButtonLabel)} />}
      </div>
      </div>
    )
  }
}

export default UserInfo;