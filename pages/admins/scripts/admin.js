; (function(global, $, io, Twitch, _) {
	"use strict";
	
	global.Pages = global.Pages || {};
	global.Pages.Admin = (function() {
		
		var _socket,
            _viewModel;
		
		function init() {			
			_connect();

            _attachEvents();
		}
        
        function _twitch() {

        }
        
        function _verifyPermissions(token) {
            _socket.emit('user_permission', { 
                auth_token: token
            });
        }
		
		function _connect() {
			var host = 'http://77.81.241.222:8000/admin';
			// var host = 'http://localhost:8000/admin';
            
            _socket = io.connect(host);
            _socket.on('connect', function() {
                _twitch(); 
            });
            _socket.on('permissions', _usePermissions);
            _socket.on('refresh_page', function() {
                location.reload();
            });
            _socket.on('userlist', function(users) {
                _viewModel = new _buildBindings(users);
            });
		}
        
        function _attachEvents() {
            $('.save-button').click(_saveChanges);
            $('.new-user').click(_addUser);
        }
        
        function _populateNav() {
            Twitch.api({ method: 'user' }, function(error, user) {
                $('.user-icon').attr('src', user.logo);
                $('.username').text(user.display_name);
            });
        }
        
        function _addUser() {
            _viewModel.newUsers.push({
                username: ko.observable(''),
                isAdmin: ko.observable(false),
                accessActions: ko.observable(false)
            });
        }
        
        function _saveChanges() {
            var changes = {
                    updates: [],
                    creates: []
                };
            
            _.each(_viewModel.users(), function(user) {
                if (_viewModel.stored[user.id]) {
                    var stored = _viewModel.stored[user.id];
                    
                    if (!!+stored.is_admin !== user.isAdmin() || !!+stored.can_use_actions !== user.accessActions()) {
                        changes.updates.push({
                            username: user.username,
                            isAdmin: user.isAdmin(),
                            accessActions: user.accessActions()
                        });
                    }
                }
            });
            
            _.each(_viewModel.newUsers(), function(user) {
                if (user.username()) {
                    changes.creates.push({
                        username: user.username(),
                        isAdmin: user.isAdmin(),
                        accessActions: user.accessActions()
                    });
                }
            });
            
            _socket.emit('update_permissions', changes);
        }
        
        function _buildBindings(users) {
            var self = this;
            self.users = ko.observableArray([]);
            self.newUsers = ko.observableArray([]);
            self.stored = {};
            
            self.load = function() {
                self.users.removeAll();

                _.each(users, function(user) {
                    self.stored[user.index] = user;
                    self.users.push({
                        id: user.index,
                        username: user.user_name,
                        isAdmin: ko.observable(!!+user.is_admin),
                        accessActions: ko.observable(!!+user.can_use_actions)
                    });
                });
                
                ko.applyBindings(self);
            }
            
            self.load();
        }
        
        function _usePermissions(permissions) {
            if (permissions.admin) {
                $('.admin-dashboard').show();
            }
            if (permissions.actionboard) {
                $('.action-dashboard').attr('href', window.location.origin + '/actions?usertoken=' + Twitch.getToken());
                $('.action-dashboard').show();
            }
        }
		
		return {
			init: init
		};
		
	}());
}(this, this.jQuery, this.io, this.Twitch, this._));