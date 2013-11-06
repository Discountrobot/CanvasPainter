var App = App || {};
    
$(function() {

  App.Models.Animation = App.Models.MarkerTool.extend({

    initialize: function() {
      
      this.set('active', false);
      this.set('events', []);
      this.set('event', []);
      this.set('options', {
        color: '#F09',
        size: 7
      });
      this.set('speed', 22);

    },

    onEvent: function( e ) {
      // this.trigger('redraw');
    },

    animate: function( t ) {

      var animation = this.getToolEvents(t);

      if(animation.length === 0) return;

      var reference = this;

      this.trigger('redraw')

      var animationIndex = 0;
      var eventsIndex = 0;
      var eventIndex = 0;
      
      var animationInterval = setInterval(function() {

        console.log({
          animationIndex: animationIndex,
          eventsIndex: eventsIndex,
          eventIndex: eventIndex
        })

        if(eventIndex > animation[animationIndex][eventsIndex].length - 1) {
          eventIndex = 0;
          eventsIndex ++;
        }

        if(eventsIndex > animation[animationIndex].length - 1) {
          eventsIndex = 0;
          animationIndex ++;
        }

        if(animationIndex > animation.length - 1) {
          window.clearInterval(animationInterval);
          console.log('end')
          return;
        }

        if(eventIndex == 0) {
          reference.set('event', []);
          reference.get('events').push(reference.get('event'));
        }


        reference.get('event').push(animation[animationIndex][eventsIndex][eventIndex]);

        eventIndex ++;

        reference.set('options', t[animationIndex].get('options'))

        reference.trigger('redraw');

      }, this.get('speed'));

    },   

    getToolEvents: function(tools) {
      var newEvents = [];
      _.each(tools, function(tool) {
        var events = tool.get('events');
        if (events.length > 0) newEvents.push(events);
      });

      return newEvents;
    }

  });
  
})