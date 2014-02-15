Angular Smooth Scroll
==============

A pure-javascript library and set of directives to scroll smoothly to an element with easing. No jQuery required.

# Features

  * Exposes a service that scrolls the window to an element's location
  * Provides two directives that enable smooth scrolling to elements.
  * Clean: No classes are added, no jQuery is required, no CSS files or configuration is needed.


# Installation

Include the .js file in your page then enable usage of the directive by including the "smoothScroll" module
as a dependency


# Usage - As a directive

This module provides three directives:

####smoothScroll:

Attribute. Scrolls the window to this element, optionally validating the expression inside scroll-if.

Example:
```js

// Basic
//
<div smooth-scroll></div> // The window will scroll to this element's position when compiling this directive


// With options
//
<div smooth-scroll duration="800" easing="easeInQuint" offset="120">{{...}}</div>


// With condition
//
<div smooth-scroll scroll-if="{{ myExpression }}">{{...}}</div>


// Inside ng-repeat
//
<div smooth-scroll scroll-if="{{ $last }}" duration="2500">{{...}}</div>
```


####scrollTo:

Attribute. Scrolls the window to the specified element ID when clicking this element.

Example:
```js

// Basic
//
<a href="#" scroll-to="my-element-3">Click me!</a>


// With options
//
<button scroll-to="elem-id5" duration="1800">Scroll to next page.</button>


// With options
//
<div smooth-scroll duration="800" easing="easeInQuint" offset="120">{{...}}</div>


// With condition
//
<div smooth-scroll scroll-if="{{ myExpression }}">{{...}}</div>


// Inside ng-repeat
//
<div smooth-scroll scroll-if="{{ $last }}" duration="2500">{{...}}</div>
```


# Usage - As a library

Inject the 'smoothScroll' service in your directive / factory / controller / whatever, and call like this:

```js

// Using defaults
//
var element = document.getElementById('my-elem');
smoothScroll(element);


// With options
//
var element = $elem[0];

var options = {
	duration: 700,
	easing: 'easeInQuad',
	offset: 120
}

smoothScroll(element, options);


// In directive's link function
//
link: function($scope, $elem, $attrs){
	var options = $attrs;

	smoothScroll($elem[0], options);
}


```

### Options

#### duration
Type: `Integer`
Default: `0`

The duration of the smooth scroll, in miliseconds.

#### offset
Type: `Integer`
Default: `0`

The offset from the top of the page in which the scroll should stop.

#### easing
Type: `String`
Default: `easeInOutQuart`

The easing function to be used for this scroll.

### Easing functions

The available easing functions are:
 * 'easeInQuad'
 * 'easeOutQuad'
 * 'easeInOutQuad'
 * 'easeInCubic'
 * 'easeOutCubic'
 * 'easeInOutCubic'
 * 'easeInQuart'
 * 'easeOutQuart'
 * 'easeInOutQuart'
 * 'easeInQuint'
 * 'easeOutQuint'
 * 'easeInOutQuint'

#### Credits

Easing support contributed by Willem Liu.
https://github.com/willemliu

Easing functions forked from Gaëtan Renaudeau.
https://gist.github.com/gre/1650294

Infinite loop bugs in iOS and Chrome (when zoomed) by Alex Guzman.
https://github.com/alexguzman

Influenced by Chris Ferdinandi
https://github.com/cferdinandi

Free to use under the MIT License.


Cheers.