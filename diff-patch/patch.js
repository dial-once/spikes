require('colors')
var jsdiff = require('diff');
var fs = require('fs')

function __main() {
  if (process.argv.length != 4) {
    console.log('Usage: node patch.js [source] [patch]');
    process.exit(0);
  }

  var patched,
    opt = process.argv[2].split('.'),
    name = opt[0] + '.patched.' + opt[1],
    source = fs.readFileSync(process.argv[2], "utf8"),
    patch = fs.readFileSync(process.argv[3], "utf8");

  patched = jsdiff.applyPatch(source, patch);

  fs.writeFile(name, patched, function (err) {
    if (err) console.error(err);
    else console.log(name + ' patched file based on ' + process.argv[2] + ' was successfully created');
    process.exit(0);
  });

}

__main();