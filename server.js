// Get dependencies
var express = require('express');
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

// Get defined routing files
var index = require('./server/routes/app');
const messageRoutes = require('./server/routes/messages');
const contactRoutes = require('./server/routes/contacts');
const documentsRoutes = require('./server/routes/documents');

// establish a connection to the mongo database
mongoose.connect('mongodb://localhost:27017/cms')
  .then(() => {
    console.log('Connected to database!');
  })
  .catch((err) => {
    console.log('Connection failed: ' + err);
  });

var app = express(); // create an instance of express

// Tell express to use the following parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.use(logger('dev')); // Tell express to use the Morgan logger

// Add support for CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

// Respond to CORS preflight without hitting SPA or JSON routes
app.use(function(req, res, next) {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Tell express to use the specified director as the
// root directory for your web site
// Angular 17+ outputs the browser bundle under dist/<project>/browser
app.use(express.static(path.join(__dirname, 'dist/cms/browser')));

// Tell express to map the default route ('/') to the index route
app.use('/', index);

// Map REST resources (MongoDB-backed handlers will replace in-memory stores later)
app.use('/messages', messageRoutes);
app.use('/contacts', contactRoutes);
app.use('/documents', documentsRoutes);

// Tell express to map all other non-defined routes back to the index page
// (Express 5 path-to-regexp rejects bare '*' patterns; use middleware instead.)
app.use(function(req, res, next) {
  if (req.method !== 'GET') {
    return next();
  }
  res.sendFile(path.join(__dirname, 'dist/cms/browser/index.html'));
});

// Define the port address and tell express to use this port
const port = process.env.PORT || '3000';
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

// Tell the server to start listening on the provided port
server.listen(port, function() {
  console.log('API running on localhost: ' + port)
});
