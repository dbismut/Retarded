Meteor.startup(function () {


  Meteor.publish('posts', function(limit) {
    return Posts.find({}, {limit: limit, sort: {createdAt: -1}});
  });

  Meteor.publish('users', function(limit) {
    return Users.find({});
  });


  Posts.deny({
    insert: function(userId, doc) {
      doc.createdAt = new Date().valueOf();
      return false;
    },
    update: function(){ return true;},
    remove: function(){ return true;}
  });

  Posts.allow({
    insert: function(){ return true;},
  });

  var Users = new Meteor.Collection('users');

  Meteor.methods({
    like: function(postid, userid) {

      // var bogus;
      // for (var i=0;i<1000000000;i++) {
      //   bogus = i;
      // }

      if(! Users.findOne({userid: userid}) || Posts.findOne({_id: postid, likes: userid})) {
        throw new Meteor.Error(409, "Bravo, vous venez de hacker le serveur de la NSA.");
      }

      return Posts.update({_id: postid}, {$push: {likes: userid}});
    },
    getUserId: function() {
      var uuid = Meteor.uuid();
      Users.insert({userid: uuid});
      return uuid;
    }
  });


  // for (i=0; i<10;i++) {
  //   Posts.insert({content: 'Ceci est mon image numéro ' + (i+20), imgurl: 'http://lorempixel.com/400/200/fashion/' + i + "/", createdAt: new Date().valueOf()});
  // }

});
