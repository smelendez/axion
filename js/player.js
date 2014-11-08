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
  /*$('video').on('click', function(){
    if (PLAYER.paused()) PLAYER.unpause(); else PLAYER.pause();
  });*/
});
