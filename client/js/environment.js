Session.set('status', 'idle');
Session.set('limit', 5);

if (! $.cookie('userid')) {
  Meteor.call('getUserId', function(err, userid) {
    $.cookie('userid', userid, {expires: 365});
    Session.set('userid', $.cookie('userid'));
  });
}
else Session.set('userid', $.cookie('userid'));

Deps.autorun(function() {
  Meteor.subscribe('posts', Session.get('limit'), function() {
    Session.set('posts_loading', false);
  });
});

Meteor.methods({
  like: function(postid, userid) {
    if (this.isSimulation) {
      Posts.update({_id: postid}, {$push: {likes: userid}});
      console.log('updating collection in simulation');
      return;
    }
  }
});
