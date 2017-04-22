/**
 * Created by MasaCode on 2017-04-18
 */

'use strict';

function AutoScroller(options) {
    this.initializeAnimationFrame();
    this.initialize(options);
    return this;
}

AutoScroller.prototype = {
    selector: null,
    anchors: null,
    scrollDistance: 15,
    isScrolling: false,
    startedAt: 0,
    change: 0,
    targetAnchorIndex : -1,
    targetAnchor: null,
    targetTop: 0,
    animationFrameId: -1,
    clearTimerId: -1,
    direction : 0, /* Up : -1, Down 1 */
    screenHeight: 0,
    startedTopPosition: 0,
    actualDistance: 0,
    entryFunc: null,
    effectFunc: null,
    disableDuration: 450,
    callbackObject: null,
    useCallback: false,
    callTogether: false,
    noticeEnd: false,

    initialize: function (options) {
        if (typeof options === 'string') {
            this.selector = this.getClassName(options);
            this.anchors = document.querySelectorAll(options);
            this.effectFunc = 'autoscroll';
        } else {
            if (options.selector === undefined || options.selector === null) {
                console.log(new Error('Selector is undefined...'));
                return;
            }
            this.selector = this.getClassName(options.selector);
            this.anchors = document.querySelectorAll(options.selector);
            this.effectFunc = (typeof this[options.func.toLowerCase()] === 'function') ? options.func.toLowerCase() : 'autoscroll';
            this.scrollDistance = (typeof options.scrollDistance === 'number') ? options.scrollDistance : this.scrollDistance;
            this.disableDuration = (typeof  options.disableDuration === 'number') ? options.disableDuration : this.disableDuration;
        }

        if (options.callback) {
            this.callTogether = options.callback.callTogether;
            this.useCallback = true;
            this.callbackObject = options.callback.object;
            this.noticeEnd = options.callback.noticeEnd;
        }

        var anchorLength = this.anchors.length;
        if (anchorLength === 0) {
            console.log(new Error('No selected element is found...'));
            return;
        }

        this.entryFunc = this.startScroll.bind(this);

        for (var i = 0; i < anchorLength; i++) {
            this.registerEvent(i);
        }
    },

    initializeAnimationFrame: function () {
        window.requestAnimFrame = (function(){
            return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
        })();
    },

    startScroll: function (event) {
        event.preventDefault();
        if (this.isScrolling) return false;
        this.isScrolling = true;
        this.startedAt = 0;
        var canScroll = false;
        var delta = (event.wheelDeltaY || -event.deltaY);
        var anchorLength = this.anchors.length;
        this.direction = (delta > 0) ? -1 : 1;
        var target = (this.hasClass(event.srcElement, this.selector)) ? event.srcElement : this.findElement(event.srcElement);
        if (target) {
            for (var i = 0; i < anchorLength; i++) {
                if (target === this.anchors[i]) {
                    if ((i === 0 && this.direction === -1) || (i === (anchorLength - 1) && this.direction === 1)) {
                        canScroll = false;
                    } else {
                        this.targetAnchorIndex = i + this.direction;
                        this.targetAnchor = this.anchors[this.targetAnchorIndex];
                        canScroll = true;
                    }
                    break;
                }
            }
        } else {
            canScroll = false;
        }

        if (canScroll) {
            this.startedTopPosition = document.documentElement.scrollTop || document.body.scrollTop;
            this.actualDistance = this.calculateElementTop(this.targetAnchor);
            this.targetTop = this.startedTopPosition + this.actualDistance;
            this.change = Math.abs(this.scrollDistance / this.actualDistance);
            this.screenHeight = window.innerHeight;
            if (this.useCallback) this.callbackObject.start(this.targetAnchor, this.targetAnchorIndex, this.actualDistance, this.change, this.endScroll.bind(this));
            this.update();
            this.clearTimerId = setTimeout(this.endScroll.bind(this), 10000);
        } else {
            setTimeout(this.endScroll.bind(this), 100);
        }
    },

    endScroll: function () {
        this.isScrolling = false;
        window.cancelAnimationFrame(this.animationFrameId);
        clearTimeout(this.clearTimerId);
        this.clearTimerId = -1;
        this.animationFrameId = -1;
        this.targetAnchorIndex = -1;
        this.direction = 0;
        this.targetTop = 0;
        this.targetAnchor = null;
        this.startedAt =  0;
        this.change =  0;
        this.screenHeight = 0;
        this.startedTopPosition = 0;
        this.actualDistance = 0;
    },

    update: function () {
        if (this.screenHeight !== window.innerHeight) {
            this.screenHeight = window.innerHeight;
            this.actualDistance = this.calculateElementTop(this.targetAnchor);
            this.startedTopPosition = document.documentElement.scrollTop || document.body.scrollTop;
            this.targetTop = this.startedTopPosition + this.actualDistance;
            this.change = Math.abs(this.scrollDistance / this.actualDistance);
        }

        this.startedAt += this.change;
        this[this.effectFunc](this.startedAt);
        if (this.useCallback && this.callTogether) this.callbackObject.update(this.startedAt);

        if (this.startedAt >= 1.0) {
            if (this.useCallback){
                if (this.callTogether) {
                    this.callbackObject.finish();
                } else {
                    this.callbackObject.update();
                }
            }
            if (!this.noticeEnd) setTimeout(this.endScroll.bind(this), this.disableDuration);
        } else {
            this.animationFrameId = window.requestAnimationFrame(this.update.bind(this));
        }
    },

    resetAnchors: function (selector) {
        if (selector === undefined || selector === null) {
            console.log(new Error('Selector is undefined...'));
            return;
        }
        this.anchors = document.querySelectorAll(selector);
        var anchorLength = this.anchors.length;
        if (anchorLength === 0) {
            console.log(new Error('No selected element is found...'));
            return;
        }

        for (var i = 0; i < anchorLength; i++) {
            this.registerEvent(i);
        }
    },

    addAnchor: function (element, index) {
        if (index === undefined || index === null) {
            index = this.anchors.length;
            this.anchors.push(element);
        } else {
            this.anchors.splice(index, 0, element);
        }
        this.registerEvent(index);
    },
    
    registerEvent: function (index) {
        this.anchors[index].addEventListener("mousewheel", this.entryFunc, false);
        this.anchors[index].addEventListener("DOMMouseScroll", this.entryFunc, false);
    },

    registerCallback: function (callback) {
        this.callbackObject = callback.object;
        this.callTogether = callback.callTogether;
        this.noticeEnd = callback.noticeEnd;
        this.useCallback = true;
    },

    calculateElementTop: function (element) {
        var top = 0;
        while (element) {
            if (element.tagName == 'BODY') {
                var yScroll = element.scrollTop || document.documentElement.scrollTop;
                top += (element.offsetTop - yScroll + element.clientTop);
            } else {
                top += (element.offsetTop - element.scrollTop + element.clientTop);
            }
            element = element.offsetParent;
        }
        return top;
    },

    hasClass: function (element, searchClass) {
        return (" " + element.className + " " ).indexOf( " " + searchClass + " " ) > -1;
    },

    getClassName: function (selector) {
        var classes = selector.split('.');
        return classes.slice(1).join(' ');
    },

    findElement: function (childElement) {
        while (childElement) {
            if (this.hasClass(childElement, this.selector)) {
                return childElement;
            }
            childElement = childElement.parentElement;
        }
        return null;
    },

    autoscroll: function (playback) {
        var top = this.startedTopPosition + this.actualDistance * playback;
        if (this.direction === 1) {
            top = (top >= this.targetTop) ? this.targetTop : top;
        } else {
            top = (top <= this.targetTop) ? this.targetTop : top;
        }

        window.scrollTo(0, top);
    },

    easeoutquad: function (playback) {
        playback = playback * (2 - playback);
        this.autoscroll(playback);
    },

    easeinquad: function (playback) {
        playback = playback * playback;
        this.autoscroll(playback);
    },

    elastic: function (playback) {
        var x = 1.5;
        playback = Math.pow(2, 10 * (playback - 1)) * Math.cos(20 * Math.PI * x / 3 * playback);
        this.autoscroll(playback);
    },

    bounce: function (playback) {
        var bounce = 1.20;
        var turnpoint = 1.10;
        playback = playback * bounce * (2 - playback);
        if (playback > turnpoint) {
            playback = 1 - (bounce - playback);
        } else if (playback > 1.0) {
            playback -= (playback - 1) * 2;
        }
        this.autoscroll(playback);
    },

    backslidein: function (playback) {
        var x = 1.5;
        playback = Math.pow(playback, 2) * ((1 + x) * playback - x);
        this.autoscroll(playback);
    },
};

