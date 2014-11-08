function video(screenshot, depth, seq) {
  this.dom = $('<div/>');
  this.img = $('<img/>');
  this.img.attr('src', screenshot).appendTo(this.dom);
  // TODO: mask
  this.depth = depth;
  this.seq = seq;
}
video.prototype.show = function(cur_seq, cur_depth) {
  this.cur_seq = cur_seq;
  this.cur_depth = cur_depth;
  this.setPos();
  this.dom.appendTo($('body'));
}
video.prototype.setCurSeq = function(cur_seq) {
  this.cur_seq = cur_seq;
  this.setPos();
}
video.prototype.setCurDepth = function(cur_depth) {
  this.cur_depth = cur_depth;
  this.setPos();
}

VIDEOS = [];

$(document).ready(function(){
});


