;(function (window, $, Parallax, TweenMax, TimelineMax) {

  'use strict';

  function preventSelfcallCallback (event) {

    event.preventDefault();

  }

  function SlideParallax ( stage, container, fixer ) {

    if (!arguments.length) {
      console.error('SlideParallax: Could not create the instance, not pass the required parameters ( stage, container, fixer )');
      return false;
    }

    if ( !($.type( container ) === 'string' || container instanceof jQuery) ) {
      console.error('SlideParallax: container must be of type string or a jQuery object');
      return false;
    }

    this._cache( stage, container, fixer );

    this._init();

    return this;
  }

  SlideParallax.prototype._cache = function( stage, container, fixer ) {

    this.$container = $( container );

    var animations = [];
    this.$container.find("[data-slideparallax-animation]").each(function(i,e){
      var aux = $(e).data("slideparallax-animation");
      aux.e = $(e);
      aux.duration = aux.duration ? aux.duration : .5;
      aux.delay = aux.delay ? aux.delay : null;
      animations.push(aux);
    }); 
    this.animations = animations;
    
    this.parallax = new Parallax( stage, this.$container, fixer, false );

    this.timeline = new TimelineMax({ 
      onComplete: $.proxy(this, "_timeline_in_complete"),
      onReverseComplete: $.proxy(this, "_timeline_out_complete")
    });

  };

  SlideParallax.prototype._init = function() {

    $(this).bind('in.start in.end out.start out.end', preventSelfcallCallback);

    for(var i = 0, l = this.animations.length; i < l; i++){
      this.timeline.to( this.animations[i].e, this.animations[i].duration, this.animations[i].in, this.animations[i].delay );
    }
    
    this.reset();

  };

  SlideParallax.prototype._timeline_in_complete = function(){

    this.parallax.enable();
    $(this).trigger('in.end');

  };

  SlideParallax.prototype._timeline_out_complete = function(){

    $(this).trigger('out.end');

  };

  SlideParallax.prototype.reset = function(){

    this.timeline.stop();
    for(var i = 0, l = this.animations.length; i < l; i++){
      TweenMax.set(this.animations[i].e, this.animations[i].out);
    }
    this.parallax.disable();

  };

  SlideParallax.prototype.in = function(){

    this.timeline.play();
    this.parallax.disable();
    $(this).trigger('in.start');

  };

  SlideParallax.prototype.out = function(){

    this.timeline.reverse();
    this.parallax.disable();
    $(this).trigger('out.start');
    
  };

  SlideParallax.prototype.destroy = function() {
    this.parallax.destroy();
  };

  window.SlideParallax = SlideParallax;

})(window, jQuery, window.Parallax, TweenMax, TimelineMax);
