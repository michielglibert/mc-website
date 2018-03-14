const functions = {
  getUserUpdates: io => {
    const eventWatcher = MySQLEvents(dsn);
    const event = eventWatcher.add('mc_tekkit.users_online', function(
      oldRow,
      newRow,
      event
    ) {
      //insert
      if (oldRow === null) {
        console.log('inserted');

        const { uuid } = newRow.fields;

        const query = `SELECT uuid, name, time, parent FROM users_online JOIN permissions_inheritance ON uuid = child WHERE uuid = '${uuid}'`;

        functions.doQuery(query, function(result) {
          io.emit('dbinsert', result);
        });
      }

      //delete
      if (newRow === null) {
        console.log('deleted');

        io.emit('dbdelete', oldRow);
      }

      //update
      if (oldRow !== null && newRow !== null) {
        console.log('update');
      }
    });
    console.log('Listening for db changes...');
  },
  doQuery: (query, next) => {
    const con = mysql.createConnection(dsn);

    con.connect(function(err) {
      if (err) throw err;
      console.log('Connected!');

      con.query(query, function(err, result, fields) {
        if (err) throw err;
        con.end();
        return next(result);
      });
    });
  }
};

const dsn = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB
};

var mysql = require('mysql');
var MySQLEvents = require('mysql-events');

module.exports = functions;
