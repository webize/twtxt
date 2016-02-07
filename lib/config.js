module.exports = {
  getConfigFile: getConfigFile,
  getConfig: getConfig,
  getTimelineFile: getTimelineFile
};

var debug        = require('debug')('twtxt');
var getUserHome  = require("../lib/helper").getUserHome;
var program      = require('commander');


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
