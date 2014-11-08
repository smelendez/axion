$(document).ready(function(){
  var xpos = 0, ypos = 0;
  var curDepth;

  function DepthMeter($parent, startingDepth){
    this.$container = $('<div id="depthMeterContainer"></div>');
    this.$dots = [];
    var that = this;
    $parent.append(this.$container);
    for (var i =0; i < 10; i++) {
      var $dot = $('<div class="depthMeterDot" id="depthMeterDot-' + (i+1) + '"></div>');
      $dot.css({
        left: (5 + i * 10) + '%'
      });
      this.$dots.push($dot);
      this.$container.append($dot);
    }
    $('.depthMeterDot').on('click',function(){
      var $this = $(this);
      var index = $this.attr('id').split('-')[1];
      that.setCurDepth(0.1 * index);

    });
    this.setCurDepth(startingDepth || 0);
    
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
  DepthMeter.prototype.incrementDepth = function(){
    this.setCurDepth(Math.min(this.curDepth+0.1, 1))

  }
  DepthMeter.prototype.decrementDepth = function(){
    this.setCurDepth(Math.max(this.curDepth-0.1, 0))

  }

  window.DEPTHMETER = new DepthMeter($('#viewport'), 0.5);



  $(document).on('keyup', function(e){

    switch(e.which){
      case 32:
        // Space bar
        if (PLAYER.paused()) PLAYER.play(); else PLAYER.pause();
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
        DEPTHMETER.decrementDepth();
        break;

      case 40: 
        // Down arrow
        DEPTHMETER.incrementDepth();
        break;
    }

  });

  // Set up progress dots



  var $player = $('#player');
  var playerCenter = $player.position();
  playerCenter.top += $player.height() / 2;
  playerCenter.left += $player.width() / 2;
  var radius = 250;

  for (var i = 1; i <= 12; i ++) {
    var $dot = $('<div id="playerdot-' + i + '" class="playerdot"></div>');
    $dot.css({
     top: playerCenter.top + Math.sin((i / 12) * 2 * Math.PI) * radius + 'px',
     left: playerCenter.left + Math.cos((i / 12) * 2 * Math.PI) * radius + 'px'

    });
    $('#viewport').append($dot);
  }





});
