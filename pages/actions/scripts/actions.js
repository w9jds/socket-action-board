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
			$('#youtube').click(sendYoutube);
			$('#twitter').click(sendTwitter);
			$('#instagram').click(sendInstagram);
			$('#snapchat').click(sendSnapchat);
			$('#tablet').click(sendTablet);
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
		
		function sendYoutube() {
			_socket.emit('notify', {
				title: 'Youtube',
				message: 'Check out my youtube channel at https://goo.gl/fN0ZZQ',
				styles: [{ 
					selector: '.notify-header',
					property: 'background-color',
					value: '#b31217'
				}, {
					selector: '.notify-header',
					property: 'color',
					value: '#fff'
				}, {
					selector: '.notify-content',
					property: 'background-color',
					value: '#e52d27'
				}]
			});
		}
		
		function sendTwitter() {
			_socket.emit('notify', {
				title: 'Twitter',
				message: 'Follow me on twitter @Swebliss',
				styles: [{ 
					selector: '.notify-header',
					property: 'background-color',
					value: '#55acee'
				}, {
					selector: '.notify-header',
					property: 'color',
					value: '#fff'
				}, {
					selector: '.notify-content',
					property: 'background-color',
					value: '#66757f'
				}]
			});
		}
		
		function sendInstagram() {
			_socket.emit('notify', {
				title: 'Instagram',
				message: 'Stay up to date with all my selfies by following my Instagram: @Swebliss',
				styles: [{ 
					selector: '.notify-header',
					property: 'background-color',
					value: '#3f729b'
				}, {
					selector: '.notify-header',
					property: 'color',
					value: '#fff'
				}]
			});
		}
		
		function sendSnapchat() {
			_socket.emit('notify', {
				title: 'Snapchat',
				message: 'Add me on snapchat @Swebliss'
			});
		}
		
		function sendTablet() {
			_socket.emit('notify', {
				title: 'Drawing Tablet',
				message: 'I\'m currently drawing on a Wacom Cintiq 13HD!'
			});
		}
		
		function sendSoftware() {
			_socket.emit('notify', {
				title: 'Drawing Software',
				message: 'I\'m currently drawing in Manga Studio!'
			});
		}
		
		return {
			init: init
		};
		
	}());
}(this, this.jQuery, this.io));