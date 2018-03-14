const express= require('express');
const router = express.Router();

var functions = require('./functions');
const _ = require('underscore');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET online */
router.get('/users/online', function(req, res, next) {
  const result = functions.getUsers(function(result) {
    res.json(result);
  });
});

module.exports = router;
