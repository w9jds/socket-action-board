; (function(global, $, io) {
	'use strict';
	
	global.Pages = global.Pages || {};
	global.Pages.Actions = (function() {
		
		var _socket;
		
		function init() {
			
			_connect();
			_attachEvents();
		}
		
		function _attachEvents() {
			$('#discord').click(sendDiscord);
		}
		
		function _connect() {
			// var host = 'http://77.81.241.222:8000/actions';
			var host = 'http://localhost:8000/actions';
			
			try {
				_socket = io.connect(host);

			} catch(exception) {
				
			}
		}
		
		function sendDiscord() {
			_socket.emit('notify', {
				title: 'Discord',
				message: 'Join my brand new Discord channel! discord.swebliss.com'
			});
		}
		
		return {
			init: init
		};
		
	}());
}(this, this.jQuery, this.io));