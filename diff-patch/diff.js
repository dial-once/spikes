var colors = require('colors');
var jsdiff = require('diff');
var fs = require('fs');

function __main() {
  if (process.argv[2] === '--help') {
    console.log('NAME:'.blue);
    console.log('   diff - compare two strings');
    console.log('OPTIONS:'.blue);
    console.log('-u'.blue);
    console.log('   create patch file');
    console.log('-c'.blue);
    console.log('   diff by char');
    console.log('-j'.blue);
    console.log('   diff by json');
    console.log('-l'.blue);
    console.log('   diff by line');
    console.log('-w'.blue);
    console.log('   diff by word');
  }

  if (process.argv.length != 5) {
    console.log('Usage: node diff.js [option] [file1] [file2]');
    process.exit(0);
  }
  
  var diff,
    option = process.argv[2],
    fileV1 = process.argv[3],
    fileV2 = process.argv[4],
    strV1 = fs.readFileSync(fileV1, "utf8"),
    strV2 = fs.readFileSync(fileV2, "utf8"),
    headerV1 = fs.statSync(fileV1).ctime,
    headerV2 = fs.statSync(fileV2).ctime;

  switch(option) {
    case '-u':
      var patch = jsdiff.createTwoFilesPatch(fileV1, fileV2, strV1, strV2, headerV1, headerV2);
      console.log('patch length:', patch.length);

      fs.writeFile(fileV1 + 'to' + fileV2 + '.patch', patch, function (err) {
        if (err) console.log();
        else console.log('v1tov2.patch patch file was created successfully');
        process.exit(0);
      });
      return;
      break;
    case '-c':
      diff = jsdiff.diffChars(fileV1, fileV2);
      break;
    case '-j':
      diff = jsdiff.diffJson(fileV1, fileV2);
      break;
    case '-l':
      diff = jsdiff.diffLines(fileV1, fileV2);
      break;
    case '-w':
      diff = jsdiff.diffWords(fileV1, fileV2);
      break;
  }

  console.log('diff length:', diff.length);
  console.log('diff list:', diff);

  diff.forEach(function (part) {
    // green for additions, red for deletions 
    // grey for common parts 
    var color = part.added ? 'green' :
      part.removed ? 'red' : 'grey';
    console.log(colors[color](part.value));
  });

}

__main();