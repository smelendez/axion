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

  if (this.seq == ctx.seq) {
    var top = (this.depth < ctx.video_depth) ? 0 : 635;
    this.dom
        .css('top', (top + (.18 * 85)) + 'px')
        .css('left', 400 + (100 * this.depth_order) + 'px')
        .css('width', '85px')
        .css('height', '85px')
        .css('margin-top', -(.18 * 85) + 'px')
        .css('font-size', (.36 * 85) + 'px');
  } else {
    var depthFactor = 1 / (0.8 + Math.abs(this.depth - ctx.depth));
    var seqFactor = 1 / Math.pow(Math.abs(this.seq - ctx.seq), 0.5);
    var sizeFactor = depthFactor * seqFactor;

    var left = ((this.seq - ctx.seq) * 80);
    if (left > 0) left += 850; else left += 350;
    if (left > 1080) {
      sizeFactor = 0;
      left = 1080;
    }
    if (left < 0) {
      sizeFactor = 0;
      left = 0;
    }

    var vertRange = 720 / Math.pow(Math.abs(this.seq - ctx.seq), 0.5);

    var vertNoise = Math.random() * 40 - 20;
    this.dom
        .css('left', left + 'px')
        .css('top', vertNoise - (25 * sizeFactor) + 360 +
		    (this.depth - ctx.depth)/2 * vertRange +
		    'px')
        .css('width', 50 * sizeFactor + 'px')
        .css('height', 50 * sizeFactor + 'px')
        .css('margin-top', -9 * sizeFactor + 'px')
        .css('font-size', 18 * sizeFactor + 'px');
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
  var depth_order = 0;
  for (var i = 0; i < this.videos.length; ++i) {
    if (i > 0 && this.videos[i].seq > this.videos[i-1].seq) {
      depth_order = 0;
    } 
    this.videos[i].depth_order = depth_order;
    ++depth_order;
  }
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
    new Clip('media/star_head.png', 'media/1-07.mp4', 0, 0.2),
    new Clip('media/star_head.png', 'media/1-08.mp4', 0, 0.5),
    new Clip('media/star_head_2.png', 'media/1-09.mp4', 0, 0.7),
    new Clip('media/star_head_2.png', 'media/video_1.mp4', 1, 0.75),
    new Clip('media/star_head.png', 'media/video_1.mp4', 2, 0.9),
    new Clip('media/star_head.png', 'media/video_1.mp4', 3, 0.5)
  ]);
  window.CLIPS.show();
  $('video').on('click', function(){
    if (PLAYER.paused()) PLAYER.play(); else PLAYER.pause();
  });
});


