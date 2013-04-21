var App = App || {};
    App.Views = App.Views || {};
    App.Collections = App.Collections || {};
    App.Models = App.Models || {};
    
$(function(){

  App.Models.EraserTool = App.Models.MarkerTool.extend({
    
    initialize: function() {
      
      this.set('options', {
        color: "rgba(0,0,0,0)",
        size: 60
      });
    },

    draw: function( context ) {
      
      var events = this.get('events');

      var oldcomposite;
      oldcomposite = context.globalCompositeOperation;
      context.globalCompositeOperation = "copy";

      /* this bit is redundant .. */

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
      
      context.globalCompositeOperation = oldcomposite;
    }

  });

});