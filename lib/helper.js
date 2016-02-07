module.exports = {
  hook: hook,
  getUserHome: getUserHome,
  getUserName: getUserName
};

var childProcess = require('child_process');
var debug        = require('debug')('twtxt');

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
