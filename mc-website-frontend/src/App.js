import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import styled from 'styled-components';
import io from 'socket.io-client';

import ApiCall from './framework/ApiCall';
import Flex from './framework/Flex';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from 'material-ui/Table';
import InfoIcon from 'material-ui-icons/Info';
import { CircularProgress } from 'material-ui/Progress';
import Snackbar from 'material-ui/Snackbar';
import CloseIcon from 'material-ui-icons/Close';
import IconButton from 'material-ui/IconButton';

const webSocketUri = 'wss://ws-minecraft-users.herokuapp.com/';

const StyledInfoIcon = styled(InfoIcon)`
  && {
    margin-right: 18px;
    width: 60px;
    height: 60px;
  }
`;

const Info = styled(Flex)`
  margin: 20px;
`;

const Progress = styled(CircularProgress)`
  margin: 15px;
`;

const FlexMax = styled(Flex)`
  width: 100%;
`;

const VersionInfo = styled.p`
  font-size: 8px;
`;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      users: [],
      socket: io(webSocketUri),
      openJoin: false,
      openLeft: false,
      leftPlayer: null
    };

    this.handleCloseJoin = this.handleCloseJoin.bind(this);
    this.handleCloseLeft = this.handleCloseLeft.bind(this);
  }

  componentWillMount() {
    this.state.socket.emit('requestUsers');
    ApiCall.get('users/online', res => {
      this.setState({
        users: res
      });
    });
  }

  handleCloseJoin() {
    this.setState({ openJoin: false });
  }

  handleCloseLeft() {
    this.setState({ openLeft: false });
  }

  componentDidUpdate() {
    const { socket, users } = this.state;

    const newUsers = _.clone(users);

    socket.on(
      'dbinsert',
      function(data) {
        newUsers.push(_.first(data));
        this.setState({
          users: newUsers,
          openJoin: true
        });
      }.bind(this)
    );

    socket.on(
      'dbdelete',
      function(data) {
        _.remove(newUsers, ['uuid', data.fields.uuid]);
        this.setState({
          users: newUsers,
          openLeft: true,
          leftPlayer: data.fields
        });
      }.bind(this)
    );
  }

  render() {
    const { users } = this.state;

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <FlexMax justifyContent="space-between" alignItems="center">
              <Typography variant="title" color="inherit">
                Users online on server (46.105.57.2:26235)
              </Typography>
              <VersionInfo>Version 1.01</VersionInfo>
            </FlexMax>
          </Toolbar>
        </AppBar>

        {!users ? (
          <Flex flexDirection="column" alignItems="center">
            <Progress size={80} />
          </Flex>
        ) : _.size(users) > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Rank</TableCell>
                <TableCell>Online since</TableCell>
                <TableCell>UUID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_.map(users, (user, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.parent}</TableCell>
                    <TableCell>
                      {moment(user.time)
                        .fromNow()}
                    </TableCell>
                    <TableCell>{user.uuid}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <Info flexDirection="column" alignItems="center">
            <Flex alignItems="center">
              <StyledInfoIcon />
              <h1>No users online</h1>
            </Flex>
          </Info>
        )}
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          open={this.state.openJoin}
          autoHideDuration={3000}
          onClose={this.handleCloseJoin}
          SnackbarContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={
            <span id="message-id">
              Player {_.last(users) && _.last(users).name} joined!
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleCloseJoin}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          open={this.state.openLeft}
          autoHideDuration={3000}
          onClose={this.handleCloseLeft}
          SnackbarContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={
            <span id="message-id">
              Player {this.state.leftPlayer && this.state.leftPlayer.name} left!
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleCloseJoin}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
      </div>
    );
  }
}

export default App;
