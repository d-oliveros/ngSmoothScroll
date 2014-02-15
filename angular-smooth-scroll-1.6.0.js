/* =============================================================
/*
/*	 Angular Smooth Scroll 1.6.0
/*	 Animate scrolling to a provided element, by David Oliveros.
/*
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
/*	 Free to use under the MIT License.
/*
/* * ============================================================= */

angular.module('smoothScroll', [])


// Scrolls the window to this element, optionally validating an expression
//
.directive('smoothScroll', ['smoothScroll', function(smoothScroll){
	return {
		restrict: 'A',
		scope: {
			doScroll: '@scrollIf',
		},
		link: function($scope, $elem, $attrs){
			if ( typeof $scope.doScroll === 'undefined' || $scope.doScroll === 'true' ){
				smoothScroll($elem[0], $attrs);
			}
		}
	};
}])


// Scrolls to a specified element ID when this element is clicked
//
.directive('scrollTo', ['smoothScroll', function(smoothScroll){
	return {
		restrict: 'A',
		link: function($scope, $elem, $attrs){
			var targetElement;
			
			$elem.on('click', function(e){
				targetElement = document.getElementById($attrs.scrollTo);
				
				if ( targetElement ) {
					e.preventDefault();
					smoothScroll(targetElement, $attrs);
					return false;
				}
			
			});
		}
	};
}])


// Smooth scrolls the window to the provided element.
//
.service('smoothScroll', ['$timeout', function($timeout){
	var smoothScroll, startLocation, timeLapsed, 
		percentage, duration, offset, easing, 
		easingPattern, getEndLocation, stopAnimation, 
		percentage, position, animateScroll, runAnimation;

	// Run the smooth scroll animation
	//
	smoothScroll = function (element, options) {
		$timeout(function(){
			startLocation = window.pageYOffset;
			timeLapsed = 0;


			// Options
			//
			options = options || {};
			duration = options.duration || 800;
			options.offset || 0;
			easing = options.easing || 'easeInOutQuart';
			

			// Calculate the easing pattern
			//
			easingPattern = function (type, time) {
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
			//
			getEndLocation = function (element) {
				location = 0;
				if (element.offsetParent) {
					do {
						location += element.offsetTop;
						element = element.offsetParent;
					} while (element);
				}
				location = Math.max(location - offset, 0);
				return location;
			};
			endLocation = getEndLocation(element);
			distance = endLocation - startLocation;


			// Stop the scrolling animation
			//
			stopAnimation = function () {
				currentLocation = window.pageYOffset;
				if ( position == endLocation || currentLocation == endLocation || ( (window.innerHeight + currentLocation) >= document.body.scrollHeight ) ) {
					clearInterval(runAnimation);
				}
			};


			// Scroll the page by an increment, and check if it's time to stop
			//
			animateScroll = function () {
				timeLapsed += 16;
				percentage = ( timeLapsed / duration );
				percentage = ( percentage > 1 ) ? 1 : percentage;
				position = startLocation + ( distance * easingPattern(easing, percentage) );
				window.scrollTo( 0, position );
				stopAnimation();
			};


			// Init
			//
			runAnimation = setInterval(animateScroll, 16);
		});
	};

	return smoothScroll;
}]);