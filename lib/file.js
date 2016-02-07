module.exports = {
  writeConfig: writeConfig,
  writeTweet: writeTweet
};

var debug         = require('debug')('twtxt');
var fs            = require('fs');

var getUserHome   = require("../lib/helper").getUserHome;
var configFile    = require("../lib/config").configFile;
var getConfig     = require("../lib/config").getConfig;
var parsePost     = require("../lib/parser").parsePost;
var parseTimeline = require("../lib/parser").parseTimeline;

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
