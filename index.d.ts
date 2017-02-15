// Type definitions for ngSmoothScroll 1.7.3
// Project: https://github.com/d-oliveros/ngSmoothScroll
// Definitions by: James Harris <https://github.com/jimmythecoder>

declare namespace ngSmoothScroll {

	interface IService {
		(element: Element, options?: IOptions): void;
	}

	type easingType = 'easeInQuad'|'easeOutQuad'|'easeInOutQuad'|'easeInCubic'|'easeOutCubic'|'easeInOutCubic'|'easeInQuart'|'easeOutQuart'|'easeInOutQuart'|'easeInQuint'|'easeOutQuint'|'easeInOutQuint';

	interface IOptions {
		duration?: number,
	    offset?: number;
	   	easing?: easingType;
	    callbackBefore?:(element: HTMLElement) => void;
	    callbackAfter?: (element: HTMLElement) => void;
	    containerId?: string;
	}
}