function Clip(screenshot, media, seq, depth) {
  this.dom = $('<div class="clip"><i class="playbutton fa fa-play"></i></div>')
    .css('background-image', 'url("' + screenshot + '")');
  // TODO: mask
  this.screenshot = screenshot;
  this.media = media;
  this.depth = depth;
  this.seq = seq;
}
Clip.prototype.setPos = function(ctx) {
  // TODO: actual animation w/ circular paths around main video
  if (this.playing) {
    var clip = this;
    this.dom.css('opacity', '0')
        .css('top', '85px')
        .css('left', '365px')
        .css('width', '550px')
        .css('height', '550px');
    return;
  }
  this.dom.css('opacity', '1');

  var depthFactor = 1 / (1 +  Math.exp(8 * Math.abs(this.depth - ctx.depth) - 4));
  if (this.seq == ctx.seq) {
    var top = (this.depth < ctx.video_depth) ? 0 : 635;
    this.dom
        .css('top', (top + (.18 * 85)) + 'px')
        .css('left', '600px')
        .css('width', '85px')
        .css('height', '85px')
        .css('margin-top', -(.18 * 85) + 'px')
        .css('font-size', (.36 * 85) + 'px');
  } else {
    var left = ((this.seq - ctx.seq) * 120);
    if (left > 0) left += 930; else left += 350;

    var vertNoise = Math.random() * 40 - 20;
    this.dom
        .css('left', left + 'px')
        .css('top', vertNoise - (25 * depthFactor) + ((this.depth - ctx.depth)/2 + 0.5) * 720 + 'px')
        .css('width', 50 * depthFactor + 'px')
        .css('height', 50 * depthFactor + 'px')
        .css('margin-top', -9 * depthFactor + 'px')
        .css('font-size', 18 * depthFactor + 'px');
  }
}
Clip.prototype.setPlaying = function(playing) {
  this.playing = playing;
}
Clip.prototype.preview = function(){
    return '<img width="200px" height="200px" id="preview_screenshot" src="' + this.screenshot + '" /> <div id="preview_title">Dr. Horatio Darkmatter:<br /> "I believe in science"</div>'

}
Clip.prototype.show = function(ctx) {
  var that = this;
  this.setPos(ctx);
  this.dom.appendTo($('#viewport'));
  this.dom.on('mouseover', function(){
    $('#hover_preview').html(that.preview()).show();
    

  }).on('mouseout', function(){
    $('#hover_preview').hide();

  }).on('click', function(){
    // Dummy function for now
    CLIPS.play(that);
    $('#player').attr('src', that.media);
    PLAYER.play();
  });
}

function Clips(vid_list) {
  this.context = {
    depth: 0.5,
    seq: -1,
    video_depth: 0.5
  }; 
  this.videos = vid_list;
}
Clips.prototype.play = function(playing) {
  var clips = this;
  this.context.seq = playing.seq;
  this.context.video_depth = playing.depth;
  this.videos.forEach(function(video) {
    video.setPlaying(video == playing);
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
Clips.prototype.show = function()  {
  var clips = this;
  this.videos.forEach(function(video) {
    video.show(clips.context);
  });
}
Clips.prototype.playNext = function() {
  var clips = this;
  var new_seq = this.context.seq + 1;
  var best_diff = 2;
  var best_clip = null;
  this.videos.forEach(function(video) {
    var diff = Math.abs(video.depth - clips.context.depth);
    if (video.seq == new_seq && diff < best_diff) {
      best_diff = diff;
      best_clip = video;
    }
  });
  if (best_clip) {
    this.play(best_clip);
    return best_clip.media;
  }
}

$(document).ready(function(){
  window.CLIPS = new Clips([
    new Clip('media/star_head.png', 'media/video_1.mp4', 0, 0.61),
    new Clip('media/star_head_2.png', 'media/video_1.mp4', 1, 0.1),
    new Clip('media/star_head_2.png', 'media/video_1.mp4', 1, 0.75),
    new Clip('media/star_head.png', 'media/video_1.mp4', 2, 0.9),
    new Clip('media/star_head.png', 'media/video_1.mp4', 3, 0.5)
  ]);
  window.CLIPS.show();
  $('video').on('click', function(){
    if (PLAYER.paused()) PLAYER.play(); else PLAYER.pause();
  });
});


