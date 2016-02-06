var description = process.argv[2];

var now = new Date().toISOString();

var output = now + "\t" + description;

console.log(output);
