#!/usr/bin/env node

// requires
var fs            = require('fs');
var program       = require('commander');
var request       = require('request');
var debug         = require('debug')('twtxt');
var childProcess  = require('child_process');
var readline      = require('readline');
var moment        = require('moment');

var hook          = require("../lib/helper").hook;
var getUserHome   = require("../lib/helper").getUserHome;
var getUserName   = require("../lib/helper").getUserName;

var getConfigFile = require("../lib/config").getConfigFile;
var getConfig     = require("../lib/config").getConfig;


var error   = debug('app:error');

// defaults
var default_limit_timeline = 20;

// config functions


// twtxt functions

/**
* returns location of timeline
* @return {[String]} location of timeline
*/
function getTimelineFile() {
  var config   = getConfig();

  var HOME     = getUserHome();
  var timelineFile  = HOME + '/' + filename;

  var filename = config.twtfile || timelineFile;

  return filename;
}



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

// cli functions
/**
* run as bin
*/
function bin() {
  var MAXCHARS = 140;
  var user;
  var uri;

  program
  .arguments('<cmd> [arg] [uri]')
  .option('-c, --config <path>', 'Specify a custom config file location.')
  .option('-v, --verbose', 'Enable verbose output for deubgging purposes')
  .option('--version', 'Shows the version and exit.')
  .action(function (cmd, arg, uri) {
    cmdValue = cmd;
    argValue = arg;
    uriValue = uri;
  });

  program.parse(process.argv);

  if (typeof cmdValue === 'undefined') {
    console.error('no command given!');
    process.exit(1);
  }
  if (program.verbose) {
    process.env.DEBUG = 'twtxt';
    debug = console.log;
  }
  debug('command:', cmdValue);
  debug('arg: ', argValue || "no arg given");
  debug('uri: ', uriValue || "no uri given");
  debug('verbose: ' + program.verbose);

  if (cmdValue === 'tweet') {
    var description = argValue;

    if (!description) {
      console.error('Usage: twtxt tweet <text>');
      process.exit(-1);
    }

    if (description && description.length > MAXCHARS) {
      console.error('Maximum tweet length : ' + MAXCHARS);
      process.exit(-1);
    }

    tweet(description);
  } else if (cmdValue === 'follow') {
    user = argValue;
    uri  = uriValue;

    if (!user) {
      console.error('Usage: twtxt follow <user> <uri>');
      process.exit(-1);
    }

    if (!uri) {
      console.error('Usage: twtxt follow <user> <uri>');
      process.exit(-1);
    }

    follow(user, uri);

  } else if (cmdValue === 'unfollow') {
    user = argValue;

    if (!user) {
      console.error('Usage: twtxt unfollow <user>');
      process.exit(-1);
    }

    unfollow(user);

  } else if (cmdValue === 'following') {
    following();

  } else if (cmdValue === 'timeline') {
    timeline();

  } else if (cmdValue === 'quickstart') {
    quickstart();

  } else {
    console.error(cmdValue + ' : not recognized');
  }

}


// If one import this file, this is a module, otherwise a library
if (require.main === module) {
  bin(process.argv);
}

module.exports = {
  tweet: tweet,
  follow: follow,
  unfollow: unfollow,
  following: following,
  timeline: timeline
};
