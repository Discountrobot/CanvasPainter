var App = App || {};
    
$(function(){

  App.Models.MarkerTool = Backbone.Model.extend({
    
    defaults: function() {
      return {
        type: 'marker', 
        active: false,
        event: [],
        events: [],
      }
    },

    initialize: function() {
      
      this.set('options', {
        color: '#F09',
        size: 7
      });
    },

    onEvent: function( event ) {
      
      // strip unused data to minify data stored.
      var e = this.stripEvent(event);

      switch (event.type) {
        case 'mousedown':
        case 'touchstart':
          this.set('event', []);
          this.set('active', true);
          this.get('event').push(e);
          this.get('events').push(this.get('event'));
          break;
        case 'mousemove':
        case 'touchmove':
          if(this.get('active')) {
            this.get('event').push(e)
            this.trigger('redraw');
          }
          break;
        case 'mouseup':
        case 'mouseout':
        case 'mouseleave':
        case 'touchend': // currently not firing
        case 'touchcancel': // currently not firing
          this.set('active', false);
          break;
      }
    },

    draw: function( context ) {

      var events = this.get('events');
      // smooth curves
      context.lineJoin = "round";
      context.lineCap = "round";
      context.beginPath();

      _.each(events, function( events ){
        //this is our breakpoint
        context.moveTo(events[0].pageX, events[0].pageY);

        _.each(events, function( event ) {
          context.lineTo(event.pageX, event.pageY);
        });
      }); 

      context.strokeStyle = this.get('options').color;
      context.lineWidth = this.get('options').size;
      context.stroke();
    },

    stripEvent: function ( e ) {
      var newEvent = {};
      newEvent.pageX = e.pageX;
      newEvent.pageY = e.pageY;
      return newEvent;
    },

    undo: function( e ) {
      this.get('events').pop();
      this.trigger('redraw');
    },

    flush: function() {
      this.set('events', []);
      this.trigger('redraw');
    }
  
  });

});