function Clip(screenshot, seq, depth) {
  this.dom = $('<div class="clip" />')
    .css('background-image', 'url("' + screenshot + '")');
  // TODO: mask
  this.depth = depth;
  this.seq = seq;
}
Clip.prototype.setPos = function(ctx) {
  // TODO: actual animation w/ circular paths around main video
  var depthFactor = 1 / (1 +  Math.exp(8 * Math.abs(this.depth - ctx.depth) - 4));
  if (this.seq < ctx.seq) {
    this.dom.css('top', '900px').css('width', '1px').css('height', '1px');
  } else if (this.seq == ctx.seq) {
    var left = (this.depth - ctx.video_depth) * 300;
    if (this.depth < ctx.video_depth) left += 300;
    if (this.depth > ctx.video_depth) left += 980;
    this.dom
        .css('top', '360px')
        .css('left', left + 'px')
        .css('width', 200 * depthFactor + 'px')
        .css('height', 200 * depthFactor + 'px'); 
  } else {
    var vertNoise = Math.random() * 40 - 20;
    var horizNoise = Math.random() * 40 - 20;
    this.dom
        .css('top', vertNoise + 150 + ((ctx.seq - this.seq) * 50) + 'px')
        .css('left', horizNoise + ((this.depth - ctx.depth)/2 + 0.5) * 1280 + 'px')
        .css('width', 50 * depthFactor + 'px')
        .css('height', 50 * depthFactor + 'px');
  }
}
Clip.prototype.show = function(ctx) {
  this.setPos(ctx);
  this.dom.appendTo($('body'));
}

function Clips(vid_list) {
  this.context = {
    depth: 0.5,
    seq: 0,
    video_depth: 0.5
  }; 
  this.videos = vid_list;
}
Clips.prototype.changePlaying = function(cur_seq, video_depth) {
  var clips = this;
  this.context.seq = cur_seq;
  this.context.video_depth = video_depth;
  this.videos.forEach(function(video) {
    video.setPos(clips.context);
  });
}
Clips.prototype.setCurDepth = function(cur_depth) {
  var clips = this;
  this.context.depth = cur_depth;
  this.videos.forEach(function(video) {
    video.setPos(clips.context);
  });
}
Clips.prototype.show = function(cur_seq, cur_depth)  {
  var clips = this;
  this.videos.forEach(function(video) {
    video.show(clips.context);
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


