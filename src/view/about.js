import React from 'react';
import {Card, CardHeader, CardTitle} from 'material-ui/Card';

import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import UserCreators from '../creators/user_creators';
import Util from '../utils/util';

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: '',
      name: '',
      company: '',
      signature: '',
      mobile: '',
      telephone: '',
      email: '',
      city: ''
    }
  }

  componentDidMount() {
    UserCreators.asyncGetBaseUsersInfo(Util.myid).then((result) => {
      if (result[Util.myid]) {
        const userInfo = result[Util.myid];
        this.setState({
          name: userInfo.name,
          city: userInfo.address,
          avatar: Util.getUserAvatar(userInfo),
        })
      }
    }).catch(() => {

    });
  }

  render() {
    return (
       <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow displayRowCheckbox={false}>
            <Card>
              <CardHeader
                title={this.state.name}
                subtitle={this.state.company}
                avatar={this.state.avatar}
              />
              <CardTitle title="签名" subtitle={this.state.signature} />
            </Card>
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
    )
  }
}

export default About;