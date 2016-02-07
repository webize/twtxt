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


// twtxt functions
/**
 * Append a new tweet to your twtxt file.
 * @return {[type]} [description]
 */
function tweet() {
  // init
  var MAXCHARS = 140;
  var HOME     = getUserHome();
  var twtfile  = HOME + '/twtxt.txt';
  var now      = new Date().toISOString();

  var description = process.argv[2];

  if (!description) {
    console.error('Usage: twtxt <text>');
    process.exit(-1);
  }

  if (description && description.length > MAXCHARS) {
    console.error('Maximum tweet length : ' + MAXCHARS);
    process.exit(-1);
  }


  var output = now + "\t" + description + '\n';
  console.log('blogging : ' + output);

  fs.appendFile(twtfile, output, function (err) {
    if (err) {
      console.error(err);
    }
  });
}


tweet();
