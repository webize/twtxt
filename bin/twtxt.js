#!/usr/bin/env node

// requires
var fs            = require('fs');
var program       = require('commander');
var request       = require('request');
var debug         = require('debug')('twtxt');
var childProcess  = require('child_process');
var readline      = require('readline');
var moment        = require('moment');

var tweet         = require("../lib/cli").tweet;
var follow        = require("../lib/cli").follow;
var unfollow      = require("../lib/cli").unfollow;
var following     = require("../lib/cli").following;
var quickstart    = require("../lib/cli").quickstart;
var timeline      = require("../lib/cli").timeline;


var error   = debug('app:error');

// defaults
var default_limit_timeline = 20;

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
