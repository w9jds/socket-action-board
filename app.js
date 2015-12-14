var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server);

_attachEvents();
app.use('/actions', express.static(__dirname + '/pages/actions'));
    
function _attachEvents() {
    io.of('/actions')
        .on('connection', clientConnect);
}

function clientConnect(socket) {
    console.log('New Connection Established...');
    
    socket.on('action fired', actionRecieved);
}

function actionRecieved(content) {
    var action = JSON.parse(content);
    
    
}

function broadcast(message) {
    io.sockets.emit(message);
}

server.listen(8000);