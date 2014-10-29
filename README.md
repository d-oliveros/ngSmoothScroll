Angular smooth scroll
==============

A pure-javascript library and set of directives to scroll smoothly to an element with easing. Easing support contributed by Willem Liu with code from Gaëtan Renaudeau.

No jQuery required.

# Features

  * Exposes a service that scrolls the window to an element's location
  * Provides two directives that enable smooth scrolling to elements.
  * Clean: No classes are added, no jQuery is required, no CSS files or configuration is needed.


# Installation

Include the .js file in your page then enable usage of the directive by including the "smoothScroll" module
as a dependency


# Bower

Install with bower with:

```bash
bower install ngSmoothScroll
```

# Usage - As a directive

This module provides two directives:

####smoothScroll:

Attribute. Scrolls the window to this element, optionally validating the expression inside scroll-if.

Example:
```html

// Basic - The window will scroll to this element's position when compiling this directive
<div smooth-scroll></div>


// With options
<div smooth-scroll duration="800" easing="easeInQuint" offset="120" callback-before="aFunction(element)" callback-after="anotherFunction">{{...}}</div>


// With condition
<div smooth-scroll scroll-if="{{ myExpression }}">{{...}}</div>


// Inside ng-repeat
<div smooth-scroll scroll-if="{{ $last }}" duration="2500">{{...}}</div>
```


####scrollTo:

Attribute. Scrolls the window to the specified element ID when clicking this element.

Example:
```html

// Basic
<a href="#" scroll-to="my-element-3">Click me!</a>


// With options
<button scroll-to="elem-id5" duration="1800" callback-before="aFunction(element)" callback-after="anotherFunction">Scroll to next page.</button>
```


# Usage - As a service

Inject the 'smoothScroll' service in your directive / factory / controller / whatever, and call like this:

```js

// Using defaults
var element = document.getElementById('my-elem');
smoothScroll(element);


// With options
var element = $elem[0];

var options = {
	duration: 700,
	easing: 'easeInQuad',
	offset: 120,
	callbackBefore: function(element) {
		console.log('about to scroll to element', element);
	},
	callbackAfter: function(element) {
		console.log('scrolled to element', element);
	}
}

smoothScroll(element, options);


// In directive's link function
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
Default: `800`

The offset from the top of the page in which the scroll should stop.

#### easing
type: `string`
default: `easeInOutQuart`

the easing function to be used for this scroll.

#### callbackBefore
type: `function`
default: `function(element) {}`

a callback function to run before the scroll has started. It is passed the
element that will be scrolled to.

#### callbackAfter
type: `function`
default: `function(element) {}`

a callback function to run after the scroll has completed. It is passed the
element that was scrolled to.

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

Callback hooks contributed by Ben Armston.
https://github.com/benarmston

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
