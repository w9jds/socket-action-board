; (function(global, $, io) {
	"use strict";
	
	global.Pages = global.Pages || {};
	global.Pages.Notify = (function() {
		
		var _socket;
		
		function init() {			
			_connect();
		}
		
        function _received(data) {
            $('#title').text(data.title);
			$('#content').text(data.message);
			
			$('.notify-header').animate({ width: 'toggle' }, 1000, function() {
				$('.notify-content').animate({ height: 'toggle' }, 500);

				setTimeout(function() {
					$('.notify-content').animate({ height: 'toggle' }, 1000, function() {
						$('.notify-header').animate({ width: 'toggle' }, 500);
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