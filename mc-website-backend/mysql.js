const dbFunctions = {
  doQuery: (query, next) => {
    const con = mysql.createConnection(info);

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

const info = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB
};

var mysql = require('mysql');
var MySQLEvents = require('mysql-events');

module.exports = dbFunctions;
