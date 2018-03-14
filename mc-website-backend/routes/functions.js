var dbFunctions = require('../mysql');

const functions = {
  getUsers: next => {
    const query =
      'SELECT uuid, name, time, parent FROM users_online JOIN permissions_inheritance ON uuid = child';
    const result = dbFunctions.doQuery(query, next);
  },
  getUserUpdates: io => {
    dbFunctions.mySqlEventWatcher(io);
  }
};

module.exports = functions;
