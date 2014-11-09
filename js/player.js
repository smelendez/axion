$(document).ready(function(){
  window.PLAYER = Popcorn('#player');
  window.CANCEL = false;
  var svg = d3.select("svg#clock");
  var g = svg.select("g");
  PLAYER.on('play', function() {
    CANCEL = true;
  });
  PLAYER.on('ended', function() {
    CANCEL = false;
    setTimeout(function() {
        if (CANCEL) return;
        var oldSource = $('#player').attr('src');
	var nextMedia = CLIPS.playNext();
        if (!nextMedia) return;
	$('#player').attr('src', nextMedia);
	PLAYER.play(); }, 1000);
  });
  $('#player').attr('src', CLIPS.playNext());
  CLIPS.show();

  var getArcFromPct = function(playPct) {
    var arcAngle = playPct * Math.PI * 2;
    return d3.svg.arc().
    innerRadius(275).outerRadius(275)
    .startAngle(0).endAngle(arcAngle)();
  };
  var setArcAndDots = function() {
    var ct = PLAYER.currentTime();
    var duration = PLAYER.duration();
    var arc_sel = g.select(".playerarc");
    if (!duration) {
      arc_sel.remove();
      return;
    }
    if (arc_sel.empty()) {
      arc_sel = g.append("path").attr("class","playerarc");
    }
    arc_sel.attr("d", getArcFromPct(ct/duration));
    for (var i = 0; i < 12; i++){
      if (ct/duration >= (i / 12.0)) {
        svg.select('#playerdot-' + (i)).attr("class", "playerdot playerdot-filled");
      } else {
        svg.select('#playerdot-' + (i)).attr("class", "playerdot");
      }
    }
  };
  PLAYER.forwardDot = function(){
    var ct = PLAYER.currentTime();
    var duration = PLAYER.duration();
    var progress = ct / duration;
    var dots = duration / 12;
    

    var curDot = Math.ceil(ct / dots);
    if (curDot == 12) {
      return;
    }
    PLAYER.currentTime((curDot+1) * dots);



  }
  PLAYER.backDot = function(){
    var ct = PLAYER.currentTime();
    var duration = PLAYER.duration();
    var progress = ct / duration;
    var dots = duration / 12;
    var curDot = Math.floor(ct / dots);
    if (curDot == 0) {
      return;
    }
    PLAYER.currentTime((curDot - 1) * dots);
    
    

  }
  setInterval(setArcAndDots, 20);
 
  svg.selectAll(".playerdot").on("click", function() {
    var id = this.id;
    var position = id.split("-")[1];
    PLAYER.currentTime(+(position / 12) * PLAYER.duration());
    d3.event.stopPropagation();
    d3.event.preventDefault();

  });

});
