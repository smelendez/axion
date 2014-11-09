window.INTRO = true;

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
  setTimeout(stage2, 5000);
  // Welcome to Axion
}
function stage2() {
  $('#stage1').css('opacity', '0');
  $('#stage2').css('opacity', '1');
  setTimeout(clickUp, 5000);
  setTimeout(clickUp, 7000);
  setTimeout(clickDown, 9000);
  setTimeout(clickDown, 11000);
  setTimeout(stage3, 15000);
  // Use your up and down arrow keys to adjust the depth
}
function stage3() {
  $('#stage2').css('opacity', '0');
  $('#stage3').css('opacity', '1');
  // Use the space bar to play and stop the video
}

$(document).ready(stage1);  
