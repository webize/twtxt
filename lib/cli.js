module.exports = {
  tweet: tweet,
  follow: follow,
  unfollow: unfollow,
  following: following,
  quickstart: quickstart,
  timeline: timeline
};

// requires
var fs              = require('fs');
var program         = require('commander');
var request         = require('request');
var debug           = require('debug')('twtxt');
var childProcess    = require('child_process');
var readline        = require('readline');
var moment          = require('moment');

var writeTweet       = require("../lib/file").writeTweet;

var hook            = require("../lib/helper").hook;
var getUserHome     = require("../lib/helper").getUserHome;
var getUserName     = require("../lib/helper").getUserName;

var getConfigFile   = require("../lib/config").getConfigFile;
var getConfig       = require("../lib/config").getConfig;
var getTimelineFile = require("../lib/config").getTimelineFile;

var parseTimeline   = require("../lib/parser").parseTimeline;
var displayPosts    = require("../lib/parser").displayPosts;
var serializeTweet  = require("../lib/parser").serializeTweet;

var error   = debug('app:error');

// defaults
var default_limit_timeline = 20;



/**
* Append a new tweet to your twtxt file.
* @return {[type]} [description]
*/
function tweet(description) {
  // init
  var config   = getConfig();
  var twtfile  = getTimelineFile();
  output       = serializeTweet(description);

  writeTweet(twtfile, output);
  if (config.post_tweet_hook) {
    hook(config.post_tweet_hook);
  }
}

/**
* follow a user
* @param  {String} user the user to follow
*/
function follow(user, uri) {
  var config = getConfig();
  config.following = config.following || [];
  config.following.push( {"user" : user, "uri": uri} );
  writeConfig(config);
  debug(config);
  console.log("✓ You’re now following "+user+".");
}

/**
* list following
*/
function following() {
  var config = getConfig();
  config.following = config.following || [];
  for (var i = 0; i < config.following.length; i++) {
    console.log('➤ ' + config.following[i].user + ' @ ' + config.following[i].uri);
  }
}

/**
* unfollow a user
* @param  {String} user the user to follow
*/
function unfollow(user) {
  var config = getConfig();
  config.following = config.following || [];
  for (var i = 0; i < config.following.length; i++) {
    if (config.following[i] && config.following[i].user === user ) {
      config.following.splice(i,1);
    }
  }
  writeConfig(config);
  debug(config);
  console.log("✓ You’ve unfollowed "+user+".");
}

/**
* list following
*/
function timeline() {
  var config = getConfig();
  var nick = config.user || 'you';
  var following = config.following || [];
  var fetched = 0;
  var sources = 1 + following.length;
  var posts = [];

  function callback(err, val) {
    fetched++;
    if (err) {
      console.error(err);
    } else {
      posts = posts.concat(val);
      if (fetched === sources) {
        displayPosts(posts);
      }
    }
  }

  // local
  var twtfile  = getTimelineFile();
  parseTimeline(twtfile, nick, callback);

  // remote
  for (var i = 0; i < following.length; i++) {

    var uri = following[i].uri;
    parseTimeline(uri, following[i].user, callback);

  }

}

/**
* quick start
*/
function quickstart() {

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  var help = "This wizard will generate a basic configuration file for twtxt with all mandatory options set. Have a look at the README.rst to get information about the other available options and their meaning.";

  console.log(help);
  var defaultNick = getUserName();
  var defaultPath = getTimelineFile();
  var defaultFollow = true;

  rl.question('➤ Please enter your desired nick: ( '+ defaultNick +' ) ', function(nick)  {
    nick = nick || defaultNick;

    rl.question('➤ Please enter the desired location for your twtxt file: ( '+ defaultPath +' ) ', function(path)  {
      path = path || defaultPath;

      rl.question('➤ Do you want to follow the twtxt news feed?: ( '+ (defaultFollow?'y':'n') + ' ) ', function(follow)  {
        follow = follow || defaultFollow;
        debug('Thank you: ', nick);
        debug('Path: ', path);
        debug('Follow: ', follow);

        config = {};
        config.user = nick;
        config.twtfile = path;
        config.limit_timeline = "20";
        if (follow) {
          config.following = [ {"user" : "twtxt", "uri": "https://buckket.org/twtxt_news.txt" }];
          rl.close();
          debug(config);
          fs.writeFile(getConfigFile(), JSON.stringify(config));
          console.log('✓ Created config file at ' + getConfigFile());
        }

      });

    });

  });

}
