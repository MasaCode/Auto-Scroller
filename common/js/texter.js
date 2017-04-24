/**
 * Created by MasaCode on 2017-04-22.
 */

'use strict';

function Texter(options) {
    this.initialize(options);
    return this;
}

Texter.prototype = {
    elements: null,
    elementLength: 0,
    texts: [],
    currentIndex: -1,
    updateId : -1,
    startedAt: 0,
    change: 0,
    interval: 100,
    func: 'typewriter',
    callback: null,
    delay: 2000,
    autoStart: false,
    useRandomInterval: false,
    intervalRnage: 20,

    initialize: function (options) {
        var _self = this;
        if (!options.selector) {
            console.log(new Error('Invalid selector....'));
        }
        this.elements = document.querySelectorAll(options.selector);
        this.elementLength = this.elements.length;
        if (this.elementLength === 0) {
            console.log(new Error('Invalid selector....'));
        }

        if (typeof options.interval === 'number') this.interval = options.interval;
        if (typeof options.func === 'string' && typeof this[options.func.toLowerCase()] === 'function') this.func = options.func.toLowerCase();
        if (typeof  options.delay === 'number') this.delay = options.delay;
        this.useRandomInterval = (options.useRandomInterval === true);
        this.autoStart = (options.autoStart === true);
        this.intervalRnage = (typeof options.intervalRnage === 'number') ? options.intervalRnage : this.intervalRnage;

        for (var i = 0; i < this.elementLength; i++) {
            var text = this.elements[i].innerText.trim();
            var length = text.length;
            this.texts.push({text: text, length: length});
        }

        if (this.autoStart) setTimeout(function() {
            _self.start(_self.elements[0], 0, 0, 0, null);
            _self.update();
        }, this.delay);
    },

    start: function (target, index, distance, change, callback) {
        this.currentIndex = index;
        this.startedAt = 0;
        this.initializeText();
        this.callback = callback;
    },

    finish: function () {
        this.elements[this.currentIndex].innerText = this.texts[this.currentIndex].text;
        this.elements[this.currentIndex].style.opacity = 1.0;
        this.currentIndex = -1;
        this.change = 0;
        clearTimeout(this.updateId);
        this.updateId = -1;
    },

    update: function () {
        this.startedAt += this.change;

        this[this.func](this.startedAt);

        if (this.startedAt >= 1.0) {
            this.finish();
            if (this.callback) this.callback();
        } else {
            var interval = (this.useRandomInterval) ? this.interval + Math.random() * this.intervalRnage: this.interval;
            this.updateId = window.setTimeout(this.update.bind(this), interval);
        }
    },

    initializeText: function () {
        switch (this.func){
            case 'typewriter':
            case 'rundomwriter':
                this.change =  1.0 / this.texts[this.currentIndex].length;
                this.elements[this.currentIndex].innerText = '';
                break;
            case 'fadein':
                this.elements[this.currentIndex].style.opacity = 0.0;
                this.change = 1.0 / this.interval;
                break;
            default:
                break;
        }
    },

    typewriter: function (playback) {
        var showTextLength = Math.round(this.texts[this.currentIndex].length * playback);
        showTextLength = (showTextLength >= this.texts[this.currentIndex].length) ? this.texts[this.currentIndex].length : showTextLength;
        var underbar = (playback >= 1.0) ? '' : '_';
        this.elements[this.currentIndex].innerText = this.texts[this.currentIndex].text.substr(0, showTextLength) + underbar;
    },

    rundomwriter: function (playback) {
        playback = playback + (Math.random() * 2 - 1) * this.change;
        this.typewriter(playback);
    },

    fadein: function (playback) {
        this.elements[this.currentIndex].style.opacity = playback;
    },
};