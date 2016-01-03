; (function(global, $, io) {
	"use strict";
	
	global.Pages = global.Pages || {};
	global.Pages.Notify = (function() {
		
		var _socket,
			_queue = [],
			_isOpen = false;
		
		function init() {			
			_connect();
			
			Object.observe(_queue, function(changes) {
				if (!_isOpen && _queue.length === 1) {
					_startQueue();
				}
			});
		}
		
		function _startQueue(isNextRun) {
			if (isNextRun) {
				_queue.shift();
			}
			
			if (_queue.length > 0) {
				_runNotify(_queue[0]);
			}
		}
		
		function _runNotify(data) {
			_isOpen = true;
			_clearStyles();

			$('.notify-text').text(data.message);
			
			if (data.styles && data.styles.length > 0) {
				$.each(data.styles, function(index, style) {
					$(style.selector).css(style.property, style.value);
				});
			}
            if (data.audio) {
                setTimeout(function() {
                    var audio = data.audio.source ? new Audio(data.audio.source) : new Audio('http://goo.gl/p3Hm3Y');
                    audio.play();
                }, 1000);
            }
			
			_triggerNotify();
		}
		
        function _received(data) {
			if (_queue.indexOf(data) < 0) {
				_queue.push(data);
			}
        }
		
		function _clearStyles() {
			$('.notify-content').removeAttr('style');
			$('.icon').removeAttr('style');
            $('.logo').removeAttr('style');
		}
		
		function _triggerNotify() {
			_animateIcon();
			_animateMessage();
		}
		
		function _animateIcon() {
			$('.icon')
				.animate({ height: 'toggle', width: 'toggle' }, 200)
				.animate({ left: 80 }, 400)
				.animate({ height: 90, width: 90, left: 0, top: 0 }, 500);
		}
		
		function _closeIcon() {
			$('.icon')
				.animate({ height: 10, width: 10, left: 80, top: 80 }, 400)
				.animate({ left: 0 }, 100, function() {
					setTimeout(function() {
						_isOpen = false;
						_startQueue(true);
					}, 1000);
				})
				.animate({ height: 'toggle', width: 'toggle'}, 200);
		}
		
		function _animateMessage() {
			var $line = $('.line'),
				$container = $('.container'),
				height = $container.height(),
				width = $container.width();
			
			$line
				.animate({ height: 'toggle', width: 'toggle'}, 200)
				.animate({ left: 90 }, 400)
				.animate({ top: 0 }, 300, function() {
					$container.animate({ height: 'toggle', width: 'toggle' }, 600);
				})
				.animate({ left: width + 90, height: height }, 600)
				.animate({ height: 5 }, 300)
				.animate({ left: 90 }, 300)
				.animate({ height: height }, 300, function () {
					setTimeout(function() {
						_closeMessage();
					}, 5000);
				});
		}
		
		function _closeMessage() {
			var $line = $('.line'),
				$container = $('.container');
				
			$line
				.animate({ height: 5 }, 300)
				.animate({ left: '+=' + $container.width() }, 300)
				.animate({ height: $container.height() }, 300, function() {
					$container.animate({ height: 'toggle', width: 'toggle' }, 600);
				})
				.animate({ height: 5, left: 90 }, 600, function() {
					_closeIcon();
				})
				.animate({ top: 90 }, 300)
				.animate({ left: 180}, 400)
				.animate({ height: 'toggle', width: 'toggle'}, 200);
		}
		
		function _connect() {
			var host = 'http://77.81.241.222:8000/notification';
			// var host = 'http://localhost:8000/notification';

            _socket = io.connect(host);
            _socket.on('message', _received);
            _socket.on('refresh', function() {
                location.reload();
            });
		}
		
		return {
			init: init
		};
		
	}());
}(this, this.jQuery, this.io));