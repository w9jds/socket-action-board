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
			$('#discord').click(_sendDiscord);
			$('#youtube').click(_sendYoutube);
			$('#twitter').click(_sendTwitter);
			$('#instagram').click(_sendInstagram);
			$('#snapchat').click(_sendSnapchat);
			$('#tablet').click(_sendTablet);
            $('#send-custom').click(_sendCustom);
            $('#send-sound').click(_sendSound);
            $('#bananarain').click(function() {
                _socket.emit('bababanana', {});
            });
            $('.use-audio').change(function() {
                $('.audio-url-container').toggle();
            });
            $('#refresh').click(function() {
                _socket.emit('reload', {}); 
            });
		}
		
		function _connect() {
			var host = 'http://77.81.241.222:8000/actions';
			// var host = 'http://localhost:8000/actions';

            _socket = io.connect(host);
		}
        
        function _sendCustom() {
            var message = {
                message: '',
                styles: []
            };
            
            if ($('.use-audio').is(':checked')) {
                var audio = $('.audio-url').val();
                message.audio = audio ? { source: audio } : true;
            }
            
            if ($('.icon-url').val()) {
                message.styles.push({
                    selector: '.logo',
                    property: 'background-image',
                    value: 'url(' + $('.icon-url').val() + ')'
                });
            }
            
            if ($('.custom-message').val()) {
                message.message = $('.custom-message').val();
                _socket.emit('notify', message);
            }
        }
        
        function _sendSound() {
            if ($('.sound-audio-url').val()) {
                _socket.emit('audio', {
                    source: $('.sound-audio-url').val(),
                    delay: $('.duration').val() ? parseInt($('.duration').val()) : 0
                });
            }
        }
		
		function _sendDiscord() {
			_socket.emit('notify', {
				message: 'Join my brand new Discord channel! discord.swebliss.com'
			});
		}
		
		function _sendYoutube() {
			_socket.emit('notify', {
				message: 'Check out my youtube channel at https://goo.gl/fN0ZZQ',
				styles: [{ 
					selector: '.icon',
					property: 'background-color',
					value: '#b31217'
				}, {
					selector: '.notify-content',
					property: 'background',
					value: 'rgba(229,45,27,.7)'
				}]
			});
		}
		
		function _sendTwitter() {
			_socket.emit('notify', {
				message: 'Follow me on twitter @Swebliss',
				styles: [{ 
					selector: '.icon',
					property: 'background-color',
					value: '#55acee'
				}, {
					selector: '.notify-content',
					property: 'background',
					value: 'rgba(66,75,127,.7)'
				}]
			});
		}
		
		function _sendInstagram() {
			_socket.emit('notify', {
				message: 'Stay up to date with all my selfies by following my Instagram: @Swebliss',
				styles: [{ 
					selector: '.icon',
					property: 'background-color',
					value: '#3f729b'
				}]
			});
		}
		
		function _sendSnapchat() {
			_socket.emit('notify', {
				message: 'Add me on snapchat @Swebliss'
			});
		}
		
		function _sendTablet() {
			_socket.emit('notify', {
				message: 'I\'m currently drawing on a Wacom Cintiq 13HD!'
			});
		}
		
		function _sendSoftware() {
			_socket.emit('notify', {
				message: 'I\'m currently drawing in Manga Studio!'
			});
		}
		
		return {
			init: init
		};
		
	}());
}(this, this.jQuery, this.io));