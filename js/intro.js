window.INTRO = true;

function stage1() {
  $('#stage1').css('opacity', '1');
  setTimeout(stage2, 5000);
  // Welcome to Axion
}
function stage2() {
  $('#stage1').css('opacity', '0');
  $('#stage2').css('opacity', '1');
  setTimeout(stage3, 15000);
  // Use your up and down arrow keys to adjust the depth
}
function stage3() {
  $('#stage2').css('opacity', '0');
  $('#stage3').css('opacity', '1');
  // Use the space bar to play and stop the video
  setTimeout(stage4, 15000);
}
function stage4() {
  $('#stage3').css('opacity', '0');
  $('#stage4').css('opacity', '1');
  // Press space to begin 
}

$(document).ready(stage1);  
