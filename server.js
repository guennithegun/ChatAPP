////////////
// IMPORT ALL NECESSARY MODULES AND FILES
////////////
const express = require('express');
const bodyParser = require('body-parser');
let app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

////////////
//USE FUNCTIONS
////////////
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

////////////
//MESSAGE MODEL
////////////
let Message = mongoose.model('Message', {
  name : String,
  message : String
});

////////////
//REQUESTS TO ENDPOINTS
////////////
app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  });
});

app.post('/messages', (req, res) => {
  let message = new Message(req.body);
  message.save((error) => {
    if (error) {
      res.sendStatus(500);
    }
    io.emit('message', req.body);
    res.sendStatus(200);
  });
});

////////////
//CONNECT TO DB // SOCKET
////////////
let dbUrl = 'mongodb+srv://chatAdmin:guenni@cluster0-hqyxi.mongodb.net/cluster0?retryWrites=true';

io.on('connection', () => {
  console.log('a user is connected')
});

mongoose.connect(dbUrl, (err) => {
  console.log('mongodb connected', err);
});

////////////
//PORT
////////////
let server = http.listen(8080, () => {
  console.log('server is running on port', server.address().port);
});
