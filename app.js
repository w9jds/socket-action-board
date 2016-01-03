var express = require('express'),
    request = require('request'),
    database = require('./libs/db.js'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    home = io.of('/dashboard'),
    actions = io.of('/actions'),
    admin = io.of('/admin'),
    notifications = io.of('/notification');

_attachEvents();
app.use('/', express.static(__dirname + '/pages/home'));
app.use('/actions', express.static(__dirname + '/pages/actions'));
app.use('/admin', express.static(__dirname + '/pages/admins'));
app.use('/notification', express.static(__dirname + '/pages/notification'));

app.get('/actions', function(req, res) {
    _verifyLoadPage(req, res, 'actions.html', './pages/actions');
});

app.get('/admin', function(req, res) {
    _verifyLoadPage(req, res, 'admin.html', './pages/admins');
});

function _verifyLoadPage(req, res, index, root) {
    if (!req.query.usertoken) {
        res.send('Please login to twitch on the home page');
    }
    else {
        getTwitchTokenInfo(req.query.usertoken, function(body) {
            var response = JSON.parse(body);
            
            if (response.token.valid) {
                getUserPermissions(JSON.parse(body), function(permissions) {
                    if (permissions.is_admin) {
                        res.sendfile(index, { root: root});
                    }
                    else {
                        res.send('Invalid Permissions. Are you sure you are supposed to be here?');
                    }
                });
            }
            else {
                res.send('Invalid Twitch Token!')
            }
        });
    }
}

function _attachEvents() {
    home.on('connection', homeConnect);
    actions.on('connection', actionsConnect);
    admin.on('connection', adminConnect);
}

function homeConnect(socket) {
    socket.on('user_permission', function(data) {
        getTwitchTokenInfo(data.auth_token, function(body) {
            getUserPermissions(JSON.parse(body), function(permissions) {
                socket.emit('permissions', permissions);
            });
        });
    });
}

function actionsConnect(socket) {
    socket.on('notify', function(message) {
        notifications.send(message);
    });
    
    socket.on('reload', function() {
        notifications.emit('refresh', {});
    });
}

function adminConnect(socket) {
    database.getalluserpermissions(function(users) {
        socket.emit('userlist', users);
    });

    socket.on('update_permissions', function(data) {
        data.updates.forEach(function(element) {
           database.updateuserpermissions(element.username, element.isAdmin, element.accessActions);
        }, this);
        data.creates.forEach(function(element) {
            database.createnewuser(element.username, element.isAdmin, element.accessActions);
        }, this);
        
        socket.emit('refresh_page', true);
    });
}

function getTwitchTokenInfo(token, callback) {
    request('https://api.twitch.tv/kraken?oauth_token=' + token, function(error, response, body) {
        callback(response.body);
    });
}

function getUserPermissions(body, callback) {
    database.getuserpermissions(body, function(permissions) {
        callback(permissions);
    });
}

server.listen(8000);
