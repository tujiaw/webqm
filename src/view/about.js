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
import UserCreators from '../creators/user_creators';
import Util from '../utils/util';
import Styles from '../style/about';

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    UserCreators.asyncGetDetailUsersInfo(Util.myid).then((result) => {
      let companyId = '';
      if (result[Util.myid]) {
        const user = result[Util.myid];
        if (user) {
          companyId = user.userInfo.companyId;
          this.setState({
            name: user.userInfo.name,
            englishName: user.userInfo.englishNameFirst + ' ' + user.userInfo.englishNameLast,
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
              this.setState({
                company: companyName
              })
            }
          }
        })
      }
    }).catch(() => {

    });
  }

  render() {
    return (
      <div>
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
      </div>
    )
  }
}

export default About;