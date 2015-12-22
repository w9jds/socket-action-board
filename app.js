var express = require('express'),
    request = require('request'),
    app = express(),
    config = require('./config.json'),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    home = io.of('/dashboard'),
    actions = io.of('/actions'),
    notifications = io.of('/notification');
    
_attachEvents();
app.use('/', express.static(__dirname + '/pages/home'));
app.use('/actions', express.static(__dirname + '/pages/actions'));
app.use('/notification', express.static(__dirname + '/pages/notification'));

app.get('/actions', function(req, res) {
    if (!req.query.usertoken) {
        res.send('Please login to twitch on the home page');
    }
    else {
        request('https://api.twitch.tv/kraken?oauth_token=' + req.query.usertoken, function(error, response, body) {
            var response = JSON.parse(body);
            
            if (response.token.valid && config.actionboard.indexOf(response.token.user_name) > -1) {
                res.sendfile('actions.html', { root: './pages/actions'});
            }
            else {
                res.send('Invalid Permissions. Are you sure you are supposed to be here?');
            }
        });
    }
});

function _attachEvents() {
    home.on('connection', homeConnect);
    actions.on('connection', clientConnect);
    notifications.on('connection', notifyConnect);
}

function homeConnect(socket) {
    console.log('Homepage client connected...');
    
    socket.on('user_permission', function(data) {
        verifyUserAccess(socket, data.auth_token);
    });
}

function clientConnect(socket) {
    socket.on('notify', function(message) {
        broadcastNotifiction(message);
    });
}

function notifyConnect(socket) {
    console.log('Notification client connected...');
}

function verifyUserAccess(socket, token) {
    var permissions = {
        admin: false,
        actionboard: false
    };
    
    request('https://api.twitch.tv/kraken?oauth_token=' + token, function(error, response, body) {
        var response = JSON.parse(body);
        
        if (response.token.valid) {
            if (config.admins.indexOf(response.token.user_name) > -1) {
                permissions.admin = true;
            }
            if (config.actionboard.indexOf(response.token.user_name) > -1) {
                permissions.actionboard = true;
            }
        }
        
        socket.emit('permissions', permissions);
    });
}

function broadcastNotifiction(message) {
    notifications.send(message);
}

server.listen(8000);