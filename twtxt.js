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
 * @param  {String} uri  the uri to follow
 */
function follow(user, uri) {
  var config = getConfig();
  config.following = config.follow || [];
  config.following.push( {"user" : user, "uri": uri} );
  writeConfig(config);
  console.log(config);
}


// cli functions
/**
 * run as bin
 */
function bin() {
  var MAXCHARS = 140;

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
    var user = argValue;
    var uri  = uriValue;

    if (!user) {
      console.error('Usage: twtxt follow <user> <uri>');
      process.exit(-1);
    }

    if (!uri) {
      console.error('Usage: twtxt follow <user> <uri>');
      process.exit(-1);
    }

    follow(user, uri);

  } else {
    console.error(cmdValue + ' : not recognized');
  }

}


// If one import this file, this is a module, otherwise a library
if (require.main === module) {
    bin(process.argv);
}

module.exports = tweet;
