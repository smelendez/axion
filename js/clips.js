function Clip(screenshot, media, seq, depth) {
  if (typeof screenshot == 'object') {
    media = screenshot.media;
    seq = screenshot.seq;
    depth = screenshot.depth;
    screenshot = screenshot.screenshot;
  }


  this.dom = $('<div class="clip"><i class="playbutton fa fa-play"></i></div>')
    .css('background-image', 'url("' + screenshot + '")');
  // TODO: mask
  this.screenshot = screenshot;
  this.media = media;
  this.depth = depth;
  this.seq = seq;
}
Clip.prototype.setPos = function(ctx, opt_noAnimate) {
  // TODO: actual animation w/ circular paths around main video
  if (this.playing) {
    var clip = this;
    this.dom.css({
      'opacity': 0,
      'width': 550,
      'height': 550,
    });
    if (opt_noAnimate) {
      this.dom.css({'top': 85, 'left': 365});
    } else {
      this.dom.css({
       'top': 85,
       'left': 365});
    }
    return;
  }
  this.dom.css('opacity', '1');

  oldTop = this.dom.css('top');
  var newTop, newLeft, newWidth, newHeight;
  if (this.seq == ctx.seq) {
    newTop = (this.depth < ctx.video_depth) ? 0 : 635;
    newLeft =  400 + (100 * this.depth_order);
    newWidth = 85;
    newHeight = 85;
  } else {
    var depthFactor = 1.2 - (1/(1 + Math.exp(4 - 8 * Math.abs(this.depth - ctx.depth))));
    var seqFactor = 1 / Math.pow(Math.abs(this.seq - ctx.seq), 0.5);
    var sizeFactor = depthFactor * seqFactor;

    newLeft = ((this.seq - ctx.seq) * 80);
    if (newLeft > 0) newLeft += 850; else newLeft += 350;
    if (newLeft > 1080) {
      sizeFactor = 0;
      newLeft = 1080;
    }
    if (newLeft < 0) {
      sizeFactor = 0;
      newLeft = 0;
    }

    var vertRange = 720 / Math.pow(Math.abs(this.seq - ctx.seq), 0.7);
    var vertNoise = Math.random() * 20 - 10;

    newTop = vertNoise - (25 * sizeFactor) + 360 +
	    (this.depth - ctx.depth)/2 * vertRange;
    newWidth = 50 * sizeFactor;
    newHeight = 50 * sizeFactor;
  }
  this.dom.css({
    'width': newWidth,
    'height': newHeight,
    'margin-top': -.18 * newHeight,
    'font-size': .36 * 85
  });
  if (opt_noAnimate) {
    this.dom.css({'top': newTop, 'left': newLeft});
  } else {
    this.dom.css({
      'top': newTop,
      'left': newLeft});
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

  this.dom.animate({
    'top': newTop,
    'left': newLeft});
}
Clip.prototype.setPlaying = function(playing) {
  this.playing = playing;
}
Clip.prototype.preview = function(){
    return '<img width="200px" height="200px" id="preview_screenshot" src="' + this.screenshot + '" /> <div id="preview_title">Dr. Horatio Darkmatter:<br /> "I believe in science"</div>'

}
Clip.prototype.show = function(ctx) {
  var that = this;
  this.setPos(ctx, true);
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
  } else {
    return null;
  }
}

$(document).ready(function(){
  window.CLIPS = new Clips([
    new Clip({screenshot: 'media/star_head.png', media:  'media/1-07.mp4', seq: 0, depth: 0.2}),
    new Clip({screenshot: 'media/star_head.png', media:  'media/1-08.mp4', seq: 0, depth: 0.5}),
    new Clip({screenshot: 'media/star_head_2.png', media:  'media/1-09.mp4', seq: 0, depth: 0.7}),
    new Clip({screenshot: 'media/star_head.png', media:  'media/2-01.mp4', seq: 1, depth: 0.1}),
    new Clip({screenshot: 'media/star_head.png', media:  'media/2-03.mp4', seq: 1, depth: 0.2}),
    new Clip({screenshot: 'media/star_head_2.png', media:  'media/2-04.mp4', seq: 1, depth: 0.6}),
    new Clip({screenshot: 'media/star_head_2.png', media:  'media/2-05.mp4', seq: 1, depth: 0.9}),
    new Clip({screenshot: 'media/star_head_2.png', media:  'media/3-01.mp4', seq: 2, depth: 0.4}),
    new Clip({screenshot: 'media/star_head_2.png', media:  'media/3-05.mp4', seq: 2, depth: 0.8}),
    new Clip({screenshot: 'media/star_head.png', media:  'media/4-01.mp4', seq: 3, depth: 0.1}),
    new Clip({screenshot: 'media/star_head.png', media:  'media/4-02.mp4', seq: 3, depth: 0.3}),
    new Clip({screenshot: 'media/star_head.png', media:  'media/4-04.mp4', seq: 3, depth: 0.5}),
    new Clip({screenshot: 'media/star_head.png', media:  'media/4-05.mp4', seq: 3, depth: 0.7}),
    new Clip({screenshot: 'media/star_head.png', media:  'media/4-06.mp4', seq: 3, depth: 0.9}),
  ]);
});


