;(function ( window ) {

  'use strict';

  function Menu ( trigger, reveal, menu ) {
    this.trigger = $(trigger);
    this.reveal = $(reveal);
    this.menu = $(menu);

    this.front = this.reveal.find('.menu-reveal__layer--front');
    this.back = this.reveal.find('.menu-reveal__layer--back');

    this.isOpen = false;

    this._init();

    return this;
  }

  Menu.prototype._init = function() {
    var self = this;

    this.timeline = new TimelineMax({
      onComplete: function () {
        self.reveal
        .removeClass('menu-reveal--close')
        .addClass('menu-reveal--open');


      },
      onReverseComplete : function () {
        self.reveal
        .removeClass('menu-reveal--open')
        .addClass('menu-reveal--close');
      }
    });

    console.log(this.timeline);

    this.timeline
      .to(this.front, .35, {left: '0%'})
      .to(this.back, .5, {left: '0%'})
      .staggerFrom(self.menu.children(), .5, {left:100, opacity:0, ease:Back.easeOut}, 0.1);

    this.timeline.stop();

    this.trigger.on('click', function ( event ) {
      event.preventDefault();
      console.log('click');
      if (self.isOpen) {
        self.close();
      } else {
        self.open();
      }

      self.isOpen = !self.isOpen;

    });
  };

  Menu.prototype.open = function() {
    this.timeline.play();

  };

  Menu.prototype.close = function() {
    this.timeline.reverse();
  };

  window.Menu = Menu;

})( window );
