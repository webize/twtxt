#!/usr/bin/env node

// requires
var fs           = require('fs');
var program      = require('commander');
var request      = require('request');
var debug        = require('debug')('twtxt');
var childProcess = require('child_process');
var readline     = require('readline');
var moment       = require('moment');

var error   = debug('app:error');

// defaults
var default_limit_timeline = 20;


// helper functions

/**
* hook
* @param  {String} hook run a hook
*/
function hook(command) {
  var proc = childProcess.exec(command, function (error, stdout, stderr) {
    if (error) {
      console.error(error.stack);
      console.error('Error code: '+error.code);
      console.error('Signal received: '+error.signal);
    }
    debug('Child Process STDOUT: '+stdout);
    console.error('Child Process STDERR: '+stderr);
  });

  proc.on('exit', function (code) {
    debug('Child process exited with exit code '+code);
  });
}



// config functions

/**
* getUserHome
* @return {String} home directory
*/
function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

/**
* getUserName
* @return {String} user name
*/
function getUserName() {
  return process.env.USER;
}

/**
* gets the default config file
* @return {String} returns location of config file
*/
function getConfigFile() {
  var defaultConfigFile = 'twtxt.json';
  var ret =  getUserHome() + '/.config/' + defaultConfigFile;
  debug('default : ' + ret);
  return program.config || ret;
}

/**
* gets a config
* @return {String} A config
*/
function getConfig() {
  var configFile = getConfigFile();
  debug('getting config from : ' + configFile);
  try {
    var config  = require(configFile);
    debug('config : ');
    debug(config);
    return (config);
  } catch (e) {
    console.error(e);
    process.exit(-1);
  }
}

/**
* write a config file
* @param  {Object} config the config
*/
function writeConfig(config) {
  var configFile = getConfigFile();
  debug('writing : ');
  debug(config);
  fs.writeFile(configFile, JSON.stringify(config), function(err) {
    if (err) {
      console.error(err);
    }
  });
}

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
* writes a tweet
* @param  {String} twtfile file to write to
* @param  {[type]} output  tweet
*/
function writeTweet(twtfile, output) {
  var config = getConfig();
  parseTimeline(twtfile, config.user, function(err, posts) {
    str = '';
    posts = posts.sort(function(a,b){
      return new Date(a.time) > new Date(b.time);
    });
    posts = posts.concat(parsePost(output, config.user));
    var limit_timeline = config.limit_timeline || default_limit_timeline;
    if (posts.length > limit_timeline) {
      posts.splice(0, posts.length - limit_timeline);
    }

    for (var i = 0; i < posts.length; i++) {
      str += posts[i].time + '\t' + posts[i].description + '\n';
    }

    debug('writing ' + twtfile + ' with ' + str);
    fs.writeFile(twtfile, str, function (err) {
      if (err) {
        console.error(err);
      }
    });
  });
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
