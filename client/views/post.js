var LARGE_PREVIEW_WIDTH = 640;

Template.post.helpers({
  'imgurl': function () {
    return this.imgid ? "https://i.imgur.com/" + this.imgid + "l.jpg" : this.imgurl;
  },
  'imgwidth': function() {
    return this.imgwidth ? LARGE_PREVIEW_WIDTH : '';
  },
  'imgheight': function() {
    return this.imgwidth ? LARGE_PREVIEW_WIDTH / this.imgwidth * this.imgheight << 0 : '';
  },
  'imgheight_style': function() {
    return this.calculatedHeight || 'auto';
  },
  'liked': function() {
    return _.contains(this.likes, Session.get('userid')) ? 'liked' : 'notliked';
  },
  'likecount': function() {
    var p = Posts.findOne({_id: this._id});
    return p.likes ? p.likes.length : 0;
  }
});

Template.post.created = function() {
  //calculate height of style for better loading
  this.data.calculatedHeight = this.data.imgwidth ? Math.round($('#wrapper').width() / this.data.imgwidth * this.data.imgheight) + 'px' : 'auto';
};

Template.post.events({
  'click .like.notliked, dblclick .img-thumbnail.notliked': function() {
    Meteor.call('like', this._id, Session.get('userid'), function(err){
      if(err) alert(err.reason);
    });
  }
});
