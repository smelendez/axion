function Clip(screenshot, seq, depth) {
  this.dom = $('<div class="clip" />')
    .css('background-image', 'url("' + screenshot + '")');
  // TODO: mask
  this.depth = depth;
  this.seq = seq;
}
Clip.prototype.setPos = function() {
  // TODO: noising position
  // TODO: actual animation w/ circular paths around main video
  var depthFactor = 1 / (1 +  Math.exp(8 * Math.abs(this.depth - this.cur_depth) - 4));
  if (this.seq < this.cur_seq) {
    this.dom.css('top', '900px').css('width', '1px').css('height', '1px');
  } else if (this.seq == this.cur_seq) {
    var left = (this.depth - this.video_depth) * 300;
    if (this.depth < this.video_depth) left += 300;
    if (this.depth > this.video_depth) left += 980;
    this.dom
        .css('top', '360px')
        .css('left', left + 'px')
        .css('width', 200 * depthFactor + 'px')
        .css('height', 200 * depthFactor + 'px'); 
  } else {
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
  this.video_depth = cur_depth;
  this.setPos();
  this.dom.appendTo($('body'));
}
Clip.prototype.changePlaying = function(cur_seq, video_depth) {
  this.cur_seq = cur_seq;
  this.video_depth = video_depth;
  // TODO: what if this clip is playing?
  this.setPos();
}
Clip.prototype.setCurDepth = function(cur_depth) {
  this.cur_depth = cur_depth;
  this.setPos();
}

function Clips(vid_list) {
  this.videos = vid_list;
}
Clips.prototype.changePlaying = function(cur_seq, video_depth) {
  this.videos.forEach(function(video) {
    video.changePlaying(cur_seq, video_depth);
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
    new Clip('media/star_head.png', 0, 0.61),
    new Clip('media/star_head_2.png', 1, 0.1),
    new Clip('media/star_head_2.png', 1, 0.75),
    new Clip('media/star_head.png', 2, 0.9),
    new Clip('media/star_head.png', 3, 0.5)
  ]);
  window.CLIPS.show(0, 0.5);
});


