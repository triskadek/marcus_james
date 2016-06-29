var app = app || {};
app.parallax = app.parallax || {

  init: function () {
    this.mouseX = this.mouseY = 0;

    this.cache();
    this.bind();
  },

  cache: function () {
    this.$scene = $( '.plx-scene' );
    this.$layers = this.$scene.find( '.plx-scene__layer' );
    this.$body = $( document.body );
    this.$window = $( window );

    this.$layers.each(function ( index, layer ) {
      var $layer = $( layer );
      $layer.attr( 'data-x', $layer.position().left );
      $layer.attr( 'data-y', $layer.position().top );
    });

  },

  bind : function () {
    this.$body.on( 'mousemove', this.parallaxMove.bind( this ));
  },

  parallaxMove : function ( event ) {

    var centerX = this.$window.width() / 2;
    var centerY = this.$window.height() / 2;

    var mouseX = ( centerX - event.clientX ) / centerX;
    var mouseY = ( centerY - event.clientY ) / centerY;

    var posX, posY;

    this.$layers.each( function ( index, layer ) {
      var $layer = $( layer );
      var depth = $layer.data( 'depth' );
      var originX = $layer.data('x');
      var originY = $layer.data('y');

      posX = originX + ( mouseX * depth );
      posY = originY + ( mouseY * depth );

      TweenMax.to(layer, 0.5,{ top : posY , left : posX });
    });
  }

};

app.parallax.init();
