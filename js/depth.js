$(document).ready(function(){
  var xpos = 0, ypos = 0;
  var curDepth;

  function DepthMeter($parent, startingDepth){
    this.curDepth = startingDepth || 0;
    this.$container = $('<div id="depthMeterContainer"></div>');
    this.$meter = $('<div id="depthMeter"></div>');

    this.$meter.appendTo(this.$container);
    $parent.append(this.$container);
  }

  DepthMeter.prototype.setCurDepth = function(curDepth){
    this.curDepth = curDepth;
    this.$meter.css({
    
      height: (100 * curDepth) + '%'
    });
  }

  window.DEPTHMETER = new DepthMeter($('body'), 0);

  $(document).on('keydown', function(e){

    switch(e.which){
      case 32:
        // Space bar
        break;

      case 37:
        // Left arrow
        xpos--;
        break;

      case 39:
        // Right arrow
        xpos++;
        break;

      case 38:
        // Up arrow
        ypos++;
        break;

      case 40: 
        // Down arrow
        ypos--;
        break;
    }

    curDepth = 0.1 * ypos;
    if (curDepth < 0) {
      curDepth = 0;
      ypos = 0
    }
    if (curDepth > 1) {
      curDepth = 1;
      ypos = 10;
    }
    CLIPS.setCurDepth(curDepth);
    DEPTHMETER.setCurDepth(curDepth);
  });





});
