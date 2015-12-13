; (function(global, $, io) {
	"use strict";
	
	global.Pages = global.Pages || {};
	global.Pages.Actions = (function() {
		
		var _socket;
		
		function init() {
			
			_connect();
		}
		
		function _send() {

		}
		
		function _connect() {
			var host = "http://localhost";
			
			try {
				_socket = io.connect(host);
				
				// message('<p class="event">Socket Status: '+socket.readyState);
				
				// socket.onopen = function(){
				// 	message('<p class="event">Socket Status: '+socket.readyState+' (open)');
				// }
				
				// socket.onmessage = function(msg){
				// 	message('<p class="message">Received: '+msg.data);
				// }
				
				// socket.onclose = function(){
				// 	message('<p class="event">Socket Status: '+socket.readyState+' (Closed)');
				// }			
				
			} catch(exception) {
				
			}
		}
		
		return {
			init: init
		};
		
	}());
}(this, this.jQuery, this.io));