module.exports = {
  getConfigFile: getConfigFile,
  getConfig: getConfig
};

var debug        = require('debug')('twtxt');
var getUserHome  = require("../lib/helper").getUserHome;

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