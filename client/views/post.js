var LARGE_PREVIEW_WIDTH = 640,
    WRAPPER_WIDTH = 640;

Template.post.helpers({
  'imgurl': function () {
    return this.imgid ? "https://i.imgur.com/" + this.imgid + "l.jpg" : this.imgurl;
  },
  'imgwidth': function() {
    return this.imgwidth ? LARGE_PREVIEW_WIDTH : '';
  },
  'imgheight': function() {
    return this.imgwidth ? Math.round(LARGE_PREVIEW_WIDTH / this.imgwidth * this.imgheight) : '';
  },
  'imgheight_style': function() {
    return this.imgwidth ? Math.round((document.body.offsetHeight - 38) / 2 / this.imgwidth * this.imgheight) + 'px' : 'auto';
  }
});
