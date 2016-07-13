;(function (window) {
    'use strict';

    function extend(a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    }


    function Carousel(options) {
        this.options = extend({}, this.options);
        extend(this.options, options);

        this.current = 0;
        this.block = false;
        this.triggered = false;

        this.container;
        this.items;
        this.prev = 0;
        this.next = 0;

        this._init();

        return this;

    }


    Carousel.prototype.options = {
        container: '',
        itemsSelector: '',
        inClass: '--in',
        outClass: '--out',
        nextClass: '--next',
        nextClassPositive: true,
        openClass: '--open',
        mousewheelScrolling: false,
        loop: 'forward' // or 'backward'
    };

    Carousel.prototype._init = function () {

        this.getItems();
        this.setTriggers(true);

        this.container.trigger("init", {
            slider: this,
            items: this.items,
            container: this.container,
            options: this.options
        });

        console.log(this);
    };

    Carousel.prototype.getItems = function () {
        this.container = $(this.options.container);
        this.items = this.container.find(this.options.itemsSelector);

        return this.items;
    };

    Carousel.prototype.setTriggers = function (triggered) {
        this.triggered = triggered;

        this.setMousewheel(triggered ? this.options.mousewheelScrolling : false);
    };

    Carousel.prototype.setMousewheel = function (triggered) {
        var self = this;

        if (triggered) {
            this.container.on('mousewheel', function (event) {
                event.preventDefault();
                console.log('wheel');
                !event.deltaY || event.deltaY < 0 ? self.goNext() : self.goPrev();
            });

        } else {
            this.container.off('mousewheel');
        }

    };

    Carousel.prototype.getEventData = function () {
        var data = {
            slider: this,
            prevItem: this.getPrevItem(),
            prevIndex: this.prev,
            currentItem: this.getCurrentItem(),
            currentIndex: this.current,
            nextItem: this.getNextItem(),
            nextIndex: this.next
        };

        return data;
    };

    Carousel.prototype.getPrevItem = function () {
        return "null" !== this.prev ? this.items.eq(this.prev) : null;
    };

    Carousel.prototype.getCurrentItem = function () {
        return this.items.eq(this.current);
    };

    Carousel.prototype.getNextItem = function () {
        return "null" !== this.next ? this.items.eq(this.next) : null;
    };

    Carousel.prototype.getNextIndex = function (index) {
        var target = this.current + 1;
        target >= this.items.length && (target = this.options.loop === false || "forward" !== this.options.loop ? false : index ? 1 : 0);
        return target;
    };

    Carousel.prototype.getPrevIndex = function (index) {
        var target = this.current - 1;
        0 > target && (target = index || this.options.loop !== false && "backward" === this.options.loop ? this.items.length - 1 : false);
        return target;
    };

    Carousel.prototype.goNext = function (index) {
        var targetIndex = this.getNextIndex(index);
        return targetIndex !== false ? this.goTo(targetIndex) : false;
    };

    Carousel.prototype.goPrev = function (index) {
        var targetIndex = this.getNextIndex(index);
        return targetIndex !== false ? this.goTo(targetIndex) : false;
    };

    Carousel.prototype.goTo = function (index, event) {
        var self = this;
        if (index === self.current || this.block) return false;

        self.prev = "null" != typeof self.current ? self.current : null;
        self.current = index;
        self.next = this.getNextIndex(self.options.nextClassPositive);
        self.animated = true;

        self.items
            .removeClass(self.options.outClass)
            .removeClass(self.options.inClass)
            .removeClass(self.options.nextClass);

        var pluginData = this.getEventData();

        return "number" == typeof pluginData.prevIndex && pluginData.prevItem.addClass(self.options.outClass),
            pluginData.currentItem.addClass(self.options.inClass),
        "number" == typeof pluginData.nextIndex && pluginData.nextItem.addClass(self.options.nextClass),
            this.container.trigger("slide", $.extend(true, pluginData, event)),
            true;
    };


    window.Carousel = Carousel;


})(window);

