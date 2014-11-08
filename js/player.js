$(document).ready(function(){
  window.PLAYER = Popcorn('#player');
  window.CANCEL = false;
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
  PLAYER.on('timeupdate', function(){
    var ct = PLAYER.currentTime();
    var duration = PLAYER.duration();

    for (var i = 0; i < 12; i++){
      if (ct >= (i / 12) * duration) {
        $('#playerdot-' + (i)).addClass('filled');
      }
      else {
        $('#playerdot-' + (i)).removeClass('filled');
      }

    }
  });
  $('#clock').on('click', function() {
   if (PLAYER.paused()) PLAYER.play(); else PLAYER.pause();
  });
});
