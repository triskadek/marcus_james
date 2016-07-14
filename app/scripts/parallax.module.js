;(function (window, $, TweenMax) {

  'use strict';

  var module_counter = 0;

  function Parallax ( stage, container, fixer, autoParallax ) {

    if (!arguments.length) {
      console.error('Parallax: Could not create the instance, not pass the required parameters ( stage, container, fixer )');
      return false;
    }

    if ( !($.type( stage ) === 'string' || stage instanceof jQuery) ) {
      console.error('Parallax: stage must be of type string or a jQuery object');
      return false;
    }

    if ( !($.type( container ) === 'string' || container instanceof jQuery) ) {
      console.error('Parallax: container must be of type string or a jQuery object');
      return false;
    }

    if ( !($.type( new Number(fixer) ) === 'number') ) {
      console.error('Parallax: fixer must be of type number');
      return false;
    }

    this._cache( stage, container, fixer );

    if (!(this.$stage.length && this.$container.length)) {
      console.error('Parallax: stage and container does not exists');
      return false;
    }

    this._init( autoParallax !== false );

    return this;
  }

  Parallax.prototype._cache = function( stage, container, fixer ) {
    this.$stage = $( stage );
    this.$container = $( container );
    this.fixer = fixer || -.004;
    this.namespace = "parallax" + module_counter++;
    this._enabled = false;
  };

  Parallax.prototype._init = function( autoParallax ) {
    if(autoParallax){
      this.enable();
    }
  };

  Parallax.prototype.animateTo = function( x, y ) {
    var self = this;
    this.$container.find("[data-parallax-values]").each(function ( index , el ) {
      var $layer = $(el),
        pv = $layer.data('parallax-values'),
        posX = parseFloat(pv.x),
        posY = parseFloat(pv.y);

        ( posX && posY ) ? TweenMax.to( $layer, .5, {
          x : ( $layer.position().left + x * posX ) * self.fixer,
          y : ( $layer.position().top + y * posY ) * self.fixer
        }) : console.error('Parallax: Cant initiate 2D parallax movement, because the X and Y axis attribute is not provided.');
    });
  };

  Parallax.prototype._bind_mouse_events = function() {
    var self = this;
      $(window).on('mousemove.' + this.namespace, function ( event ) {
        var $stage = self.$stage,
          mouseX = event.clientX - .5 * $stage.width(),
          mouseY = event.clientY - .5 * $stage.height() <= window.innerHeight
            ? event.clientY - .5 * $stage.height()
            : window.innerHeight;
        self.animateTo( mouseX, mouseY );
      });
  };

  Parallax.prototype._unbind_mouse_events = function() {
    $(window).off('mousemove.' + this.namespace);
  };

  Parallax.prototype.enable = function(){
    if(!this._enabled){
      this._bind_mouse_events();
      this._enabled = true;
    }
  };

  Parallax.prototype.disable = function(){
    if(this._enabled){
      this._unbind_mouse_events();
      this._enabled = false;
    }
  };

  Parallax.prototype.isEnable = function(){
    return this._enabled;
  };

  Parallax.prototype.toggle = function(){
    if(this.isEnable()){
      this.disable();  
    } else {
      this.enable();
    }
  };

  Parallax.prototype.destroy = function() {
    this.disable();
  };

  window.Parallax = Parallax;

})(window, jQuery, TweenMax);
