'use strict';

var fs = require('fs'),
  async = require('async'),
  uuid = require('node-uuid'),
  spawn = require('child_process').spawn,
  StringDecoder = require('string_decoder').StringDecoder,
  exec = require('child_process').exec,
  Benchmark = require('benchmark');

var suite = new Benchmark.Suite;


function diff(strV1, strV2) {
  var tasks = [];

  strV1 = (typeof strV1 === 'string') ? strV1 : JSON.stringify(strV1, null, 2);
  strV2 = (typeof strV2 === 'string') ? strV2 : JSON.stringify(strV2, null, 2);

  tasks.push(function (done) {
    fs.writeFile('fileV1', strV1, function (err) {
      if (err) return console.error(err);

      done();
    });
  });

  tasks.push(function (done) {
    fs.writeFile('fileV2', strV2, function (err) {
      if (err) return console.error(err);

      done();
    });
  });

  async.parallel(tasks, function () {
    exec('diff -u fileV1 fileV2', { maxBuffer: 1000 * 1024 }, function (error, stdout, stderr) {
      var diff = stdout;

      exec('rm -rf fileV1 fileV2', function (error, stdout, stderr) {
        console.log(diff);
      });
    });
  });
}

function createAsyncTask(fileName, jsonString) {
  jsonString = (typeof jsonString === 'string') ? jsonString : JSON.stringify(jsonString, null, 2);
  jsonString += '\n'; // to remove the \ No newline at end of file

  return function (done) {
    fs.writeFile(fileName, jsonString, function (err) {
      if (err) return console.error(err);

      done();
    });
  };
}

function unixDiff(type, jsonV1, jsonV2) {
  var fileV1 = uuid.v4(),
    fileV2 = uuid.v4(),
    tasks = [];

  tasks.push(createAsyncTask(fileV1, jsonV1));
  tasks.push(createAsyncTask(fileV2, jsonV2));

  return new Promise(function (resolve, reject) {
    async.parallel(tasks, function () {
      var cmd = 'diff -u ' + fileV1 + ' ' + fileV2,
        decoder = new StringDecoder('utf8'),
        diffCmd = spawn('bash', ['-c', cmd]),
        diff = '';

      diffCmd.stdout.on('data', function (data) {
        diff += decoder.write(data);
      });

      diffCmd.stderr.on('data', function (data) {
        console.error('stderr: ' + data);
        reject(decoder.write(data));
      });

      diffCmd.on('close', function () {
        cmd = 'rm ' + fileV1 + ' ' + fileV2;
        spawn('bash', ['-c', cmd]);
        if (type === 'substring') {
          diff = diff.substring(diff.indexOf("@"));
        } else if (type === 'split-slice-joint') {
          diff = diff.split('\n').slice(2).join('\n');
        }
        resolve(diff);
      });

      diffCmd.on('error', function (err) {
        console.error(err);
        reject(err);
      });
    });
  });
}

suite.add('substring', function () {
  unixDiff('substring', fs.readFileSync(process.argv[2], 'utf8'), fs.readFileSync(process.argv[3], 'utf8'))
  .then(function (patch) {
    // console.log(patch);
  });
})
.add('split-slice-join', function () {
  unixDiff('split-slice-join', fs.readFileSync(process.argv[2], 'utf8'), fs.readFileSync(process.argv[3], 'utf8'))
  .then(function (patch) {
    // console.log(patch);
  });
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': true });