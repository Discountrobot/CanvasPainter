var App = App || {};

$(function () {

  App.Views.Painter = Backbone.View.extend({

    el: $('body'),
    canvas: $('#canvas')[0],
    $canvas: $('#canvas'),
    context: null,
    tools: '[data-tool]',
    model: new App.Models.PainterModel(),

    events: {
      'click #canvas':        'onEvent',
      'mousedown #canvas':    'onEvent',
      'mouseup #canvas':      'onEvent',
      'mousemove #canvas':    'onEvent',
      'mouseleave #canvas':   'onEvent',
      'mouseout #canvas':     'onEvent',

      'touched #canvas':      'onEvent',
      'touchstart #canvas':   'onEvent',
      'touchmove #canvas':    'onEvent',
      'touchend #canvas':     'onEvent',
      'touchcancel #canvas':  'onEvent',

      'click span[data-tool]': 'changeTool',
      'click #download': 'download'
    },

    initialize: function() {
      
      this.context = this.canvas.getContext('2d');
      
      _.bindAll(this, 'onEvent');
      _.bindAll(this, 'onKeyEvent');
      _.bindAll(this, 'download');
      
      this.listenTo(this.model, 'redraw', this.render);

      this.$el.on('keydown', this.onKeyEvent);
    },

    onEvent: function( e ) {
      
      //smartphone touch fix.
      if (e.originalEvent && e.originalEvent.targetTouches) {
        e.pageX = e.originalEvent.targetTouches[0].pageX;
        e.pageY = e.originalEvent.targetTouches[0].pageY;
      }

      //fix offset
      e.pageX = e.pageX - this.$canvas.offset().left;
      e.pageY = e.pageY - this.$canvas.offset().top; 

      this.model.onEvent( e );

      e.preventDefault();
      return false;
    },

    onKeyEvent: function( e ) {
      this.model.onKeyEvent(e);
    },

    render: function() {
      // flush canvas trick.
      this.canvas.width = this.$canvas.width();
      this.context = this.canvas.getContext('2d');

      this.model.render( this.context );
    },

    changeTool: function( e ) {

      var $target = $(e.target),
          data = $target.data(),
          options = {};

      $(this.tools).removeClass('active');
      $target.addClass('active');

      this.model.onToolSelect(data);
    },

    download: function( e ) {
      e.preventDefault();

      var $target = $(e.target),
          // cache height and width    
          w = canvas.width,
          h = canvas.height,
          backgroundColor = '#fff',
          data = this.context.getImageData(0, 0, w, h);


      var compositeOperation = this.context.globalCompositeOperation;

      this.context.globalCompositeOperation = "destination-over";
      this.context.fillStyle = backgroundColor;
      this.context.fillRect(0,0,w,h);

      var imageData = this.canvas.toDataURL("image/png");

      this.context.clearRect (0,0,w,h);
      this.context.putImageData(data, 0,0);
      this.context.globalCompositeOperation = compositeOperation;

      // open the image data in a new window     
      var win = window.open(imageData, '_blank');
      win.focus();
      return false;
    }

  });
    
})