describe('IE 8 event shim', function () {
    'use strict';

    var bubbledEvents = [];
    var calls = [];
    var eventObj;
    var fixture;
    var targetElem;

    var targetHandler = function (e) {
        e.preventDefault();
        e.stopPropagation();
        calls.push('success');
        eventObj = e;
    };

    var docHandler = function (e) {
        bubbledEvents.push('bubbled');
    };

    /**
     * Setup
     */

    beforeEach(function () {
        // reset
        bubbledEvents = [];
        calls = [];
        eventObj = null;

        // create fixture
        fixture = document.createElement('div');
        fixture.id = 'fixture';
        fixture.innerHTML = '<input id="target" type="checkbox">';
        document.body.appendChild(fixture);

        // store reference to element
        targetElem = document.getElementById('target');
    });

    /**
     * Teardown
     */

    afterEach(function () {
        document.body.removeChild(fixture);
    });

    describe('.addEventListener(type, callback)', function () {
        beforeEach(function () {
            targetElem.addEventListener('click', targetHandler);
            document.addEventListener('click', docHandler);
        });

        afterEach(function () {
            targetElem.removeEventListener('click', targetHandler);
            document.removeEventListener('click', docHandler);
        });

        /**
         * Tests
         */

        it('fires the event handler', function () {
            targetElem.click();
            expect(calls).toEqual(['success']);
        });

        describe('the event object passed to the callback', function () {
            it('exposes the correct `target`', function () {
                targetElem.click();
                expect(eventObj.target).toBe(targetElem);
            });

            it('can prevent the default action: `e.preventDefault()`', function () {
                targetElem.click();
                expect(targetElem.checked).toBe(false);
            });

            it('can prevent further event propagation: `e.stopPropagation()`', function () {
                targetElem.click();
                expect(bubbledEvents).toEqual([]);
            });

            it('indicates whether an event bubbles: `e.bubbles`', function () {
                targetElem.click();
                expect(eventObj.bubbles).toBe(true);
            });

            it('indicates whether `preventDefault()` was called: `e.defaultPrevented`', function () {
                targetElem.click();
                expect(eventObj.defaultPrevented).toBe(true);
            });

            it('exposes the correct `e.relatedTarget`', function () {
            });
        });
    });

    describe('.removeEventListener(type, callback)', function () {
        it('removes the event handler', function () {
            targetElem.addEventListener('click', targetHandler);
            targetElem.removeEventListener('click', targetHandler);
            targetElem.click();
            expect(calls).toEqual([]);
        });
    });
});
