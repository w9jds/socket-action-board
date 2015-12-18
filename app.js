var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    actions = io.of('/actions'),
    notifications = io.of('/notification');
    
_attachEvents();
app.use('/actions', express.static(__dirname + '/pages/actions'));
app.use('/notification', express.static(__dirname + '/pages/notification'));
    
function _attachEvents() {
    actions.on('connection', clientConnect);
    notifications.on('connection', notifyConnect);
}

function clientConnect(socket) {
    console.log('New Connection Established...');
    
    socket.on('notify', function(message) {
        broadcastNotifiction(message);
    });
}

function notifyConnect(socket) {
    console.log('New Notification Client Connected...');
    

}

function actionRecieved(content) {
    console.log('Notificaion about to be broadcast!')
    
    broadcastNotifiction(content);
}

function broadcastNotifiction(message) {
    notifications.send(message);
}

server.listen(8000);