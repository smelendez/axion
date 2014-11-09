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

  PLAYER.on('timeupdate', function(){
    var ct = PLAYER.currentTime();
    var duration = PLAYER.duration();
    if (!duration) {
      // Don't generate the 'clock' until we know how long the clip is
      return;
    }

    for (var i = 0; i < 12; i++){
      if (ct >= (i / 12) * duration) {
        svg.select('#playerdot-' + (i)).attr("fill","#31a354");
      }
      else {
        svg.select('#playerdot-' + (i)).attr("fill","#666");

      }

    }
    
    g.select(".arc").remove();
    var arc = d3.svg.arc().
    innerRadius(275).outerRadius(275)
    .startAngle(0)
    .endAngle((ct / duration) * Math.PI * 2);
    g.append("path").attr("fill", "#31a354").attr("d",arc).attr("class","arc").attr("stroke", "#31a354"); // Green

    

  });
  $('#clock').on('click', function() {
   if (PLAYER.paused()) PLAYER.play(); else PLAYER.pause();
  });
  svg.selectAll(".playerdot").on("click", function(){
    var id = this.id;
    var position = id.split("-")[1];
    PLAYER.currentTime(+(position / 12) * PLAYER.duration());
    d3.event.stopPropagation();
    d3.event.preventDefault();

  });

});
