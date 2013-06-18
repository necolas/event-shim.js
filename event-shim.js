/*! event-shim.js v0.1.0 - Nicolas Gallagher - MIT license */

(function () {
    'use strict';

    // exit if the event shim is not needed
    if (Element.prototype.addEventListener && Element.prototype.removeEventListener) {
        return;
    }

    // exit if the remaining browsers don't support `Object.defineProperty`
    if (!Object.defineProperty) {
        return;
    }

    // the Event object's prototype
    var eventProto = window.Event.prototype;


    // Event Object shim
    // ---------------------------------------------------------------------


    /**
     * Prevents the default event from firing
     */

    eventProto.preventDefault = function () {
        this.returnValue = false;
    };

    /**
     * Prevents further propagation of the current event
     */

    eventProto.stopPropagation = function () {
        this.cancelBubble = true;
    };

    /**
     * Indicates whether an event propagates up from the target
     * @returns Boolean
     */

    Object.defineProperty(eventProto, 'bubbles', {
        get: function () {
            // DOM3 events supported by IE 8
            var bubbleEvents = [
                'select', 'scroll', 'click', 'dblclick',
                'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'wheel', 'textinput',
                'keydown', 'keypress', 'keyup'
            ];
            var len = bubbleEvents.length;
            var type = this.type;
            var i;

            for (i = 0; i < len; i++) {
                if (type === bubbleEvents[i]) {
                    return true;
                }
            }

            return false;
        }
    });

    /**
     * Indicates if preventDefault() was called on the event
     * @returns Boolean
     */

    Object.defineProperty(eventProto, 'defaultPrevented', {
        get: function () {
            var returnValue = this.returnValue;

            if (returnValue === false) {
                return true;
            }

            return false;
        }
    });

    /**
     * Returns the secondary target of a mouseover/mouseout event
     * @returns {EventTarget|Null}
     */

    Object.defineProperty(eventProto, 'relatedTarget', {
        get: function () {
            var type = this.type;

            if (type === 'mouseover' || type === 'mouseout') {
                return (type === 'mouseover') ? this.fromElement : this.toElement;
            }

            return null;
        }
    });

    /**
     * Returns the event target
     * @returns {EventTarget}
     */

    Object.defineProperty(eventProto, 'target', {
        get: function () {
            return this.srcElement;
        }
    });


    // Event Listener shim
    // ---------------------------------------------------------------------


    var eventListeners = [];

    /**
     * Add an event listener
     * Since this is for IE 8, `useCapture` is not supported.
     *
     * @param {String} type
     * @param {Function} listener
     */

    var addEventListenerFn = function (type, listener) {
        var thisArg = this;
        var evt;
        var wrapper;
        var domWrapper;

        if (!listener) return;

        wrapper = function (e) {
            e.currentTarget = thisArg;
            if (listener.handleEvent) {
                listener.handleEvent(e);
            } else {
                listener.call(thisArg, e);
            }
        };

        // the 'DOMContentLoaded' event is a special case as IE doesn't have a
        // direct equivalent
        if (type === 'DOMContentLoaded') {
            // additional wrapper checks if the DOM is ready before calling the
            // wrapped callback
            domWrapper = function (e) {
                if (document.readyState === 'complete') {
                    wrapper(e);
                }
            };

            document.attachEvent('onreadystatechange', domWrapper);

            eventListeners.push({
                object: this,
                type: type,
                listener: listener,
                wrapper: domWrapper
            });

            // if the DOM is already ready, call the wrapped callback directly
            if (document.readyState === 'complete') {
                evt = document.createEventObject();
                wrapper(evt);
            }
        }
        else {
            this.attachEvent('on' + type, wrapper);

            eventListeners.push({
                object: this,
                type: type,
                listener: listener,
                wrapper: wrapper
            });
        }
    };

    /**
     * Remove an event listener
     * Since this is for IE 8, `useCapture` is not supported.
     *
     * @param {String} type
     * @param {Function} listener
     */

    var removeEventListenerFn = function (type, listener) {
        var i = 0;
        var len = eventListeners.length;
        var eventListener;

        while (i < len) {
            eventListener = eventListeners[i];

            if (eventListener.object === this && eventListener.type === type && eventListener.listener === listener) {
                if (type === 'DOMContentLoaded') {
                    this.detachEvent('onreadystatechange', eventListener.wrapper);
                }
                else {
                    this.detachEvent('on' + type, eventListener.wrapper);
                }
                break;
            }

            i += 1;
        }
    };

    /**
     * Apply the shim
     */

    Element.prototype.addEventListener = addEventListenerFn;
    Element.prototype.removeEventListener = removeEventListenerFn;

    HTMLDocument.prototype.addEventListener = addEventListenerFn;
    HTMLDocument.prototype.removeEventListener = removeEventListenerFn;

    Window.prototype.addEventListener = addEventListenerFn;
    Window.prototype.removeEventListener = removeEventListenerFn;
}());
