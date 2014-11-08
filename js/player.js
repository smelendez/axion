$(document).ready(function(){
  window.PLAYER = Popcorn('#player');
  PLAYER.on('ended', function() {
    var nextMedia = CLIPS.playNext();
    $('#player').attr('src', nextMedia);
  });
    $('#player').attr('src', CLIPS.playNext());
});
