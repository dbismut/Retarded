Template.posts_wrapper.helpers({
  'modal': function () {
    return Session.get('modal') ? Template[Session.get('modal')] : null;
  },
  'posts': function () {
    return Posts.find({}, {sort: {createdAt: -1}});
  },
  'status': function () {
    return Session.get('status');
  },
  'posts_loading': function() {
    return Session.get('posts_loading');
  }
});

Template.posts_wrapper.events({
  'click button#load': function() {
    var curLimit = Session.get('limit');
    Session.set('limit', curLimit + 5);
  },
  'click button#picker-trigger': function(e) {
    $('#picker').trigger('click', e);
  },
  'change input#picker': function(e) {
    SELECTED_FILE = e.target.files[0];
    Session.set('modal', 'upload_modal');
    e.target.value = null;
  }
});

Template.posts_wrapper.rendered = function() {
  window.onscroll = _.debounce(loadMorePosts, 200);
};

var loadMorePosts = function(ev) {
  if (!Session.get('posts_loading') && (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
    var curLimit = Session.get('limit');
    Session.set('posts_loading', true);
    Session.set('limit', curLimit + 5);
  }
};
