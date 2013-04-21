var App = App || {};
    App.Views = App.Views || {};
    App.Collections = App.Collections || {};
    App.Models = App.Models || {};

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

    onToolSelect: function( type, options ) {
      
      switch(type) {
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

      this.get('queue').add(this.get('tool'));
    },

    render: function( context ) {
      
      var queue = this.get('queue');

      _.each(queue.models, function( tool ) {
        tool.draw( context );
      });
    },

    flush: function() {
      
      this.get('queue').reset();
      this.trigger('redraw');
    },

  });
  

});