function animate(obj, from_x, from_y, to_x, to_y, duration, opt_ca) {
  if (opt_ca) clearInterval(opt_ca);
  from_x -= 570;
  from_y -= 345;
  to_x -= 570;
  to_y -= 345;

  var Y_AXIS = 300;
  if (Math.abs(from_y) >= Y_AXIS) Y_AXIS = Math.abs(from_y) + 1;
  if (Math.abs(to_y) >= Y_AXIS) Y_AXIS = Math.abs(to_y) + 1;

  var ellipse_a1 = Math.sqrt(
    from_x * from_x / (1 - (from_y * from_y / Y_AXIS / Y_AXIS)));
  var ellipse_a2 = Math.sqrt(
    to_x * to_x / (1 - (to_y * to_y / Y_AXIS / Y_AXIS)));

  var easer = d3.ease('cubic-in-out');
  var start = new Date().getTime();
  var intv = setInterval(function() {
    var cur = new Date().getTime();
    var incr = easer((cur - start) / parseFloat(duration));
    if (incr >= 1) {
      obj.css({'top': to_y + 345, 'left': to_x + 570});
      clearInterval(intv);
      return;
    }
    var pos_x = (
     (1-incr) * from_x + incr * to_x);
    var ellipse_a = (
     (1-incr) * ellipse_a1 + incr * ellipse_a2);
    var pos_y = Math.sqrt(
      Y_AXIS * Y_AXIS * (1 - (pos_x * pos_x / ellipse_a / ellipse_a)));
    if (to_y < 0) pos_y = -pos_y;
    obj.css({
      'top': pos_y + 345,
      'left': pos_x + 570
    });
   }, 10);
   return intv;
}
function animateLinear(obj, from_x, from_y, to_x, to_y, duration, opt_ca) {
  if (opt_ca) clearInterval(opt_ca);
  var easer = d3.ease('cubic-in-out');
  var start = new Date().getTime();
  var intv = setInterval(function() {
    var cur = new Date().getTime();
    var incr = easer((cur - start) / parseFloat(duration));
    if (incr >= 1) {
      obj.css({'top': to_y, 'left': to_x});
      clearInterval(intv);
      return;
    }
    obj.css({'top': ((1-incr) * from_y + incr * to_y),
             'left': ((1-incr) * from_x + incr * to_x)});
   }, 10);
  return intv;
}
function animateChapter(obj, old_left, old_width, new_left, new_width, duration, opt_ca) {
  if (opt_ca) clearInterval(opt_ca);
  var old_right = old_left + old_width;
  var new_right = new_left + new_width;
  var easer = d3.ease('cubic-in-out');
  var start = new Date().getTime();
  var intv = setInterval(function() {
    var cur = new Date().getTime();
    var incr = easer((cur - start) / parseFloat(duration));
    if (incr >= 1) {
      obj.css({'left': new_left, 'width': new_width});
      clearInterval(intv);
      return;
    }
    var left = ((1-incr) * old_left + incr * new_left);
    var right = ((1-incr) * old_right + incr * new_right);
    obj.css({'left': left,
             'width': right - left});
   }, 10);
  return intv;
}
function getChapterLeft(seq_diff) {
  var newLeft = seq_diff * 80;
  if (newLeft > 0) newLeft += 810; else newLeft += 310;
  if (newLeft > 1060) newLeft = 1060;
  if (newLeft < 0) newLeft = 0;
  return newLeft;
}

function Chapter(color, seq) {
  this.dom = $('<div class="chapter"/>')
     .css('background-color', color);
  var number = this.dom.append('<span>' + (seq+1) + '</span>');
  number.on('click', function() {
    var media = CLIPS.playNext(seq);
    $('#player').attr('src', bestVid.media);
    PLAYER.play();
  });
  this.dom.appendTo($('#viewport'));
  this.seq = seq;
}
Chapter.prototype.setPos = function(ctx, opt_noAnimate) {
  var oldLeft = parseFloat(this.dom.css('left'));
  var oldWidth = parseFloat(this.dom.css('width'));
  var newWidth = (ctx.seq == this.seq) ? 580 : 80;
  var newLeft = getChapterLeft(this.seq - ctx.seq);
  if (newLeft == 1060 || newLeft == 0) {
      newWidth = 0;
  }
  if (opt_noAnimate) {
    this.dom.css({'left': newLeft, 'width': newWidth});
  } else {
    this.ca = animateChapter(
      this.dom, oldLeft, oldWidth, newLeft, newWidth, 3000, this.ca);
  }
};

function Clip(screenshot, media, seq, depth, title) {
  if (typeof screenshot == 'object') {
    media = screenshot.media;
    seq = screenshot.seq;
    depth = screenshot.depth;
    title = screenshot.title;
    speakername = screenshot.speakername;
    screenshot = screenshot.screenshot;
  }


  this.dom = $('<div class="clip"><i class="playbutton fa fa-play"></i></div>')
    .css('background-image', 'url("' + screenshot + '")');
  // TODO: mask
  this.screenshot = screenshot;
  this.media = media;
  this.depth = depth;
  this.seq = seq;
  this.title = title;
  this.speakername = speakername;
}
Clip.prototype.setPos = function(ctx, lowest, opt_noAnimate) {
  // TODO: actual animation w/ circular paths around main video
  var oldLeft = parseFloat(this.dom.css('left')),
      oldTop = parseFloat(this.dom.css('top'));
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
      this.ca = animateLinear(
        this.dom,
        oldLeft, oldTop,
        365, 85,
        3000, this.ca); 
    }
    return -1;
  }
  this.dom.css('opacity', '1');
  var newTop, newLeft, newWidth, newHeight;
  if (this.seq == ctx.seq) {
    newTop = (this.depth < ctx.video_depth) ? 15 : 645;
    newLeft =  360 + (100 * this.depth_order);
    if (newLeft >= 560) newLeft += 140;
    newWidth = 75;
    newHeight = 75;
  } else {
    var depthFactor = 1.2 - (1/(1 + Math.exp(4 - 8 * Math.abs(this.depth - ctx.depth))));
    var seqFactor = 1 / Math.pow(Math.abs(this.seq - ctx.seq), 0.5);
    var sizeFactor = depthFactor * seqFactor;

    newLeft = getChapterLeft(this.seq - ctx.seq);
    if (newLeft == 1060 || newLeft == 0) {
      sizeFactor = 0;
    }
    newLeft += 40 - (25 * sizeFactor);

    var vertRange = 720 / Math.pow(Math.abs(this.seq - ctx.seq), 0.7);
    var vertNoise = Math.random() * 20 - 10;

    newTop = vertNoise - (25 * sizeFactor) + 360 +
	    (this.depth - ctx.depth)/2 * vertRange;
    if (newTop < lowest) newTop = lowest;

    newWidth = 50 * sizeFactor;
    newHeight = 50 * sizeFactor;
  }
  this.dom.css({
    'width': newWidth,
    'height': newHeight,
    'margin-top': -.18 * newHeight,
    'font-size': .36 * newWidth
  });
  if (opt_noAnimate) {
    this.dom.css({'top': newTop, 'left': newLeft});
  } else {
    if (Math.abs(oldLeft - newLeft) < 10) {
      this.ca = animateLinear(this.dom, oldLeft, oldTop, newLeft, newTop, 3000, this.ca);
    } else {
      this.ca = animate(this.dom, oldLeft, oldTop, newLeft, newTop, 3000, this.ca);
    }
  }
  return newTop + newHeight - (.18 * newHeight);
}
Clip.prototype.setPlaying = function(playing) {
  this.playing = playing;
}
Clip.prototype.preview = function(){
    return '<div class="preview_part">Part ' + (this.seq + 1) + '</div> <img width="150px" height="150px" id="preview_screenshot" src="' + this.screenshot + '" /> <div id="preview_speakername">' + this.speakername + '</div><div id="preview_title">' + this.title + '</div>'

}
Clip.prototype.setPlaying = function(playing) {
  this.playing = playing;
}
Clip.prototype.show = function(ctx, lowest) {
  var that = this;
  var newLowest = this.setPos(ctx, lowest, true);
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
  return newLowest;
}

function Clips(vid_list, chapter_list) {
  this.context = {
    depth: 0.5,
    seq: -1,
    video_depth: 0.5
  }; 
  this.videos = vid_list;
  this.chapters = chapter_list;
  var depth_order = 0;
  for (var i = 0; i < this.videos.length; ++i) {
    if (i > 0 && this.videos[i].seq > this.videos[i-1].seq) {
      depth_order = 0;
    } 
    this.videos[i].depth_order = depth_order;
    ++depth_order;
  }
}
Clips.prototype.showTitles = function(){
  $('#playing-title').text(this.context.title);
  $('#playing-speakername').text(this.context.speakername);
  $('#player-titles').show();

}
Clips.prototype.play = function(playing) {
  var clips = this;
  this.context.seq = playing.seq;
  this.context.video_depth = playing.depth;
  this.context.title = playing.title;
  this.context.speakername = playing.speakername;
  var lowest = 0;
  var seq = 0;
  this.videos.forEach(function(video) {
    video.setPlaying(video == playing);
    if (video.seq != seq) {
      lowest = 0;
      seq = video.seq;
    }
    lowest = video.setPos(clips.context, lowest);
  });
  this.chapters.forEach(function(chapter) {
    chapter.setPos(clips.context); 
  });
}
Clips.prototype.setCurDepth = function(cur_depth) {
  var clips = this;
  this.context.depth = cur_depth;
  var lowest = 0;
  var seq = 0;

  var playingVid = null;
  var playingDiff = 2;
  var bestVid = null;
  var bestDiff = 2;

  this.videos.forEach(function(video) {
    if (video.playing) {
      playingVid = video;
      playingDiff = Math.abs(video.depth - clips.context.depth);
    }
    if (video.seq == clips.context.seq) {
      var diff = Math.abs(video.depth - clips.context.depth);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestVid = video;
      }
    }
    if (video.seq != seq) {
      lowest = 0;
      seq = video.seq;
    }
    lowest = video.setPos(clips.context, lowest);
  });

  if (playingDiff - bestDiff > 0.1) {
    this.play(bestVid);
    $('#player').attr('src', bestVid.media);
    PLAYER.play();
  }
}
Clips.prototype.show = function()  {
  var clips = this;
  var lowest = 0;
  var seq = 0;
  this.videos.forEach(function(video) {
    if (video.seq != seq) {
      lowest = 0;
      seq = video.seq;
    }
    lowest = video.show(clips.context, lowest);
  });
  this.chapters.forEach(function(chapter) {
    chapter.setPos(clips.context, true); 
  });
}
Clips.prototype.playNext = function(opt_new_seq) {
  var clips = this;
  var new_seq = this.context.seq + 1;
  if (opt_new_seq !== undefined) {
    new_seq = opt_new_seq;
  }
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
    new Clip({screenshot: 'media/star_head.png', media:  'media/1-07.mp4', seq: 0, depth: 0.2, speakername: 'Horatio Darkmatter', title: 'Physics is Poetry'}),
    new Clip({screenshot: 'media/star_head.png', media:  'media/1-08.mp4', seq: 0, depth: 0.5, speakername: 'Horatio Darkmatter', title: 'Physics is Poetry'}),
    new Clip({screenshot: 'media/star_head_2.png', media:  'media/1-09.mp4', seq: 0, depth: 0.7, speakername: 'Horatio Darkmatter', title: 'Physics is Poetry'}),
    new Clip({screenshot: 'media/star_head.png', media:  'media/2-01.mp4', seq: 1, depth: 0.1, speakername: 'Horatio Darkmatter', title: 'Physics is Poetry'}),
    new Clip({screenshot: 'media/star_head.png', media:  'media/2-03.mp4', seq: 1, depth: 0.2, speakername: 'Horatio Darkmatter', title: 'Physics is Poetry'}),
    new Clip({screenshot: 'media/star_head_2.png', media:  'media/2-04.mp4', seq: 1, depth: 0.6, speakername: 'Horatio Darkmatter', title: 'Physics is Poetry'}),
    new Clip({screenshot: 'media/star_head_2.png', media:  'media/2-05.mp4', seq: 1, depth: 0.9, speakername: 'Horatio Darkmatter', title: 'Physics is Poetry'}),
    new Clip({screenshot: 'media/star_head_2.png', media:  'media/3-01.mp4', seq: 2, depth: 0.4, speakername: 'Horatio Darkmatter', title: 'Physics is Poetry'}),
    new Clip({screenshot: 'media/star_head_2.png', media:  'media/3-05.mp4', seq: 2, depth: 0.8, speakername: 'Horatio Darkmatter', title: 'Physics is Poetry'}),
    new Clip({screenshot: 'media/star_head.png', media:  'media/4-01.mp4', seq: 3, depth: 0.1, speakername: 'Horatio Darkmatter', title: 'Physics is Poetry'}),
    new Clip({screenshot: 'media/star_head.png', media:  'media/4-02.mp4', seq: 3, depth: 0.3, speakername: 'Horatio Darkmatter', title: 'Physics is Poetry'}),
    new Clip({screenshot: 'media/star_head.png', media:  'media/4-04.mp4', seq: 3, depth: 0.5, speakername: 'Horatio Darkmatter', title: 'Physics is Poetry'}),
    new Clip({screenshot: 'media/star_head.png', media:  'media/4-06.mp4', seq: 3, depth: 0.9, speakername: 'Horatio Darkmatter', title: 'Physics is Poetry'})
  ],
  [new Chapter('#070711', 0),
   new Chapter('#09091B', 1),
   new Chapter('#0B0B26', 2),
   new Chapter('#0D0D30', 3)]);
});


