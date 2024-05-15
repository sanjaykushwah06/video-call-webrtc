let express = require('express');
var path = require('path');

let app = express();
let fs = require('fs');
let https = require('https');

let server = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, '/ssl/key.pem'), 'utf8'),
    cert: fs.readFileSync(path.join(__dirname, '/ssl/server.crt'), 'utf8'),
    requestCert: true,
    rejectUnauthorized: false,
  },
  app
);
//let server = require('http').Server(app);
let io = require('socket.io')(server);
let stream = require('./ws/stream');
//let path = require('path');
let favicon = require('serve-favicon');

app.use(favicon(path.join(__dirname, 'favicon.ico')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.of('/stream').on('connection', stream);

server.listen(3000);
