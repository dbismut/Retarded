Meteor.startup(function () {

  Meteor.publish('posts', function(limit) {
    return Posts.find({}, {limit: limit, sort: {createdAt: -1}});
  });

  Posts.deny({insert: function(userId, doc) {
    doc.createdAt = new Date().valueOf();
    return false;
  }});

  Posts.allow({
    insert: function(){ return true;},
    update: function(){ return true;},
    remove: function(){ return true;}
  });

  // for (i=0; i<10;i++) {
  //   Posts.insert({content: 'Ceci est mon image numéro ' + (i+20), imgurl: 'http://lorempixel.com/400/200/fashion/' + i + "/", createdAt: new Date().valueOf()});
  // }

});
