;(function (window) {

  'use strict';

  function Parallax ( canvas, elements, fixer ) {

    if (!arguments.length) {
      console.error('Could not create the instance, not pass the required parameters ( canvas, elements, fixer )');
      return false;
    }

    if ( !( $.type( canvas) && $.type( elements) === 'string' ) ) {
      console.error('canvas and elemenets, they must be of type string');
      return false;
    }

     if ( !( $.type( new Number(fixer))  === 'number' ) ) {
      console.error('fixer, they must be of type number');
      return false;
    }

    this._cache( canvas, elements, fixer);

    if (!(this.canvas.length && this.elements.length)) {
      console.error('canvas and elements does not exists');
      return false;
    }

    this._init();

    return this;
  }

  Parallax.prototype._cache = function( canvas, elements, fixer ) {
    this.canvas = $( canvas );
    this.elements = $( elements );
    this.fixer = fixer || -.004;
  };

  Parallax.prototype._init = function() {
    var self = this;

    $(window).on('mousemove', function ( event ) {

      var canvas = self.canvas,
        mouseX = event.clientX - .5 * canvas.width(),
        mouseY = event.clientY - .5 * canvas.height() <= window.innerHeight
          ? event.clientY - .5 * canvas.height()
          : window.innerHeight;
      self._animate( mouseX, mouseY );
    });

  };

  Parallax.prototype._animate = function( mouseX, mouseY ) {
    var self = this;

    this.elements.each(function ( index , el ) {
      var layer = $(el),
        parallaxValues = layer.attr('data-parallax-values').split(','),
        posX = parseFloat(parallaxValues[0]),
        posY = parseFloat(parallaxValues[1]);

        ( posX && posY ) ? TweenMax.to( layer, .5, {
          x : ( layer.position().left + mouseX * posX ) * self.fixer,
          y : ( layer.position().top + mouseY * posY ) * self.fixer
        }) : console.error('Cant initiate 2D parallax movement, because the X and Y axis attribute is not provided.');

    });
  };

  Parallax.prototype.destroy = function() {
    $(window).off('mousemove');
  };

  window.Parallax = Parallax;

})(window);
