Template.upload_modal.helpers({
  disabled: function() {
    return Session.get('uploading') ? 'disabled' : '';
  }
});

Template.upload_modal.events({
  'click button#cancel': function(e) {
    if(this.ajax) this.ajax.abort();
    $('#modal-upload').addClass('animate');
    $('html').removeClass('modal-shown');
    Meteor.setTimeout(function() {
      Session.set('modal', false);
    }, 600);
  },
  'click button#upload': function(e) {
    Session.set('uploading', true);
    this.ajax = $.ajax({
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
          image: localStorage.imgBase64,
          type: 'base64'
      },
    })
    .success(function(result) {
      console.log(result);
      Posts.insert({imgid: result.data.id, imgwidth: result.data.width, imgheight: result.data.height, deletehash: result.data.deletehash});
    })
    .fail(function(error) {
      console.warn("error", error.statusText);
    })
    .done(function() {
      $('#modal-upload').addClass('animate');
      $('html').removeClass('modal-shown');
      Meteor.setTimeout(function() {
        Session.set('modal', false);
      }, 600);
    });
  }
});

Template.upload_modal.destroyed = function() {
  localStorage.removeItem('imgBase64');
  Session.set('uploading', false);
  SELECTED_FILE = null;
  $('html').removeClass('modal-shown');
  Meteor.clearTimeout(this._timeout);
  this._timeout = null;
};

Template.upload_modal.created = function() {
  $('html').addClass('modal-shown');
};

Template.upload_modal.rendered = function() {
  var self = this;
  Meteor.setTimeout(function() {
    $(self.firstNode).removeClass('animate');
  }, 0);

  var spinner = new Spinner({color:'#fff', width:10, radius:41, trail:45}).spin(self.find('.img-wrapper'));

  this._timeout = Meteor.setTimeout(function() {
    resizeAndOverlay(SELECTED_FILE, function(imgURL) {
      localStorage.imgBase64 = imgURL.split(',')[1];
      spinner.stop();
      self.find('.img-preview').src = imgURL;
      $(self.firstNode).addClass('loaded');
    });
  }, 1200);

};
