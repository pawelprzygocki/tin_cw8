/* jshint node: true */
var express = require('express');
var app = express();
var httpServer = require("http").Server(app);
var io = require("socket.io")(httpServer);

var path = require('path');
var users = [];



app.use(express.static(path.join(__dirname, 'public')));

io.sockets.on("connection", function (socket) {
    socket.on("message", function (data) {
        io.sockets.emit("echo", " " + data.nick + " napisał: " + data.message);
    });
    socket.on("error", function (err) {
        console.dir(err);
    });
    socket.on("userConnected", function(data) {
       io.sockets.emit("userChange", data + " się zalogował.");
       users.push(data);
       users.sort();
       io.sockets.emit("userList", users);
    });
    
});

httpServer.listen(3000, function () {
    console.log('Serwer HTTP działa na porcie ' + 3000);
});
