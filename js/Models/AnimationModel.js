var App = App || {};
    App.Views = App.Views || {};
    App.Collections = App.Collections || {};
    App.Models = App.Models || {};
    
$(function() {

  App.Models.Animation = App.Models.MarkerTool.extend({

    initialize: function() {
      
      this.set('animation', introAnimation);

      this.set('active', false);
      this.set('events', []);
      this.set('event', []);
      this.set('options', {
        color: '#F09',
        size: 7,
        speed: 6,
      });

      this.animate();
    },

    onEvent: function( e ) {
      // this.trigger('redraw');
    },

    animate: function() {

      var reference = this;

      this.trigger('redraw')

      var animation = this.get('animation');
      var animationIndex = 0;
      var eventIndex = 0;
      
      var animationInterval = setInterval(function() {

        if(animationIndex + 1 >= animation.length) {
          window.clearInterval(animationInterval);
          return;
        }

        if(eventIndex + 1 > animation[animationIndex].length) {
          animationIndex ++;
          eventIndex = 0;
        }

        if(eventIndex == 0) {
          reference.set('event', []);
          reference.get('events').push(reference.get('event'));
        }

        reference.get('event').push(animation[animationIndex][eventIndex]);

        eventIndex ++;

        reference.trigger('redraw');

      }, this.get('options').speed);

    },   

    getEventCoors: function(events) {
      var newEvents = [];
      _.each(events, function(event) {
        var newEvent = [];
        _.each(event, function(evt) {
          newEvent.push({ pageX: evt.pageX, pageY: evt.pageY });
        });
        newEvents.push(newEvent);
      });
    }

  });
  
})