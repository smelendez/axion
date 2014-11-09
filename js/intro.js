window.INTRO = true;
window.INTRO_CUES = [];

function clickUp() {
  $('#intro .fa-arrow-up').css('background', '#666');
  setTimeout(function() {
    $('#intro .fa-arrow-up').css('background', '#333');
  }, 250);
  DEPTHMETER.decrementDepth();
}
function clickDown() {
  $('#intro .fa-arrow-down').css('background', '#666');
  setTimeout(function() {
    $('#intro .fa-arrow-down').css('background', '#333');
  }, 250);
  DEPTHMETER.incrementDepth();
}

function stage1() {
  $('#stage1').css('opacity', '1');
  INTRO_CUES.push(setTimeout(stage2, 5000));
  // Welcome to Axion
}
function stage2() {
  $('#stage1').css('opacity', '0');
  $('#stage2').css('opacity', '1');
  INTRO_CUES.push(setTimeout(clickUp, 5000));
  INTRO_CUES.push(setTimeout(clickUp, 7000));
  INTRO_CUES.push(setTimeout(clickDown, 9000));
  INTRO_CUES.push(setTimeout(clickDown, 11000));
  INTRO_CUES.push(setTimeout(stage3, 15000));
  // Use your up and down arrow keys to adjust the depth
}
function stage3() {
  $('#stage2').css('opacity', '0');
  $('#stage3').css('opacity', '1');
  // Use the space bar to play and stop the video
}

function clearIntro() {
  if (!INTRO) return;
  $('#intro').css('visibility', 'hidden');
  INTRO = false;
  INTRO_CUES.forEach(function(cue) {
    clearTimeout(cue);
  });
  PLAYER._play();
}
  

$(document).ready(stage1);  
