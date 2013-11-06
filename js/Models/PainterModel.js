var App = App || {};

$(function(){

  App.Models.PainterModel = Backbone.Model.extend({
    
    defaults: {
      queue: new App.Collections.Tools(),
      tool: null
    },

    initialize: function() {
      
      this.on('change:tool', this.toolListeners);
    },

    onEvent: function( e ) {
      
      if(this.get('tool') != null) {
        this.get('tool').onEvent(e);
      }
    },

    onKeyEvent: function( e ) {
      
      if(e.which == 90) {
        this.get('tool').undo();
      }
    },

    toolListeners: function() {
      
      this.listenTo(this.get('tool'), 'redraw', function() {
        this.trigger('redraw');
      });
    },

    onToolSelect: function( options ) {
      
      switch(options.tool) {
        case 'marker':
          this.set('tool', new App.Models.MarkerTool());
          break;
        case 'eraser':
          this.set('tool', new App.Models.EraserTool());
          break;
        case 'text':
          this.set('tool', new App.Models.TextTool());
          break;
        case 'flush':
          this.flush();
          break;
        default:
          console.warn('tool not recognized!');
          this.set('tool', new App.Models.MarkerTool());
          break;
      }
   
      if(this.get('tool') == null) {
        return;
      }

      // override default options
      var curOptions = this.get('tool').get('options');
      this.get('tool').set('options', $.extend(curOptions, options));

      // add the tool the the redrawing queue
      this.get('queue').add(this.get('tool'));
    },

    render: function( context ) {
      
      var queue = this.get('queue');

      queue.each(function( tool ) {
        tool.draw( context );
      });
    },

    flush: function() {
      var queue = this.get('queue'),
          tool = this.get('tool');
          // reset the drawing queue
          queue.reset();
          // clear the strokes from the current tool
          tool.flush();

      this.trigger('redraw');
    },

  });
  

});