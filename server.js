var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var moment = require('moment');
//var cors = require('cors');
// var bodyparser = require('body-parser');
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

users = [];
connections = [];
//messages = [];

// let dev_db_url = 'mongodb://localhost:27017/chatapp';
// const mongoDB = process.env.MONGODB_URI || dev_db_url;
// mongoose.connect(mongoDB, {useNewUrlParser: true});
// mongoose.Promise = global.Promise;
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB Connection Error'));

// let Users = new Schema({
//     username: {
//         type: String,
//         required: true
//     },
//     message: {
//         type: String
//     }

// });

server.listen(process.env.PORT || 4000);
server.listen(function () {
    console.info('Server listening on port ' + this.address().port);
});


//app.use(cors());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/users', function (req, res) {
    res.send(users);
});

// app.get('/messages', function (req, res) {
//     res.send();
// });

// //Connection with socket
io.sockets.on('connection', function (socket) {
    connections.push(socket);
    console.log('Connected: %s sockets Connected', connections.length);

    //Disconnection with socket
    socket.on('disconnnection', function (socket) {
        //if(!socket.username) return;
        users.splice(users.indexOf(socket.users), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        //console.log('Disconnected: %s sockets Connected', connections.length);
    });

    //Send Message 
    socket.on('send message', function (data) {
        io.sockets.emit('new message', {
            msg: data,
            user: socket.username,
            time: moment().format('lll')
        });

    });

    socket.on('typing', function (data) {
        io.sockets.emit('typing', {
            message: data.message,
            user: data.user
        });
    });

    // socket.on('get data', function (data) {
    //     io.sockets.emit('get data', {
    //         username: req.params.username,
    //         message: req.params.message
    //     });
    // });

    //New Users
    socket.on('new user', function (message, callback) {
        callback(true);
        socket.username = message;
        users.push(socket.username);
        updateUsernames();

    });

    function updateUsernames() {
        io.sockets.emit('get users', users);
    }

    console.log('Login Time: ', moment().format('lll'));
    //console.log((users)); 
});