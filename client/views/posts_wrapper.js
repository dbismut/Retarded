Template.posts_wrapper.helpers({
  'posts': function () {
    return Posts.find({}, {sort: {createdAt: -1}});
  },
  'status': function () {
    return Session.get('status');
  },
  'statusTemplate' : function () {
    return Template[Session.get('status')];
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
  'click button#cancel': function(e) {
    Session.set('status', 'idle');
    $('#ugc-post').html('');
  },
  'change input#picker': function(e) {
    var file = e.target.files[0];

    //var previewURL = URL.createObjectURL(file);

    resizeAndOverlay(file, function(imgURL) {
      $('#ugc-post').html('<img src="' + imgURL +'" class="img-thumbnail" onload="imgLoaded(this)" />');
      localStorage.imageBase64 = imgURL.split(',')[1];
      Session.set('status', 'readyToUpload');
    });
  },
  'click button#upload': function(e) {
    Session.set('status', 'uploading');

    $.ajax({
      xhr: function(){
        var xhr = $.ajaxSettings.xhr();
        xhr.upload.onprogress = function(evt){
          $('#upload-bar').width((evt.loaded/evt.total*100) + '%');
        };
        xhr.upload.onload = function(){console.log('DONE!');};
        return xhr;
        },
        url: 'https://api.imgur.com/3/image',
        method: 'POST',
        headers: {
          Authorization: 'Client-ID 3c9bfbc6d71f353',
          Accept: 'application/json'
        },
        data: {
          image: localStorage.imageBase64,
          type: 'base64'
      },
    })
    .success(function(result) {
      console.log(result);
      Posts.insert({imgid: result.data.id, imgwidth: result.data.width, imgheight: result.data.height, deletehash: result.data.deletehash});
      $('#ugc-post').html('');
    })
    .fail(function(error) {
      console.log("error", error.statusText);
    })
    .done(function() {
      Session.set('status', 'idle');
      localStorage.imageBase64 = null;
    });
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

imgLoaded = function(img) {
  $(img).addClass('loaded');
};
