$(document).ready(function(){
  var xpos = 0, ypos = 0;
  var curDepth;

  function DepthMeter($parent, startingDepth){
    this.curDepth = startingDepth || 0;
    this.$container = $('<div id="depthMeterContainer"></div>');
    this.$dots = [];
    $parent.append(this.$container);
    for (var i =0; i < 10; i++) {
      var $dot = $('<div class="depthMeterDot"></div>');
      $dot.css({
        left: (5 + i * 10) + '%'
      });
      this.$dots.push($dot);
      this.$container.append($dot);
    }
  }

  DepthMeter.prototype.setCurDepth = function(curDepth){
    this.curDepth = curDepth;
    CLIPS.setCurDepth(curDepth);
    for (var i =0; i < 10; i++) {
      
      if (Math.round(curDepth * 10) > i) {
        this.$dots[i].addClass('filled');
      }
      else {
        this.$dots[i].removeClass('filled');
      }

    }
  }

  window.DEPTHMETER = new DepthMeter($('body'), 0);

  function setDepth(){
    curDepth = 0.1 * ypos;
    if (curDepth < 0) {
      curDepth = 0;
      ypos = 0;
    }
    if (curDepth > 1) {
      curDepth = 1;
      ypos = 10;
    }
    DEPTHMETER.setCurDepth(curDepth);

  }

  $(document).on('keyup', function(e){

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
        setDepth();
        break;

      case 40: 
        // Down arrow
        ypos--;
        setDepth();
        break;
    }

  });





});
