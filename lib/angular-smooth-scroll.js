/* =============================================================
/*
/*	 Angular Smooth Scroll 1.7.1
/*	 Animates scrolling to elements, by David Oliveros.
/*
/*   Callback hooks contributed by Ben Armston
/*   https://github.com/benarmston
/*
/*	 Easing support contributed by Willem Liu.
/*	 https://github.com/willemliu
/*
/*	 Easing functions forked from Gaëtan Renaudeau.
/*	 https://gist.github.com/gre/1650294
/*
/*	 Infinite loop bugs in iOS and Chrome (when zoomed) by Alex Guzman.
/*	 https://github.com/alexguzman
/*
/*	 Influenced by Chris Ferdinandi
/*	 https://github.com/cferdinandi
/*
/*
/*	 Free to use under the MIT License.
/*
/* ============================================================= */

(function () {
	'use strict';

	var module = angular.module('smoothScroll', []);

	var resolveOffset = function(offset, element, options) {
		if (typeof offset == 'function')
			offset = offset(element, options);

		if (angular.isElement(offset)) {
			var offsetEl = angular.element(offset)[0];

			if (typeof offset != 'undefined')
				offset = offsetEl.offsetHeight;
		}

		return offset;
	}

  // Global indicator which lets the directive know when the user is
  // interrupting the smoothScroll.
  // @type {boolean}
  var userInterrupting = false;

	// Smooth scrolls the window to the provided element.
	//
	var smoothScroll = function (element, options) {
		options = options || {};
		userInterrupting = false; // Start out with no interruptions.

		// Options
		var duration = options.duration || 800,
			offset = resolveOffset(options.offset || 0, element, options),
			easing = options.easing || 'easeInOutQuart',
			stopForInterruptions = options.stopForInterruptions,
			callbackBefore = options.callbackBefore || function() {},
			callbackAfter = options.callbackAfter || function() {};
			
		var getScrollLocation = function() {
			return window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop;
		};

		setTimeout( function() {
			var startLocation = getScrollLocation(),
				timeLapsed = 0,
				percentage, position;

			// Calculate the easing pattern
			var easingPattern = function (type, time) {
				if ( type == 'easeInQuad' ) return time * time; // accelerating from zero velocity
				if ( type == 'easeOutQuad' ) return time * (2 - time); // decelerating to zero velocity
				if ( type == 'easeInOutQuad' ) return time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
				if ( type == 'easeInCubic' ) return time * time * time; // accelerating from zero velocity
				if ( type == 'easeOutCubic' ) return (--time) * time * time + 1; // decelerating to zero velocity
				if ( type == 'easeInOutCubic' ) return time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
				if ( type == 'easeInQuart' ) return time * time * time * time; // accelerating from zero velocity
				if ( type == 'easeOutQuart' ) return 1 - (--time) * time * time * time; // decelerating to zero velocity
				if ( type == 'easeInOutQuart' ) return time < 0.5 ? 8 * time * time * time * time : 1 - 8 * (--time) * time * time * time; // acceleration until halfway, then deceleration
				if ( type == 'easeInQuint' ) return time * time * time * time * time; // accelerating from zero velocity
				if ( type == 'easeOutQuint' ) return 1 + (--time) * time * time * time * time; // decelerating to zero velocity
				if ( type == 'easeInOutQuint' ) return time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * (--time) * time * time * time * time; // acceleration until halfway, then deceleration
				return time; // no easing, no acceleration
			};


			// Calculate how far to scroll
			var getEndLocation = function (element) {
				var location = 0;
				if (element.offsetParent) {
					do {
						location += element.offsetTop;
						element = element.offsetParent;
					} while (element);
				}
				location = Math.max(location - offset, 0);
				return location;
			};

			var endLocation = getEndLocation(element);
			var distance = endLocation - startLocation;


			// Stop the scrolling animation when the anchor is reached (or at the top/bottom of the page)
			var stopAnimation = function () {
				var currentLocation = getScrollLocation();
				if ( (stopForInterruptions && userInterrupting) || position == endLocation || currentLocation == endLocation || ( (window.innerHeight + currentLocation) >= document.body.scrollHeight ) ) {
					clearInterval(runAnimation);
					callbackAfter(element);
				}
			};


			// Scroll the page by an increment, and check if it's time to stop
			var animateScroll = function () {
				timeLapsed += 16;
				percentage = ( timeLapsed / duration );
				percentage = ( percentage > 1 ) ? 1 : percentage;
				position = startLocation + ( distance * easingPattern(easing, percentage) );
				window.scrollTo( 0, position );
				stopAnimation();
			};


			// Init
			callbackBefore(element);
			var runAnimation = setInterval(animateScroll, 16);
		}, 0);
	};

	// Expose the library via a provider to allow default options to be overridden
	//
	module.provider('smoothScroll', function() {
		
		function noop() {}
		var defaultOptions = {
			duration: 800,
			offset: 0,
			easing: 'easeInOutQuart',
			stopForInterruptions: false,
			callbackBefore: noop,
			callbackAfter: noop
		};

		var interruptionHandler = function() {
			userInterrupting = true;
		};

		window.addEventListener("mousewheel", interruptionHandler, false);
		window.addEventListener("DOMMouseScroll", interruptionHandler, false);
		window.addEventListener("onmousewheel", interruptionHandler, false);

		return {
			$get: function() {
				return function(element, options) {
					smoothScroll(element, angular.extend({}, defaultOptions, options));
				}
			},
			setDefaultOptions: function(options) {
				angular.extend(defaultOptions, options);
			}
		}
	});
	

	// Scrolls the window to this element, optionally validating an expression
	//
	module.directive('smoothScroll', ['smoothScroll', function(smoothScroll) {
		return {
			restrict: 'A',
			scope: {
				callbackBefore: '&',
				callbackAfter: '&',
			},
			link: function($scope, $elem, $attrs) {
				if ( typeof $attrs.scrollIf === 'undefined' || $attrs.scrollIf === 'true' ) {
					setTimeout( function() {

						var callbackBefore = function(element) {
							if ( $attrs.callbackBefore ) {
								var exprHandler = $scope.callbackBefore({ element: element });
								if (typeof exprHandler === 'function') {
									exprHandler(element);
								}
							}
						};

						var callbackAfter = function(element) {
							if ( $attrs.callbackAfter ) {
								var exprHandler = $scope.callbackAfter({ element: element });
								if (typeof exprHandler === 'function') {
									exprHandler(element);
								}
							}
						};

						var options = {
							callbackBefore: callbackBefore,
							callbackAfter: callbackAfter
						};

						if (typeof $attrs.duration != 'undefined')
							options.duration = $attrs.duration;

						if (typeof $attrs.offset != 'undefined')
							options.offset = $attrs.offset;

						if (typeof $attrs.easing != 'undefined')
							options.easing = $attrs.easing;

						if (typeof $attrs.stopForInterruptions != 'undefined')
							options.stopForInterruptions = true;

						smoothScroll($elem[0], options);
					}, 0);
				}
			}
		};
	}]);


	// Scrolls to a specified element ID when this element is clicked
	//
	module.directive('scrollTo', ['smoothScroll', function(smoothScroll) {
		return {
			restrict: 'A',
			scope: {
				callbackBefore: '&',
				callbackAfter: '&',
			},
			link: function($scope, $elem, $attrs) {
				var targetElement;
				
				$elem.on('click', function(e) {
					e.preventDefault();

					targetElement = document.getElementById($attrs.scrollTo);
					if ( !targetElement ) return; 
					
					var callbackBefore = function(element) {
						if ( $attrs.callbackBefore ) {
							var exprHandler = $scope.callbackBefore({element: element});
							if (typeof exprHandler === 'function') {
								exprHandler(element);
							}
						}
					};

					var callbackAfter = function(element) {
						if ( $attrs.callbackAfter ) {
							var exprHandler = $scope.callbackAfter({element: element});
							if (typeof exprHandler === 'function') {
								exprHandler(element);
							}
						}
					};
					
					var options = {
						callbackBefore: callbackBefore,
						callbackAfter: callbackAfter
					};

					if (typeof $attrs.duration != 'undefined')
						options.duration = $attrs.duration;

					if (typeof $attrs.offset != 'undefined')
						options.offset = $attrs.offset;

					if (typeof $attrs.easing != 'undefined')
						options.easing = $attrs.easing;

						if (typeof $attrs.stopForInterruptions != 'undefined')
							options.stopForInterruptions = true;

					smoothScroll(targetElement, options);

					return false;
				});
			}
		};
	}]);

}());
