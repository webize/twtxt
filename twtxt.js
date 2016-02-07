#!/usr/bin/env node

// requires
var fs      = require('fs');
var program = require('commander');

// config functions

/**
 * getUserHome
 * @return {String} home directory
 */
function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

/**
 * gets the default config file
 * @return {String} returns location of config file
 */
function getConfigFile() {
  var defaultConfigFile = 'twtxt.json';
  var ret =  getUserHome() + '/.config/' + defaultConfigFile;
  console.log('default : ' + ret);
  return ret;
}

/**
 * gets a config
 * @return {String} A config
 */
function getConfig() {
  var configFile = getConfigFile();
  console.log('getting config from : ' + configFile);
  try {
   var config  = require(configFile);
   console.log('config : ');
   console.log(config);
   return (config);
  } catch (e) {
    console.log(e);
    process.exit(-1);
  }
}

/**
 * write a config file
 * @param  {Object} config the config
 */
function writeConfig(config) {
  var configFile = getConfigFile();
  console.log('writing : ');
  console.log(config);
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
function getTimellineFile() {
  var config   = getConfig();

  var HOME     = getUserHome();
  var timelineFile  = HOME + '/' + filename;

  var filename = config.twtfile || timelineFile;

  return timelineFile;
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
  console.log('blogging : ' + output);
  return output;
}

/**
 * parseTimeline
 * @param  {String}   file     which file
 * @param  {String}   nick     which nick
 * @param  {Function} callback The callback
 */
function parseTimeline(file, nick, callback) {
  fs.readFile(file, "utf-8", function(err, val) {
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
  fs.appendFile(twtfile, output, function (err) {
    if (err) {
      console.error(err);
    }
  });
}

/**
 * Append a new tweet to your twtxt file.
 * @return {[type]} [description]
 */
function tweet(description) {
  // init
  var twtfile  = getTimellineFile();
  output = serializeTweet(description);
  writeTweet(twtfile, output);

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
  console.log(config);
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
  console.log(config);
}

/**
 * list following
 */
function timeline() {
  var config = getConfig();
  var nick = config.nick || 'you';
  var twtfile  = getTimellineFile();
  var posts = parseTimeline(twtfile, nick, function(err, val) {
    if (err) {
      console.error(err);
    } else {
      for (var i = 0; i < val.length; i++) {
        console.log("➤ " + val[i].nick + ' (' + val[i].time + ')');
        console.log(val[i].description);
      }
    }
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
  console.log('command:', cmdValue);
  console.log('arg:', argValue || "no arg given");
  console.log('uri:', uriValue || "no uri given");

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
}
