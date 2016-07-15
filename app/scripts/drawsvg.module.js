;(function ( window , $) {
  'use strict';

  function DrawSVG ( options ) {
    var self = this;

    if ($.isEmptyObject(options)) { return false; }
    this.options = options;
    // if (options.selector && options.points) {}

    if($.isArray(options.selector)) {
      $.each(options.selector , function ( index , value ) {
        self.setCanvas(index, options.points[value], options.stroke_color, options.stroke_width);
      });
    } else {
      this.setCanvas(options.selector, options.points, options.stroke_color, options.stroke_width )
    }
  }

  DrawSVG.prototype.setCanvas = function (selector, points, stroke_color, stroke_width) {
    var paper = Snap(selector),
      path = paper
        .path(points)
        .attr({
          'stroke' : stroke_color,
          'stroke-width' : stroke_width,
          fill: 'none'
        }),
      length = path.getTotalLength();

      path.attr({
        'stroke-dasharray' : length + " " + length ,
        'stroke-dashoffset' : length
      });

      $(selector).attr({
        "data-stroke-dasharray": length + " " + length,
        "data-stroke-dashoffset": length
      });
  };

  DrawSVG.prototype.easeIn = function( selector, callback ) {
    $(selector).find('path').animate({
      'stroke-dashoffset' : ''
    },500, callback );
  };

  DrawSVG.prototype.easeOut = function( selector, callback ) {
    $(selector).find('path').animate({
      "stroke-dasharray": $(selector).data("stroke-dasharray"),
      "stroke-dashoffset": $(selector).data("stroke-dashoffset")
    },500, callback );
  };

  window.DrawSVG = DrawSVG;

})( window, window.jQuery );


