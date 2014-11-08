$(document).ready(function(){
  window.PLAYER = Popcorn('#player');
  PLAYER.on('ended', function() {
    var nextMedia = CLIPS.playNext();
    $('#player').attr('src', nextMedia);
    PLAYER.play();
  });
  PLAYER.on('ended', function() {
    $('#player').attr('src', CLIPS.playNext());
  }); 
  PLAYER.on('timeupdate', function(){

  });
});
