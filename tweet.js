#!/usr/bin/env node

// requires
var fs = require('fs');

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
  }
  catch (e) {
    console.log(e);
    process.exit(-1);
  }
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
 * Append a new tweet to your twtxt file.
 * @return {[type]} [description]
 */
function tweet(description) {
  // init
  var twtfile  = getTimellineFile();

  output = serializeTweet(description);

  fs.appendFile(twtfile, output, function (err) {
    if (err) {
      console.error(err);
    }
  });
}


/**
 * run as bin
 */
function bin() {
  var MAXCHARS = 140;
  var description = process.argv[2];

  if (!description) {
    console.error('Usage: twtxt <text>');
    process.exit(-1);
  }

  if (description && description.length > MAXCHARS) {
    console.error('Maximum tweet length : ' + MAXCHARS);
    process.exit(-1);
  }

  tweet(description);
}


// If one import this file, this is a module, otherwise a library
if (require.main === module) {
    bin(process.argv);
}

module.exports = tweet;
