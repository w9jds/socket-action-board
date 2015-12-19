; (function(global, $, io) {
	"use strict";
	
	global.Pages = global.Pages || {};
	global.Pages.Notify = (function() {
		
		var _socket,
			_isOpen = false;
		
		function init() {			
			_connect();
		}
		
        function _received(data) {
			if (!_isOpen) {
				_isOpen = true;
				_clearStyles()
				
				$('#title').text(data.title);
				$('#content').text(data.message);
				
				if (data.styles && data.styles.length > 0) {
					$.each(data.styles, function(index, style) {
						$(style.selector).css(style.property, style.value);
					});
				}
				
				_triggerNotify();
			}
        }
		
		function _clearStyles() {
			$('.notify-header').removeAttr('style');
			$('.notify-content').removeAttr('style');
		}
		
		function _triggerNotify() {
			$('.notify-header').animate({ width: 'toggle' }, 1000, function() {
				$('.notify-content').animate({ height: 'toggle' }, 500);

				setTimeout(function() {
					$('.notify-content').animate({ height: 'toggle' }, 1000, function() {
						$('.notify-header').animate({ width: 'toggle' }, 500, function() {
							_isOpen = false;
						});
					});
				}, 5000);
			});
		}
		
		function _connect() {
			// var host = 'http://77.81.241.222:8000/notification';
			var host = 'http://localhost:8000/notification';
			
			try {
				_socket = io.connect(host);
				_socket.on('message', _received);
									
			} catch(exception) {
				
			}
		}
		
		return {
			init: init
		};
		
	}());
}(this, this.jQuery, this.io));