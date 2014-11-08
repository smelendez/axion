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
	var nextMedia = CLIPS.playNext();
	$('#player').attr('src', nextMedia);
	PLAYER.play(); }, 1000);
  });
  $('#player').attr('src', CLIPS.playNext());
});
