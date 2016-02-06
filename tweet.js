// requires
var fs = require('fs');

// init
var MAXCHARS = 140;
var HOME     = process.env.HOME;
var twtfile  =  HOME + '/twtxt.txt';
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
