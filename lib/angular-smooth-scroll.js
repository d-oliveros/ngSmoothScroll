/*!
 *	 Angular Smooth Scroll (ngSmoothScroll)
 *	 Animates scrolling to elements, by David Oliveros.
 *
 *   Callback hooks contributed by Ben Armston https://github.com/benarmston
 *	 Easing support contributed by Willem Liu. https://github.com/willemliu
 *	 Easing functions forked from Gaëtan Renaudeau. https://gist.github.com/gre/1650294
 *	 Infinite loop bugs in iOS and Chrome (when zoomed) by Alex Guzman. https://github.com/alexguzman
 *	 Support for scrolling in custom containers by Joseph Matthias Goh. https://github.com/zephinzer
 *	 Influenced by Chris Ferdinandi
 *	 https://github.com/cferdinandi
 *
 *	 Version: 2.0.0
 * 	 License: MIT
 */

(function () {
	'use strict';

	var module = angular.module('smoothScroll', []);


	/**
	 * Smooth scrolls the window/div to the provided element.
	 *
	 * 20150713 EDIT - zephinzer
	 * 	Added new option - containerId to account for scrolling within a DIV
	 */
	var smoothScroll = function (element, options) {
		options = options || {};

		// Options
		var duration = options.duration || 800,
			offset = options.offset || 0,
			easing = options.easing || 'easeInOutQuart',
			callbackBefore = options.callbackBefore || function() {},
			callbackAfter = options.callbackAfter || function() {},
			container = document.getElementById(options.containerId) || null,
			containerPresent = (container != undefined && container != null);

		/**
		 * Retrieve current location
		 */
		var getScrollLocation = function() {
			if(containerPresent) {
				return container.scrollTop;
			} else {
				if(window.pageYOffset) {
					return window.pageYOffset;
				} else {
					return document.documentElement.scrollTop;
				}
			}
		};

		/**
		 * Calculate easing pattern.
		 *
		 * 20150713 edit - zephinzer
		 * - changed if-else to switch
		 * @see http://archive.oreilly.com/pub/a/server-administration/excerpts/even-faster-websites/writing-efficient-javascript.html
		 */
		var getEasingPattern = function(type, time) {
			switch(type) {
				case 'easeInQuad': 		return time * time; // accelerating from zero velocity
				case 'easeOutQuad': 	return time * (2 - time); // decelerating to zero velocity
				case 'easeInOutQuad': 	return time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
				case 'easeInCubic': 	return time * time * time; // accelerating from zero velocity
				case 'easeOutCubic': 	return (--time) * time * time + 1; // decelerating to zero velocity
				case 'easeInOutCubic': 	return time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
				case 'easeInQuart': 	return time * time * time * time; // accelerating from zero velocity
				case 'easeOutQuart': 	return 1 - (--time) * time * time * time; // decelerating to zero velocity
				case 'easeInOutQuart': 	return time < 0.5 ? 8 * time * time * time * time : 1 - 8 * (--time) * time * time * time; // acceleration until halfway, then deceleration
				case 'easeInQuint': 	return time * time * time * time * time; // accelerating from zero velocity
				case 'easeOutQuint': 	return 1 + (--time) * time * time * time * time; // decelerating to zero velocity
				case 'easeInOutQuint': 	return time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * (--time) * time * time * time * time; // acceleration until halfway, then deceleration
				default:				return time;
			}
		};

		/**
		 * Calculate how far to scroll
		 */
		var getEndLocation = function(element) {
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

		// Initialize the whole thing
		setTimeout( function() {
			var currentLocation = null,
				startLocation 	= getScrollLocation(),
				endLocation 	= getEndLocation(element),
				timeLapsed 		= 0,
				distance 		= endLocation - startLocation,
				percentage,
				position,
				scrollHeight,
				internalHeight;

			/**
			 * Stop the scrolling animation when the anchor is reached (or at the top/bottom of the page)
			 */
			var stopAnimation = function () {
				currentLocation = getScrollLocation();
				if(containerPresent) {
					scrollHeight = container.scrollHeight;
					internalHeight = container.clientHeight + currentLocation;
				} else {
					scrollHeight = document.body.scrollheight;
					internalHeight = window.innerHeight + currentLocation;
				}

				if (
					( // condition 1
						position == endLocation
					) ||
					( // condition 2
						currentLocation == endLocation
					) ||
					( // condition 3
						internalHeight >= scrollHeight
					)
				) { // stop
					clearInterval(runAnimation);
					callbackAfter(element);
				}
			};

			/**
			 * Scroll the page by an increment, and check if it's time to stop
			 */
			var animateScroll = function () {
				timeLapsed += 16;
				percentage = ( timeLapsed / duration );
				percentage = ( percentage > 1 ) ? 1 : percentage;
				position = startLocation + ( distance * getEasingPattern(easing, percentage) );
				if(containerPresent) {
					container.scrollTop = position;
				} else {
					window.scrollTo( 0, position );
				}
				stopAnimation();
			};

			callbackBefore(element);
			var runAnimation = setInterval(animateScroll, 16);
		}, 0);
	};


	// Expose the library in a factory
	//
	module.factory('smoothScroll', function() {
		return smoothScroll;
	});


	/**
	 * Scrolls the window to this element, optionally validating an expression
	 *
	 * 20150713 EDIT - zephinzer
	 * 	Added containerId to attributes for smooth scrolling within a DIV
	 */
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

						smoothScroll($elem[0], {
							duration: $attrs.duration,
							offset: $attrs.offset,
							easing: $attrs.easing,
							callbackBefore: callbackBefore,
							callbackAfter: callbackAfter,
							containerId: $attrs.containerId
						});
					}, 0);
				}
			}
		};
	}]);


	/**
	 * Scrolls to a specified element ID when this element is clicked
	 *
	 * 20150713 EDIT - zephinzer
	 * 	Added containerId to attributes for smooth scrolling within a DIV
	 */
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

					smoothScroll(targetElement, {
						duration: $attrs.duration,
						offset: $attrs.offset,
						easing: $attrs.easing,
						callbackBefore: callbackBefore,
						callbackAfter: callbackAfter,
						containerId: $attrs.containerId
					});

					return false;
				});
			}
		};
	}]);

}());