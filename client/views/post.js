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
    return this.imgwidth ? Math.round((document.body.offsetWidth - 39) / 2 / this.imgwidth * this.imgheight) + 'px' : 'auto';
  },
  'likecount': function() {
    var p = Posts.findOne({_id: this._id});
    return p.likes ? p.likes.length : 0;
  }
});

Template.post.events({
  'click .like': function() {
    // if (! Posts.findOne({_id: this._id, likes: Session.get('userid')}))
    //   Posts.update({_id: this._id}, {$push: {likes: Session.get('userid')}});
    // console.log(Posts.findOne({_id: this._id}));
    //
    console.log('trying to like');
    Meteor.call('like', this._id, Session.get('userid'), function() {
      console.log('just liked');
    });
  }
});
