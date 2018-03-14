const dotenv = require('dotenv').config({path: './process.env'});
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3002;

const server = express().listen(PORT, () =>
  console.log(`Listening on ${PORT}`)
);

const io = socketIO(server);

const functions = require('./functions');

functions.getUserUpdates(io);

io.on('connection', socket => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

//add CORS
express().use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

module.exports = server;
