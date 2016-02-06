var fs = require('fs');

var description = process.argv[2];

var now = new Date().toISOString();

var output = now + "\t" + description + '\n';

console.log(output);

var HOME = process.env['HOME'];

var twtfile =  HOME + '/twtxt.txt';

fs.appendFile(twtfile, output, function (err) {
  if (err) {
    console.error(err);
  }
});
