module.exports = {
  serializeTweet: serializeTweet,
  parseTimeline: parseTimeline,
  parsePost: parsePost,
  displayPosts: displayPosts
};

var debug        = require('debug')('twtxt');
var getUserHome  = require("../lib/helper").getUserHome;
var fs           = require('fs');
var moment       = require('moment');
var request      = require('request');


/**
* serializes a tweet
* @param  {String} description The desscription
* @param  {[type]} date        Date
* @return {String}             formatted entry
*/
function serializeTweet(description, date) {
  var now    = date || new Date().toISOString();
  var output = now + "\t" + description + '\n';
  debug('blogging : ' + output);
  return output;
}

/**
* parses a post
* @param  {String} post A post
* @param  {String} nick A nick
* @return {Object}      A time, description and nick
*/
function parsePost(post, nick) {
  var vals = post.split('\t');
  return { "time" : vals[0], "description" : vals[1], "nick" : nick };
}

/**
* displays the posts
* @param  {Array} posts the posts to display
*/
function displayPosts(posts) {
  posts = posts.sort(function(a,b){
    return new Date(a.time) > new Date(b.time);
  });
  for (var i = 0; i < posts.length; i++) {
    console.log("➤ " + posts[i].nick + ' (' + moment(posts[i].time).fromNow() + ')');
    console.log(posts[i].description);
  }
}



/**
* parseTimeline
* @param  {String}   uri      which uri
* @param  {String}   nick     which nick
* @param  {Function} callback The callback
*/
function parseTimeline(uri, nick, callback) {
  if (uri && uri.indexOf('http') === 0) {
    request(uri, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var ret = [];
        var arr = body.split('\n');
        for (var i = 0; i < arr.length; i++) {
          if (arr[i]) {
            ret.push(parsePost(arr[i], nick));
          }
        }
        callback(null, (ret));
      } else {
        callback(error);
      }
    });
  } else {
    fs.readFile(uri, "utf-8", function(err, val) {
      if (err) {
        callback(err);
      } else {
        var ret = [];
        var arr = val.split('\n');
        for (var i = 0; i < arr.length; i++) {
          if (arr[i]) {
            ret.push(parsePost(arr[i], nick));
          }
        }
        callback(null, (ret));
      }
    });
  }
}
