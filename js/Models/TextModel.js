var App = App || {};
    App.Views = App.Views || {};
    App.Collections = App.Collections || {};
    App.Models = App.Models || {};
    
$(function(){

  App.Models.TextTool = Backbone.Model.extend({

    defaults: function() {
        return {
            type: 'text',
            text: '',
            drawAt: null,
            events: [],
            color: '#000',
            font: 'normal 22px Verdana',

        }
    },

    initialize: function() {

      this.set('container', $('<input type="text">').attr('id','txtContainer'));
    },

    onEvent: function( e ) {

      switch (e.type) {
        case 'touchstart':
        case 'mousedown':
          this.finish();
          this.set('drawAt', e);
          this.moveTextBox();
          break;
      }
    },

    moveTextBox: function() {

      this.get('container')
        .on('change blur', $.proxy(this.finish, this))
        .appendTo($('body'))
        .css({
          left: this.get('drawAt').originalEvent.pageX,
          top: this.get('drawAt').originalEvent.pageY
        })
        .focus();
    },

    finish: function() {

      if(this.get('drawAt') == null) {
          return;
      }

      this.set('text', this.get('container').val());
      
      this.get('events').push({
        text: this.get('text'),
        e: this.get('drawAt')
      });

      this.get('container')
        .val('')
        .remove();

      this.trigger('redraw');
    },

    draw: function( context ) {

      context.font      = this.get('font');
      context.fillStyle = this.get('color');
      
      _.each(this.get('events'), function( evt ) {
        // ugly 'magic numbers'
        context.fillText(evt.text, evt.e.pageX + 5, evt.e.pageY + 27);
      });
    },

  });

});