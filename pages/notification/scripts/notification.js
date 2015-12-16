; (function(global, $, io) {
	"use strict";
	
	global.Pages = global.Pages || {};
	global.Pages.Notify = (function() {
		
		var _socket;
		
		function init() {			
			_connect();
		}
		
        function _received() {
            
        }
		
		function _connect() {
			var host = 'http://77.81.241.222:8000/notification';
			
			try {
				_socket = io.connect(host);
				_socket.onmessage = _received;
									
			} catch(exception) {
				
			}
		}
		
		return {
			init: init
		};
		
	}());
}(this, this.jQuery, this.io));