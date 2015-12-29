var mysql = require('mysql'),
    config = require('../config.json'),
    connection = mysql.createConnection(config.database.connection);

function _isConnected(callback) {
    var connected = connection.state === 'disconnected' ? false : true;
    
    if (connected) {
        callback();
    }
    else {
        _connect(callback);
    }
};

function _connect(callback) {
    connection.connect(function(error) {
        if (error) {
            console.log('Error connecting to Db');
            return;
        }

        callback();
    });
};

exports.getuserpermissions = function(response, callback) {
    _isConnected(function() {
        connection.query('CALL user_permission("' + response.token.user_name + '")', function (error, rows) {
            var permissions;
            if (error) {
                throw error;
            }
            
            permissions = rows[0][0];
            permissions.is_admin = !!+permissions.is_admin;
            permissions.can_use_actions = !!+permissions.can_use_actions;
            callback(permissions);
        });
    });
}

exports.getalluserpermissions = function(callback) {
    _isConnected(function() {
        connection.query('SELECT * FROM permissions', function(error, rows) {
            if (error) {
                throw error;
            }
            
            callback(rows);
        });
    });
}

exports.createnewuser = function(username, isAdmin, accessActions, callback) {
    _isConnected(function() {
        connection.query(['CALL create_user("', username, '",', isAdmin,',', accessActions, ')'].join(''), function (error, rows) {
            if (error) {
                throw error;
            }
            
            if (callback) {
                callback(true);
            }
        });
    });
}

exports.updateuserpermissions = function(username, isAdmin, accessActions, callback) {
    _isConnected(function() {
        connection.query(['CALL update_user("', username,'",', isAdmin, ',', accessActions, ')'].join(''), function(error, rows) {
            if (error) {
                throw error;
            }
            
            if (callback) {
                callback(true);
            }
        });
    });
}
