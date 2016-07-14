;(function (window, $, SlideParallax) {

  'use strict';

  function preventSelfcallCallback (event) {

    event.preventDefault();

  }

  function SliderParallax ( slides, stage, fixer, autoPlay, infinite ) {

    if (!arguments.length) {
      console.error('SliderParallax: Could not create the instance, not pass the required parameters ( slides, stage, fixer )');
      return false;
    }

    if ( !($.type( slides ) === 'string' || slides instanceof jQuery) ) {
      console.error('SliderParallax: slides must be of type string or a jQuery object');
      return false;
    }

    this._cache( slides, stage, fixer, infinite !== false );

    this._init( autoPlay === true );

    return this;
  }

  SliderParallax.prototype._cache = function( slides, stage, fixer, infinite ) {

    this.stage = stage;
    this.fixer = fixer;

    this.slides = [];
    var self = this;
    var $slides = $(slides).each(function(i,e){
      self.add(e);
    });

    this.current_slide = 0;
    this.infinite = infinite;

  };

  SliderParallax.prototype._init = function( autoPlay ) {

    $(this).bind('in.start in.end out.start out.end', preventSelfcallCallback);

    if(autoPlay){
      this.start();
    }

  };

  SliderParallax.prototype.add = function( element ){
    var slide = new SlideParallax(this.stage, $(element), this.fixer);
    $(slide).bind('in.start',$.proxy(this, "_in_start"))
            .bind('in.end',$.proxy(this, "_in_end"))
            .bind('out.start',$.proxy(this, "_out_start"))
            .bind('out.end',$.proxy(this, "_out_end"));
    this.slides.push(slide);
  };

  SliderParallax.prototype._in_end = function(){
    $(this).trigger("in.end");
  };
  SliderParallax.prototype._out_end = function(){
    //this.start();
    $(this).trigger("out.end");
  };

  SliderParallax.prototype._get_prev_index = function(){
    if(this.slides.length){
      if(this.current_slide > 0){
        return this.current_slide - 1;
      } else {
        if(this.infinite){
          return this.slides.length - 1;
        } else {
          return false;
        }
      }
    }
    return false;
  };

  SliderParallax.prototype._get_next_index = function(){
    if(this.slides.length){
      if(this.current_slide < this.slides.length - 1){
        return this.current_slide + 1;
      } else {
        if(this.infinite){
          return 0;
        } else {
          return false;
        }
      }
    }
    return false;
  };

  SliderParallax.prototype._get_prev = function(){
    var prev = this._get_prev_index();
    if(prev !== false){
      return this.slides[prev];
    }
    return false;
  };

  SliderParallax.prototype._get_next = function(){
    var next = this._get_next_index();
    if(next !== false){
      return this.slides[next];
    }
    return false;
  };

  SliderParallax.prototype._get_current = function(){
    if(this.slides.length){
      return this.slides[this.current_slide];
    }
    return false;
  };

  SliderParallax.prototype.start = function( delay ){

    var current = this._get_current();
    if(delay > 0){
      setTimeout(function(){
        current.in();
      }, delay);
    } else {
      current.in();
    }

    $(this).trigger("in.start");
    
  };

  SliderParallax.prototype.next = function( delay ){

    var current = this._get_current();
    if(delay > 0){
      setTimeout(function(){
        current.out();
      }, delay);
    } else {
      current.out();
    }
    this.current_slide = this._get_next_index();

    $(this).trigger("out.start");

  };

  SliderParallax.prototype.prev = function( delay ){

    var current = this._get_current();
    if(delay > 0){
      setTimeout(function(){
        current.out();
      }, delay);
    } else {
      current.out();
    }
    this.current_slide = this._get_prev_index();

    $(this).trigger("out.start");
    
  };

  SliderParallax.prototype.destroy = function() {
    for(var i = 0, l = this.slides.length; i < l; i++){
      this.slides[i].destroy();
    }
  };

  window.SliderParallax = SliderParallax;

})(window, jQuery, window.SlideParallax);
