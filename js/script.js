function Clip(screenshot, seq, depth) {
  this.dom = $('<div class="clip" />')
    .css('background-image', 'url("' + screenshot + '")');
  // TODO: mask
  this.depth = depth;
  this.seq = seq;
}
Clip.prototype.setPos = function() {
  // TODO: noising position
  var depthFactor = 1 / (1 +  Math.exp(8 * Math.abs(this.depth - this.cur_depth) - 4));
  if (this.seq < this.cur_seq) {
    this.dom.css('top', '900px').css('width', '1px').css('height', '1px');
  } else if (this.seq == this.cur_seq) {
    // TODO: circular path
    var left = (this.depth - this.cur_depth) * 300;
    if (this.depth < this.cur_depth) left += 300;
    if (this.depth > this.cur_depth) left += 980;
    this.dom
        .css('top', '360px')
        .css('left', left + 'px')
        .css('width', 200 * depthFactor + 'px')
        .css('height', 200 * depthFactor + 'px'); 
  } else {
    // TODO: circular path
    this.dom
        .css('top', 220 + ((this.cur_seq - this.seq) * 100) + 'px')
        .css('left', ((this.depth - this.cur_depth)/2 + 0.5) * 1280 + 'px')
        .css('width', 50 * depthFactor + 'px')
        .css('height', 50 * depthFactor + 'px');
  }
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
Clips.prototype.show = function(cur_seq, cur_depth)  {
  this.videos.forEach(function(video) {
    video.show(cur_seq, cur_depth);
  });
}

$(document).ready(function(){
  window.CLIPS = new Clips([
    new Clip('media/placeholder_head.png', 0, 0.61),
    new Clip('media/placeholder_head_2.png', 1, 0.1),
    new Clip('media/placeholder_head_2.png', 1, 0.75),
    new Clip('media/placeholder_head.png', 2, 0.9),
    new Clip('media/placeholder_head.png', 3, 0.5)
  ]);
  window.CLIPS.show(0, 0.5);
  window.setTimeout(function() { window.CLIPS.setCurSeq(1); });
});


