imgLoaded = function(img) {
  $(img).addClass('loaded');
  $(img).removeAttr('style');
};

resizeAndOverlay = function(file, callback) {
  EXIF.getData(file, function() {
    var orientation = EXIF.getTag(this, 'Orientation') || 1;
    var mpImg = new MegaPixImage(file);
    // var img = new Image();
    // img.src = imgURL;

    var canvas = document.createElement('canvas'),
    //var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d');

    mpImg.render(canvas, { maxWidth: 1024, maxHeight: 1024, mode: 'square', orientation: orientation }, function(width, height) {

      var watermark = new Image();
      watermark.src = '/img/retarded.png';

      var l = Math.min(width, height);

      watermark.onload = function() {
        var w = l / 1024 * watermark.width << 0,
            h = l / 1024 * watermark.height << 0,
            x = (l - w) / 2 << 0,
            y = (l - h) / 2 << 0;

        ctx.setTransform( 1, 0, 0, 1, 0, 0 );
        ctx.drawImage(watermark, x, y, w, h);
        callback(canvas.toDataURL("image/jpeg"));
      };
    });
  });
};

var stepDown = function(img, tw, th) {
  var steps,
      oc = document.createElement('canvas'),
      ctx = oc.getContext('2d'),
      fc = document.createElement('canvas'),
      w = img.width,
      h = img.height;

  oc.width = w;
  oc.height = h;

  fc.width = tw;
  fc.height = th;

  if ((w / tw) > (h / th)) {
    steps = Math.ceil(Math.log(w / tw) / Math.log(2));
  } else {
    steps = Math.ceil(Math.log(h / th) / Math.log(2));
  }

  if (steps <= 1) {
    ctx = fc.getContext('2d');
    ctx.drawImage(img, 0, 0, tw, th);
    return fc;
  }

  ctx.drawImage(img, 0, 0);
  steps--;

  while(steps > 0) {
    w *= 0.5;
    h *= 0.5;
    ctx.drawImage(oc, 0, 0, w * 2, h * 2,
                      0, 0, w, h);
    steps--;
  }

  ctx = fc.getContext('2d');
  ctx.drawImage(oc, 0, 0, w, h, 0, 0, tw, th);
  return fc;
};
