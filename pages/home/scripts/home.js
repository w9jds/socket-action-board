; (function(global, $, io, Twitch) {
	"use strict";
	
	global.Pages = global.Pages || {};
	global.Pages.Home = (function() {
		
		var _socket;
		
		function init() {			
			_connect();

            _attachEvents();
		}
        
        function _twitch() {
            Twitch.init({ clientId: 'eapkg3vs1icwh3841z5br4hhm3thl61' }, function(error, status) {
                if (status.authenticated) {
                    $('.user-menu').show();

                    _populateNav();
                    _verifyPermissions(status.token);
                }
                else {
                    $('.login-container').show();
                }
            });
        }
        
        function _verifyPermissions(token) {
            _socket.emit('user_permission', { 
                auth_token: token
            });
        }
		
		function _connect() {
			var host = 'http://77.81.241.222:8000/dashboard';
			// var host = 'http://localhost:8000/dashboard';
            
            _socket = io.connect(host);
            _socket.on('connect', function() {
                _twitch();
            });
            _socket.on('permissions', _usePermissions);
		}
        
        function _attachEvents() {
            $('.twitch-connect').click(function() {
                Twitch.login({ scope: ['user_read','channel_subscriptions'] });
            });
            
            Twitch.events.addListener('auth.login', function() {
                history.pushState('', document.title, window.location.pathname);
            });
        }
        
        function _populateNav() {
            Twitch.api({ method: 'user' }, function(error, user) {
                $('.user-icon').attr('src', user.logo);
                $('.username').text(user.display_name);
            });
        }
        
        function _usePermissions(permissions) {
            if (permissions.is_admin) {
                $('.admin-dashboard').attr('href', window.location.origin + '/admin?usertoken=' + Twitch.getToken());
                $('.admin-dashboard').show();
            }
            if (permissions.can_use_actions) {
                $('.action-dashboard').attr('href', window.location.origin + '/actions?usertoken=' + Twitch.getToken());
                $('.action-dashboard').show();
            }
        }
		
		return {
			init: init
		};
		
	}());
}(this, this.jQuery, this.io, this.Twitch));