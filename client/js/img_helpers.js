resizeAndOverlay = function(file, callback) {
  var mpImg = new MegaPixImage(file);
  // var img = new Image();
  // img.src = imgURL;

  var canvas = document.createElement('canvas'),
  //var canvas = document.getElementById('canvas'),
      ctx = canvas.getContext('2d');

  mpImg.render(canvas, { maxWidth: 1024, maxHeight: 1024, mode: 'square' }, function(width, height) {

    var watermark = new Image();
    watermark.src = '/img/retarded.png';

    var l = Math.min(width, height);

    watermark.onload = function() {
      var w = watermark.width,
          h = watermark.height,
          x = (l - w) / 2,
          y = (l - h) / 2;

      ctx.drawImage(watermark, x, y, w, h);
      callback(canvas.toDataURL("image/jpeg"));
    };
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
