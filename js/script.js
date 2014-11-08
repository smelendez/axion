function Clip(screenshot, depth, seq) {
  this.dom = $('<div/>');
  this.img = $('<img/>');
  this.img.attr('src', screenshot).appendTo(this.dom);
  // TODO: mask
  this.depth = depth;
  this.seq = seq;
}
Clip.prototype.show = function(cur_seq, cur_depth) {
  this.cur_seq = cur_seq;
  this.cur_depth = cur_depth;
  this.setPos();
  this.dom.appendTo($('body'));
}
Clip.prototype.setCurSeq = function(cur_seq) {
  this.cur_seq = cur_seq;
  this.setPos();
}
Clip.prototype.setCurDepth = function(cur_depth) {
  this.cur_depth = cur_depth;
  this.setPos();
}

function Clips(vid_list) {
  this.videos = vid_list;
}
Clips.prototype.setCurSeq = function(cur_seq) {
  this.videos.forEach(function(video) {
    video.setCurSeq(cur_seq);
  });
}
Clips.prototype.setCurDepth = function(cur_depth) {
  this.videos.forEach(function(video) {
    video.setCurDepth(cur_depth);
  });
}

$(document).ready(function(){
  window.CLIPS = new Clips([]);
});


