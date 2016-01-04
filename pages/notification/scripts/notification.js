; (function(global, $, io) {
	"use strict";
	
	global.Pages = global.Pages || {};
	global.Pages.Notify = (function() {
		
		var _socket,
            _canvas,
            _ctx,
            _raining = false,
            _bananainterval,
            _rain = [],
			_queue = [],
			_isOpen = false;
		
		function init() {			
			_connect();
            
            _canvas = document.getElementById('sheet');
            _ctx = _canvas.getContext('2d');
            
            _canvas.height = window.innerHeight;
            _canvas.width = window.innerWidth;
			
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
                if (_queue[0].message) {
                    _runNotify(_queue[0]);
                }
				else {
                    _runSound(_queue[0]);
                }
			}
		}
        
        function _startBananaRain() {
            var audio = new Audio('http://swebliss.com/bababanana_ZJs7u4Sp.mp3'),
                image = new Image();

            audio.onended = function() {
                _raining = false;
            };

            image.src = 'http://webbgata.se/assets/images/BananaPic2.png';
            
            audio.play();
            _raining = true;
            _rain = [];
            _bananainterval = setInterval(_bananaDraw, 36);
            for (var i = 0; i < 50; i++) {
                _rain.push({
                    image: image,
                    x: Math.random() * (0, _canvas.width),
                    y: Math.random() * (0, 5),
                    rotation: 0,
                    speed: 3 + Math.random() * 5,
                });
            }
        }
        
        function _bananaDraw() {
            var remove = [];

            _ctx.clearRect(0, 0, _ctx.canvas.width, _ctx.canvas.height);
            
            if (_rain.length > 0) {
                for (var i = 0; i < _rain.length; i++) {
                    _ctx.save();
                    _ctx.translate(_rain[i].x, _rain[i].y);
                    _ctx.rotate(_rain[i].rotation * Math.PI / 180);
                    
                    _ctx.drawImage (_rain[i].image, -_rain[i].image.width/2, -_rain[i].image.width/2);
                    _rain[i].rotation += _rain[i].speed;
                    _rain[i].y += _rain[i].speed;
                    // _rain[i].x += Math.random() * (-5, 5);
                    if (_rain[i].y > _canvas.height && _raining) {  
                        _rain[i].y = - 25 
                        _rain[i].x = Math.random() * (0, _canvas.width);  
                    }
                    else if (_rain[i].y > _canvas.height && !_raining) {
                        remove.push(i);
                    }
                    _ctx.restore();
                }
                
                if (remove.length > 0) {
                    $.each(remove, function(position) {
                        _rain.splice(position, 1);
                    });
                }
            }
            else {
                clearInterval(_bananainterval);
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
        
        function _runSound(data) {
            var audio = new Audio(data.source);
            
            audio.onended = function() {
                _startQueue(true);
            }
            
            setTimeout(function() {
                audio.play();
            }, data.delay);
        }
		
        function _received(data) {
			if (_queue.indexOf(data) < 0) {
				_queue.push(data);
			}
        }
        
        function _startAudio(data) {
		    _queue.push(data);
        };
		
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
            _socket.on('audio', _startAudio);
            _socket.on('bababanana', _startBananaRain);
            _socket.on('refresh', function() {
                location.reload();
            });
		}
		
		return {
			init: init
		};
		
	}());
}(this, this.jQuery, this.io));