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


	// Smooth scrolls the window to the provided element.
	//
	var smoothScroll = function (element, options) {
		options = options || {};

		// Options
		var duration = options.duration || 800,
			offset = options.offset || 0,
			easing = options.easing || 'easeInOutQuart',
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
				if ( position == endLocation || currentLocation == endLocation || ( (window.innerHeight + currentLocation) >= document.body.scrollHeight ) ) {
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


	// Expose the library in a factory
	//
	module.factory('smoothScroll', function() {
		return smoothScroll;
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

						smoothScroll($elem[0], {
							duration: $attrs.duration,
							offset: $attrs.offset,
							easing: $attrs.easing,
							callbackBefore: callbackBefore,
							callbackAfter: callbackAfter
						});
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

					smoothScroll(targetElement, {
						duration: $attrs.duration,
						offset: $attrs.offset,
						easing: $attrs.easing,
						callbackBefore: callbackBefore,
						callbackAfter: callbackAfter
					});

					return false;
				});
			}
		};
	}]);

}());