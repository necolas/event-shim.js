# event-shim.js

A W3C DOM Event API shim for IE 8 (as far as possible).

## Installation

Install with [Bower](http://bower.io/):

```
bower install --save event-shim.js
```

## API

Provides the following properties and methods for IE 8.

### Event interface

Properties

* `bubbles`
* `defaultPrevented`
* `relatedTarget`
* `target`

Methods

* `preventDefault()`
* `stopPropagation()`

### EventTarget interface

The following methods are added to `Element`, `HTMLDocument`, and `window`.

* `addEventListener()`
* `removeEventListener()`

## Testing

Install [Node](http://nodejs.org) (comes with npm).

From the repo root, install the project's development dependencies:

```
npm install
```

Testing relies on the Karma test-runner. If you'd like to use Karma to
automatically watch and re-run the test file during development, it's easiest
to globally install Karma and run it from the CLI.

```
npm install -g karma
karma start
```

## Acknowledgements

Inspired by [eventShim](https://github.com/jwmcpeak/EventShim)
