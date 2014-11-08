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
});
